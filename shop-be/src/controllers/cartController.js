import { RES_MESSAGES } from "../utils/constants.js";
import pool from "../config/database.js";

// App api
export const getCartByUser = async (req, res) => {
    const { user_id } = req.params;
    try {
        const [cartItems] = await pool.query(
            `SELECT 
                c.cart_id, c.quantity, 
                v.variant_id, v.price, v.quantity AS stock, 
                p.product_id, p.product_name, 
                col.color_name, 
                s.size_name, 
                (SELECT pi.image_url 
                FROM product_image pi 
                WHERE pi.product_id = p.product_id 
                LIMIT 1) AS product_image
            FROM cart c
            JOIN variant v ON c.variant_id = v.variant_id
            JOIN product p ON v.product_id = p.product_id
            LEFT JOIN color col ON v.color_id = col.color_id
            LEFT JOIN size s ON v.size_id = s.size_id
            WHERE c.user_id = 1`,
            [user_id]
        );

        res.status(200).json({
            message: "",
            data: cartItems,
        });
    } catch (error) {
        console.log("cartController::getCartByUser => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};

export const createCart = async (req, res) => {
    const cart = req.body;
    try {
        // Validate
        const [existingUser] = await pool.query(
            "SELECT 1 FROM user WHERE user_id = ? LIMIT 1",
            [cart.user_id]
        );
        if (existingUser.length === 0)
            return res.status(404).send({
                message: RES_MESSAGES.USER_NOT_EXIST,
                data: "",
            });

        const [existingVariant] = await pool.query(
            "SELECT 1 FROM variant WHERE variant_id = ? LIMIT 1",
            [cart.variant_id]
        );
        if (existingVariant.length === 0)
            return res.status(404).send({
                message: RES_MESSAGES.VARIANT_NOT_EXIST,
                data: "",
            });

        // Add/update cart
        const [result] = await pool.query(
            `INSERT INTO cart (user_id, variant_id, quantity)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE quantity = quantity + ?`,
            [cart.user_id, cart.variant_id, cart.quantity, cart.quantity]
        );

        // Re-fetch cart to return
        const insertedId = result.insertId;
        const [rows] = await pool.query(
            `SELECT 
                c.cart_id, c.quantity, 
                v.variant_id, v.price, v.quantity AS stock, 
                p.product_id, p.product_name, 
                col.color_name, 
                s.size_name, 
                (SELECT pi.image_url 
                FROM product_image pi 
                WHERE pi.product_id = p.product_id 
                LIMIT 1) AS product_image
            FROM cart c
            JOIN variant v ON c.variant_id = v.variant_id
            JOIN product p ON v.product_id = p.product_id
            LEFT JOIN color col ON v.color_id = col.color_id
            LEFT JOIN size s ON v.size_id = s.size_id
            WHERE c.cart_id = ?`,
            [insertedId]
        );

        res.status(200).json({
            message: RES_MESSAGES.UPDATE_CART_SUCCESS,
            data: rows[0],
        });
    } catch (error) {
        console.log("cartController::createCart => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};

export const updateCart = async (req, res) => {
    const { cart_id } = req.params;
    const cart = req.body;
    try {
        // Validate
        const [existingUser] = await pool.query(
            "SELECT 1 FROM user WHERE user_id = ? LIMIT 1",
            [cart.user_id]
        );
        if (existingUser.length === 0)
            return res.status(404).send({
                message: RES_MESSAGES.USER_NOT_EXIST,
                data: "",
            });

        const [existingVariant] = await pool.query(
            "SELECT 1 FROM variant WHERE variant_id = ? LIMIT 1",
            [cart.variant_id]
        );
        if (existingVariant.length === 0)
            return res.status(404).send({
                message: RES_MESSAGES.VARIANT_NOT_EXIST,
                data: "",
            });

        const [existingCart] = await pool.query(
            "SELECT 1 FROM cart WHERE cart_id = ? LIMIT 1",
            [cart_id]
        );
        if (existingCart.length === 0)
            return res.status(404).send({
                message: RES_MESSAGES.CART_NOT_EXIST,
                data: "",
            });

        // Add/update cart
        await pool.query(`UPDATE cart
                        SET quantity = ?, modified_date = NOW()
                        WHERE cart_id = ?`,
            [cart.quantity, cart_id]);

        // Re-fetch cart to return
        const [rows] = await pool.query(
            `SELECT 
                c.cart_id, c.quantity, 
                v.variant_id, v.price, v.quantity AS stock, 
                p.product_id, p.product_name, 
                col.color_name, 
                s.size_name, 
                (SELECT pi.image_url 
                FROM product_image pi 
                WHERE pi.product_id = p.product_id 
                LIMIT 1) AS product_image
            FROM cart c
            JOIN variant v ON c.variant_id = v.variant_id
            JOIN product p ON v.product_id = p.product_id
            LEFT JOIN color col ON v.color_id = col.color_id
            LEFT JOIN size s ON v.size_id = s.size_id
            WHERE c.cart_id = ?`,
            [cart_id]
        );

        res.status(200).json({
            message: RES_MESSAGES.UPDATE_CART_SUCCESS,
            data: rows[0],
        });
    } catch (error) {
        console.log("cartController::createCart => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};

export const deleteCart = async (req, res) => {
    const { cart_id } = req.params;
    try {
        // Validate
        const [existingCart] = await pool.query(
            "SELECT 1 FROM `cart` WHERE cart_id = ? LIMIT 1",
            [cart_id]
        );
        if (existingCart.length === 0)
            return res.status(404).send({
                message: RES_MESSAGES.CART_NOT_EXIST,
                data: "",
            });

        // Delete cart
        await pool.query("DELETE FROM `cart` WHERE cart_id = ?", [cart_id]);

        res.status(200).json({
            message: RES_MESSAGES.DELETE_CART_SUCCESS,
            data: "",
        });
    } catch (error) {
        console.log("cartController::deleteCart => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};

