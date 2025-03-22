import { RES_MESSAGES } from "../utils/constants.js";
import pool from "../config/database.js";

export const getAllVariants = async (req, res) => {
    try {
        const [variants] = await pool.query(
            `SELECT 
                v.variant_id, 
                v.size_id, s.size_name, 
                v.color_id, c.color_name, 
                v.product_id, p.product_name, 
                v.price, v.quantity, 
                v.created_date, v.modified_date
             FROM variant v
             JOIN product p ON v.product_id = p.product_id
             JOIN color c ON v.color_id = c.color_id
             JOIN size s ON v.size_id = s.size_id`
        );

        res.status(200).json({
            message: "",
            data: variants,
        });
    } catch (error) {
        console.log("variantController::getAllVariants => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};

export const createVariant = async (req, res) => {
    const variant = req.body;
    try {
        // Validate if product, color, and size exist
        const [[productExists]] = await pool.query(
            "SELECT COUNT(*) AS count FROM `product` WHERE product_id = ?",
            [variant.product_id]
        );
        if (!productExists.count) {
            return res.status(400).json({
                message: RES_MESSAGES.PRODUCT_NOT_EXIST,
                data: "",
            });
        }

        const [[colorExists]] = await pool.query(
            "SELECT COUNT(*) AS count FROM `color` WHERE color_id = ?",
            [variant.color_id]
        );
        if (!colorExists.count) {
            return res.status(400).json({
                message: RES_MESSAGES.COLOR_NOT_EXIST,
                data: "",
            });
        }

        const [[sizeExists]] = await pool.query(
            "SELECT COUNT(*) AS count FROM `size` WHERE size_id = ?",
            [variant.size_id]
        );
        if (!sizeExists.count) {
            return res.status(400).json({
                message: RES_MESSAGES.SIZE_NOT_EXIST,
                data: "",
            });
        }

        // Validate if variant already exists
        const [[existingVariant]] = await pool.query(
            "SELECT COUNT(*) AS count FROM `variant` WHERE color_id = ? AND size_id = ? AND product_id = ?",
            [variant.color_id, variant.size_id, variant.product_id]
        );

        if (existingVariant.count > 0) {
            return res.status(409).json({
                message: RES_MESSAGES.VARIANT_EXIST,
                data: "",
            });
        }

        // Create variant
        const [result] = await pool.query(
            "INSERT INTO `variant` (color_id, size_id, product_id, price, quantity) VALUES (?, ?, ?, ?, ?)",
            [variant.color_id, variant.size_id, variant.product_id, variant.price, variant.quantity]
        );

        // Get inserted ID
        const insertedId = result.insertId;

        // Fetch the new variant with product, color, and size details
        const [[newVariant]] = await pool.query(
            `SELECT 
                v.variant_id, 
                v.size_id, s.size_name, 
                v.color_id, c.color_name, 
                v.product_id, p.product_name, 
                v.price, v.quantity, 
                v.created_date, v.modified_date
             FROM variant v
             JOIN product p ON v.product_id = p.product_id
             JOIN color c ON v.color_id = c.color_id
             JOIN size s ON v.size_id = s.size_id
             WHERE v.variant_id = ?`,
            [insertedId]
        );

        res.status(200).json({
            message: RES_MESSAGES.CREATE_VARIANT_SUCCESS,
            data: newVariant,
        });
    } catch (error) {
        console.log("variantController::createVariant => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};

export const deleteVariant = async (req, res) => {
    let { id } = req.params;
    id = Number(id);
    try {
        // Delete variant
        await pool.query("DELETE FROM `variant` WHERE variant_id = ?", [id]);

        res.status(200).json({
            message: RES_MESSAGES.DELETE_VARIANT_SUCCESS,
            data: "",
        });
    } catch (error) {
        console.log("variantController::deleteVariant => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};

export const updateVariant = async (req, res) => {
    const variant = req.body;
    let { variant_id } = req.params;
    variant_id = Number(variant_id);
    try {
        // Check if variant exists
        const [existingVariant] = await pool.query(
            "SELECT * FROM `variant` WHERE variant_id = ?",
            [variant_id]
        );
        if (existingVariant.length === 0) {
            return res.status(404).json({ message: RES_MESSAGES.VARIANT_NOT_EXIST, data: "" });
        }

        // Validate if product, color, and size exist
        const [[productExists]] = await pool.query(
            "SELECT COUNT(*) AS count FROM `product` WHERE product_id = ?",
            [variant.product_id]
        );
        const [[colorExists]] = await pool.query(
            "SELECT COUNT(*) AS count FROM `color` WHERE color_id = ?",
            [variant.color_id]
        );
        const [[sizeExists]] = await pool.query(
            "SELECT COUNT(*) AS count FROM `size` WHERE size_id = ?",
            [variant.size_id]
        );

        // If any entity does not exist, return an error
        if (!productExists.count) {
            return res.status(400).json({
                message: RES_MESSAGES.PRODUCT_NOT_EXIST,
                data: "",
            });
        }
        if (!colorExists.count) {
            return res.status(400).json({
                message: RES_MESSAGES.COLOR_NOT_EXIST,
                data: "",
            });
        }
        if (!sizeExists.count) {
            return res.status(400).json({
                message: RES_MESSAGES.SIZE_NOT_EXIST,
                data: "",
            });
        }

        // Update variant
        await pool.query(
            "UPDATE `variant` SET color_id = ?, size_id = ?, product_id = ?, price = ?, quantity = ?, modified_date = NOW() WHERE variant_id = ?",
            [variant.color_id, variant.size_id, variant.product_id, variant.price, variant.quantity, variant_id]
        );

        // Fetch updated variant with full details
        const [updatedVariant] = await pool.query(
            `SELECT v.variant_id, v.price, v.quantity, v.created_date, v.modified_date,
                    p.product_id, p.product_name, 
                    c.color_id, c.color_name, 
                    s.size_id, s.size_name 
             FROM variant v
             JOIN product p ON v.product_id = p.product_id
             JOIN color c ON v.color_id = c.color_id
             JOIN size s ON v.size_id = s.size_id
             WHERE v.variant_id = ?`,
            [variant_id]
        );

        res.status(200).json({
            message: RES_MESSAGES.UPDATE_VARIANT_SUCCESS,
            data: updatedVariant[0],
        });
    } catch (error) {
        console.log("variantController::updateVariant => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
}

export const getDependencies = async (req, res) => {
    try {
        // Fetch colors, sizes, and products concurrently
        const [colors, sizes, products] = await Promise.all([
            pool.query("SELECT color_id, color_name FROM `color`"),
            pool.query("SELECT size_id, size_name FROM `size`"),
            pool.query("SELECT product_id, product_name FROM `product`"),
        ]);

        res.status(200).json({
            message: "",
            data: {
                colors: colors[0],
                sizes: sizes[0],
                products: products[0],
            },
        });
    } catch (error) {
        console.log("variantController::deleteVariant => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};

