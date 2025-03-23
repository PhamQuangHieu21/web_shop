import { DISCOUNT_TYPE, isValidOrderStatus, RES_MESSAGES } from "../utils/constants.js";
import pool from "../config/database.js";

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

        if (!isValidOrderStatus(data.new_status)) {
            return res.status(400).json({
                message: RES_MESSAGES.INVALID_ORDER_STATUS,
                data: "",
            });
        }

        // Change order status

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
                order.discount_amount = temp_discount_amount > max_discount ? max_discount : temp_discount_amount;
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
        } else {
            [orderResult] = await pool.query(`
                INSERT INTO \`order\` (user_id, total_price, discount_amount, final_price, payment_method, shipping_address, shipping_fee) 
                VALUES(?, ?, ?, ?, ?, ?, ?)`
                , [order.user_id, order.total_price, order.discount_amount, order.final_price, order.payment_method, order.shipping_address, order.shipping_fee]
            );
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
                    c.color_name
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
//#endregion