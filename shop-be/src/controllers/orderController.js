import { DISCOUNT_TYPE, isOrderCancellable, isValidOrderStatus, ORDER_STATUS, RES_MESSAGES } from "../utils/constants.js";
import pool from "../config/database.js";
import { createPaypalOrder } from "../config/paypal.js";

//#region Web api
export const getAllOrdersByAdmin = async (req, res) => {
    try {
        const [orders] = await pool.query(
            "SELECT * FROM `order`",
        );

        res.status(200).json({
            message: "",
            data: orders,
        });
    } catch (error) {
        console.log("orderController::getAllOrdersByAdmin => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};

export const changeOrderStatusByAdmin = async (req, res) => {
    const data = req.body;
    try {
        // Validate
        const [[orderExists]] = await pool.query(
            "SELECT COUNT(*) AS count FROM `order` WHERE order_id = ?",
            [data.order_id]
        );
        if (!orderExists.count) {
            return res.status(404).json({
                message: RES_MESSAGES.ORDER_NOT_EXIST,
                data: "",
            });
        }

        // if new status is 'cancelled' then it's invalid
        if (data.new_status === ORDER_STATUS.CANCELLED) {
            return res.status(400).json({
                message: RES_MESSAGES.INVALID_ORDER_STATUS,
                data: "",
            });
        }

        // if order is already cancelled, we won't change the order status
        if (data.status === ORDER_STATUS.CANCELLED) {
            return res.status(400).json({
                message: RES_MESSAGES.ORDER_ALREADY_CANCELLED,
                data: "",
            });
        }

        // Change order status
        await pool.query("UPDATE `order` SET status = ?, modified_date = NOW() WHERE order_id = ?", [data.new_status, data.order_id]);

        // Re-fetch order to return
        const [returnedOrder] = await pool.query("SELECT * FROM `order` WHERE order_id = ?", [data.order_id]);

        res.status(200).json({
            message: RES_MESSAGES.CHANGE_ORDER_STATUS_SUCCESS,
            data: returnedOrder[0]
        });
    } catch (error) {
        console.log("orderController::changeOrderStatusByAdmin => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};
//#endregion

//#region App api
export const createOrder = async (req, res) => {
    const order = req.body;
    try {
        // Validate
        const [[userExists]] = await pool.query(
            "SELECT COUNT(*) AS count FROM `user` WHERE user_id = ?",
            [order.user_id]
        );
        if (!userExists.count) {
            return res.status(400).json({
                message: RES_MESSAGES.USER_NOT_EXIST,
                data: "",
            });
        }

        // Calculate order amount
        order.total_price = 0;
        order.discount_amount = 0;
        for (let variant of order.variants) {
            variant.subtotal = variant.price * variant.quantity;
            order.total_price += variant.price * variant.quantity;
        }
        order.final_price = order.total_price;


        // Process voucher 
        if (order.voucher_id) {
            // Check if voucher exists
            const [[existingVoucher]] = await pool.query(
                "SELECT * FROM `voucher` WHERE voucher_id = ?",
                [order.voucher_id]
            );
            if (!existingVoucher) {
                return res.status(404).json({
                    message: RES_MESSAGES.VOUCHER_NOT_EXIST,
                    data: "",
                });
            }

            // Check if voucher quantity is > 0
            if (existingVoucher.quantity <= 0) {
                return res.status(400).json({
                    message: RES_MESSAGES.VOUCHER_NOT_AVAILABLE,
                    data: "",
                });
            }

            // Check if user already used the voucher
            const [[voucherUsageExists]] = await pool.query(
                "SELECT COUNT(*) AS count FROM `voucher_usage` WHERE user_id = ? AND voucher_id = ?",
                [order.user_id, order.voucher_id]
            );
            if (voucherUsageExists.count) {
                return res.status(409).json({
                    message: RES_MESSAGES.USER_USED_VOUCHER,
                    data: "",
                });
            }

            // Check if the voucher can be used for this order
            if (order.total_price < existingVoucher.min_order_value) {
                return res.status(409).json({
                    message: RES_MESSAGES.ORDER_AMOUNT_LESS_THAN_VOUCHER,
                    data: "",
                });
            }

            // Apply voucher
            if (existingVoucher.discount_type === DISCOUNT_TYPE.PERCENTAGE) {
                const temp_discount_amount = (existingVoucher.discount_value * order.total_price) / 100;
                order.discount_amount = temp_discount_amount > existingVoucher.max_discount ? existingVoucher.max_discount : temp_discount_amount;
            } else {
                order.discount_amount = order.total_price <= existingVoucher.discount_value ? order.total_price : existingVoucher.discount_value;
            }
            order.final_price = order.total_price - order.discount_amount;
        }

        // Create order
        let orderResult;
        if (order.voucher_id) {
            [orderResult] = await pool.query(`
                INSERT INTO \`order\` (user_id, total_price, discount_amount, final_price, voucher_id, payment_method, shipping_address) 
                VALUES(?, ?, ?, ?, ?, ?, ?)`
                , [order.user_id, order.total_price, order.discount_amount, order.final_price, order.voucher_id, order.payment_method, order.shipping_address]
            );

            // Reduce voucher quantity
            await pool.query(
                "UPDATE voucher SET quantity = quantity - 1 WHERE voucher_id = ? AND quantity > 0",
                [order.voucher_id]
            );

            // Add voucher usage
            await pool.query(
                "INSERT INTO voucher_usage (voucher_id, user_id, order_id) VALUES (?, ?, ?)",
                [order.voucher_id, order.user_id, orderResult.insertId]
            );
        } else {
            [orderResult] = await pool.query(`
                INSERT INTO \`order\` (user_id, total_price, discount_amount, final_price, payment_method, shipping_address, shipping_fee) 
                VALUES(?, ?, ?, ?, ?, ?, ?)`
                , [order.user_id, order.total_price, order.discount_amount, order.final_price, order.payment_method, order.shipping_address, order.shipping_fee]
            );
        }

        // Delete cart items
        if (order.cart_items.length) {
            const query = `DELETE FROM cart WHERE cart_id IN (${order.cart_items.map(() => '?').join(',')})`;
            await pool.query(query, order.cart_items);
        }

        // Re-fetch order to return
        const insertedOrderId = orderResult.insertId;
        const [returnedOrder] = await pool.query("SELECT * FROM `order` WHERE order_id = ?", [insertedOrderId]);

        // Create order items
        for (let variant of order.variants) {
            await pool.query(`
                INSERT INTO \`order_item\` 
                (order_id, variant_id, price, quantity, subtotal) 
                VALUES(?, ?, ?, ?, ?)`
                , [returnedOrder[0].order_id, variant.variant_id, variant.price, variant.quantity, variant.subtotal]
            );

            // Reduce variant quantity
            await pool.query(
                "UPDATE variant SET quantity = CASE WHEN quantity >= ? THEN quantity - ? ELSE 0 END WHERE variant_id = ?",
                [variant.quantity, variant.quantity, variant.variant_id]
            );
        }

        res.status(200).json({
            message: RES_MESSAGES.CREATE_ORDER_SUCCESS,
            data: returnedOrder[0],
        });
    } catch (error) {
        console.log("orderController::createOrder => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};

export const createOrderWithPaypal = async (req, res) => {
    const order = req.body;
    console.log(order)
    try {
        // Validate
        const [[userExists]] = await pool.query(
            "SELECT COUNT(*) AS count FROM `user` WHERE user_id = ?",
            [order.user_id]
        );
        if (!userExists.count) {
            return res.status(400).json({
                message: RES_MESSAGES.USER_NOT_EXIST,
                data: "",
            });
        }

        // Calculate order amount
        order.total_price = 0;
        order.discount_amount = 0;
        for (let variant of order.variants) {
            variant.subtotal = variant.price * variant.quantity;
            order.total_price += variant.price * variant.quantity;
        }
        order.final_price = order.total_price;

        // Process voucher 
        if (order.voucher_id) {
            // Check if voucher exists
            const [[existingVoucher]] = await pool.query(
                "SELECT * FROM `voucher` WHERE voucher_id = ?",
                [order.voucher_id]
            );
            if (!existingVoucher) {
                return res.status(404).json({
                    message: RES_MESSAGES.VOUCHER_NOT_EXIST,
                    data: "",
                });
            }

            // Check if voucher quantity is > 0
            if (existingVoucher.quantity <= 0) {
                return res.status(400).json({
                    message: RES_MESSAGES.VOUCHER_NOT_AVAILABLE,
                    data: "",
                });
            }

            // Check if user already used the voucher
            const [[voucherUsageExists]] = await pool.query(
                "SELECT COUNT(*) AS count FROM `voucher_usage` WHERE user_id = ? AND voucher_id = ?",
                [order.user_id, order.voucher_id]
            );
            if (voucherUsageExists.count) {
                return res.status(409).json({
                    message: RES_MESSAGES.USER_USED_VOUCHER,
                    data: "",
                });
            }

            // Check if the voucher can be used for this order
            if (order.total_price < existingVoucher.min_order_value) {
                return res.status(409).json({
                    message: RES_MESSAGES.ORDER_AMOUNT_LESS_THAN_VOUCHER,
                    data: "",
                });
            }

            // Apply voucher
            if (existingVoucher.discount_type === DISCOUNT_TYPE.PERCENTAGE) {
                const temp_discount_amount = (existingVoucher.discount_value * order.total_price) / 100;
                order.discount_amount = temp_discount_amount > existingVoucher.max_discount ? existingVoucher.max_discount : temp_discount_amount;
            } else {
                order.discount_amount = order.total_price <= existingVoucher.discount_value ? order.total_price : existingVoucher.discount_value;
            }
            order.final_price = order.total_price - order.discount_amount;
        }

        // Create order
        let orderResult;
        if (order.voucher_id) {
            [orderResult] = await pool.query(`
                INSERT INTO \`order\` (user_id, total_price, discount_amount, final_price, voucher_id, payment_method, shipping_address) 
                VALUES(?, ?, ?, ?, ?, ?, ?)`
                , [order.user_id, order.total_price, order.discount_amount, order.final_price, order.voucher_id, order.payment_method, order.shipping_address]
            );

            // Reduce voucher quantity
            await pool.query(
                "UPDATE voucher SET quantity = quantity - 1 WHERE voucher_id = ? AND quantity > 0",
                [order.voucher_id]
            );

            // Add voucher usage
            await pool.query(
                "INSERT INTO voucher_usage (voucher_id, user_id, order_id) VALUES (?, ?, ?)",
                [order.voucher_id, order.user_id, orderResult.insertId]
            );
        } else {
            [orderResult] = await pool.query(`
                INSERT INTO \`order\` (user_id, total_price, discount_amount, final_price, payment_method, shipping_address, shipping_fee) 
                VALUES(?, ?, ?, ?, ?, ?, ?)`
                , [order.user_id, order.total_price, order.discount_amount, order.final_price, order.payment_method, order.shipping_address, order.shipping_fee]
            );
        }

        // Delete cart items
        if (order.cart_items.length) {
            const query = `DELETE FROM cart WHERE cart_id IN (${order.cart_items.map(() => '?').join(',')})`;
            await pool.query(query, order.cart_items);
        }

        // Re-fetch order to return
        const insertedOrderId = orderResult.insertId;
        const [returnedOrder] = await pool.query("SELECT * FROM `order` WHERE order_id = ?", [insertedOrderId]);

        // Create order items
        for (let variant of order.variants) {
            await pool.query(`
                INSERT INTO \`order_item\` 
                (order_id, variant_id, price, quantity, subtotal) 
                VALUES(?, ?, ?, ?, ?)`
                , [returnedOrder[0].order_id, variant.variant_id, variant.price, variant.quantity, variant.subtotal]
            );

            // Reduce variant quantity
            await pool.query(
                "UPDATE variant SET quantity = CASE WHEN quantity >= ? THEN quantity - ? ELSE 0 END WHERE variant_id = ?",
                [variant.quantity, variant.quantity, variant.variant_id]
            );
        }

        // Initialize paypal checkout
        const creationResult = await createPaypalOrder(order.final_price, insertedOrderId)

        if (creationResult.status === 200) {
            res.status(200).json({
                message: RES_MESSAGES.CREATE_ORDER_SUCCESS,
                data: creationResult.data,
            });
        } else {
            res.status(500).json({
                message: creationResult.message,
                data: "",
            });
        }
    } catch (error) {
        console.log("orderController::createOrder => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};

export const getOrdersByUserIdAndStatus = async (req, res) => {
    const data = req.body;
    try {
        // Validate
        const [[userExists]] = await pool.query(
            "SELECT COUNT(*) AS count FROM `user` WHERE user_id = ?",
            [data.user_id]
        );
        if (!userExists.count) {
            return res.status(404).json({
                message: RES_MESSAGES.USER_NOT_EXIST,
                data: "",
            });
        }

        if (!isValidOrderStatus(data.status)) {
            return res.status(400).json({
                message: RES_MESSAGES.INVALID_ORDER_STATUS,
                data: "",
            });
        }

        // Fetch order list
        const [rows] = await pool.query(
            `SELECT o.*, COALESCE(SUM(oi.quantity), 0) AS total_quantity
            FROM \`order\` o
            LEFT JOIN order_item oi ON o.order_id = oi.order_id
            WHERE o.user_id = ? AND o.status = ?
            GROUP BY o.order_id`,
            [data.user_id, data.status]
        );

        res.status(200).json({
            message: "",
            data: rows,
        });
    } catch (error) {
        console.log("orderController::getOrdersByUserIdAndStatus => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};

export const getOrderDetailByUser = async (req, res) => {
    const { order_id } = req.params;
    try {
        // Validate
        const [[orderExists]] = await pool.query(
            "SELECT COUNT(*) AS count FROM `order` WHERE order_id = ?",
            [order_id]
        );
        if (!orderExists.count) {
            return res.status(404).json({
                message: RES_MESSAGES.ORDER_NOT_EXIST,
                data: "",
            });
        }

        // Fetch order detail
        const [rows] = await pool.query(`
                SELECT 
                    o.order_id,
                    o.payment_method,
                    u.full_name,
                    u.phone_number,
                    o.shipping_address AS address,
                    p.product_name,
                    pi.image_url AS product_image,
                    oi.quantity,
                    oi.price,
                    s.size_name,
                    c.color_name,
                    o.discount_amount,
                    o.created_date
                FROM \`order\` o
                JOIN user u ON o.user_id = u.user_id
                JOIN order_item oi ON o.order_id = oi.order_id
                JOIN variant v ON oi.variant_id = v.variant_id
                JOIN product p ON v.product_id = p.product_id
                JOIN size s ON v.size_id = s.size_id
                JOIN color c ON v.color_id = c.color_id
                LEFT JOIN product_image pi ON p.product_id = pi.product_id
                WHERE o.order_id = ?
                GROUP BY oi.order_item_id`,
            [order_id]
        );

        const returnedOrderDetail = rows.length > 0 ? {
            order_id: order_id,
            payment_method: rows[0].payment_method,
            discount_amount: rows[0].discount_amount,
            created_date: rows[0].created_date,
            user: {
                full_name: rows[0].full_name,
                phone_number: rows[0].phone_number,
                address: rows[0].address,
            },
            items: rows,
        } : {};

        res.status(200).json({
            message: "",
            data: returnedOrderDetail,
        });
    } catch (error) {
        console.log("orderController::getOrderDetailByUser => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};

export const cancelOrder = async (req, res) => {
    const data = req.body;
    try {
        // Validate
        const [[userExists]] = await pool.query(
            "SELECT COUNT(*) AS count FROM `user` WHERE user_id = ?",
            [data.user_id]
        );
        if (!userExists.count) {
            return res.status(404).json({
                message: RES_MESSAGES.USER_NOT_EXIST,
                data: "",
            });
        }

        const [existingOrder] = await pool.query(
            "SELECT status, voucher_id FROM `order` WHERE order_id = ?",
            [data.order_id]
        );
        if (!existingOrder.length) {
            return res.status(404).json({
                message: RES_MESSAGES.ORDER_NOT_EXIST,
                data: "",
            });
        }
        if (!isOrderCancellable(existingOrder[0].status)) {
            return res.status(409).json({
                message: RES_MESSAGES.ORDER_NOT_CANCELLABE,
                data: "",
            });
        }

        // change order status to 'cancelled'
        await pool.query("UPDATE `order` SET status = ?, modified_date = NOW() WHERE order_id = ?", [ORDER_STATUS.CANCELLED, data.order_id]);

        // Recover variant quantity after cancelling the order
        const [orderItems] = await pool.query("SELECT variant_id, quantity FROM order_item WHERE order_id = ?", [data.order_id]);
        for (let orderItem of orderItems) {
            await pool.query(
                "UPDATE variant SET quantity = quantity + ? WHERE variant_id = ?",
                [orderItem.quantity, orderItem.variant_id]
            );
        }

        // Recover the voucher if applied
        if (existingOrder[0].voucher_id) {
            await pool.query(
                "DELETE FROM voucher_usage WHERE user_id = ? AND voucher_id = ?",
                [data.user_id, existingOrder[0].voucher_id]
            );

            await pool.query(
                "UPDATE voucher SET quantity = quantity + 1 WHERE voucher_id = ?",
                [existingOrder[0].voucher_id]
            );
        }

        res.status(200).json({
            message: RES_MESSAGES.CANCEL_ORDER_SUCCESS,
            data: "",
        });
    } catch (error) {
        console.log("orderController::cancelOrder => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};

export const applyVoucher = async (req, res) => {
    const order = req.body;
    try {
        // Check if voucher exists
        const [[existingVoucher]] = await pool.query(
            "SELECT * FROM `voucher` WHERE code = ?",
            [order.voucher_code]
        );
        if (!existingVoucher) {
            return res.status(404).json({
                message: RES_MESSAGES.VOUCHER_NOT_EXIST,
                data: "",
            });
        }
        if (existingVoucher.quantity <= 0) {
            return res.status(400).json({
                message: RES_MESSAGES.VOUCHER_NOT_AVAILABLE,
                data: "",
            });
        }

        // Get current date
        const now = new Date();
        const startDate = new Date(existingVoucher.start_date);
        const endDate = new Date(existingVoucher.end_date);

        // Check if voucher is not within valid date range
        if (now < startDate || now > endDate) {
            return res.status(400).json({
                message: RES_MESSAGES.VOUCHER_EXPIRED,
                data: "",
            });
        }

        // Check if user already used the voucher
        const [[voucherUsageExists]] = await pool.query(
            "SELECT COUNT(*) AS count FROM `voucher_usage` WHERE user_id = ? AND voucher_id = ?",
            [order.user_id, existingVoucher.voucher_id]
        );
        if (voucherUsageExists.count) {
            return res.status(409).json({
                message: RES_MESSAGES.USER_USED_VOUCHER,
                data: "",
            });
        }

        // Check if the voucher can be used for this order
        if (order.total_price < existingVoucher.min_order_value) {
            return res.status(409).json({
                message: RES_MESSAGES.ORDER_AMOUNT_LESS_THAN_VOUCHER,
                data: "",
            });
        }

        // Apply voucher
        if (existingVoucher.discount_type === DISCOUNT_TYPE.PERCENTAGE) {
            const temp_discount_amount = (existingVoucher.discount_value * order.total_price) / 100;
            order.discount_amount = temp_discount_amount > existingVoucher.max_discount ? existingVoucher.max_discount : temp_discount_amount;
        } else {
            order.discount_amount = order.total_price <= existingVoucher.discount_value ? order.total_price : existingVoucher.discount_value;
        }
        order.final_price = order.total_price - order.discount_amount;

        res.status(200).json({
            message: RES_MESSAGES.APPLY_VOUCHER_SUCCESS,
            data: {
                voucher_id: existingVoucher.voucher_id,
                final_price: order.final_price,
            },
        });
    } catch (error) {
        console.log("orderController::applyVoucher => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};
//#endregion