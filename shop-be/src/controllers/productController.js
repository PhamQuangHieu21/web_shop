import pool from "../config/database.js";
import { RES_MESSAGES } from "../utils/constants.js";
import { deleteImages } from "../utils/operator.js";

export const getAllProducts = async (req, res) => {
    try {
        const [products] = await pool.query(
            "SELECT * FROM `product`",
        );

        for (let product of products) {
            const [existingCategory] = await pool.query(
                "SELECT * FROM `category` WHERE category_id = ?",
                [product.category_id]
            );
            if (existingCategory.length > 0) {
                product.category_id = existingCategory[0].category_id;
                product.category = existingCategory[0].name;
            }
        }

        res.status(200).json({
            message: "",
            data: products,
        });
    } catch (error) {
        console.log("productController::getAllProducts => error: " + error);
        res.status(500).send({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};

export const createProduct = async (req, res) => {
    const product = req.body;
    try {
        // Validate
        const [existingCategory] = await pool.query(
            "SELECT * FROM `category` WHERE category_id = ?",
            [product.category_id]
        );
        if (existingCategory.length === 0)
            return res.status(400).send({
                message: RES_MESSAGES.CATEGORY_NAME_NOT_EXIST,
                data: "",
            });

        // Create product
        const [result] = await pool.query(
            "INSERT INTO `product` (product_name, description, price, quantity, category_id) VALUES (?, ?, ?, ?, ?)",
            [product.product_name, product.description, Number(product.price), Number(product.quantity), Number(product.category_id)]
        );

        const insertedId = result.insertId;
        const [rows] = await pool.query("SELECT * FROM `product` WHERE product_id = ?", [insertedId]);
        rows[0].category = existingCategory[0].name;
        rows[0].category_id = existingCategory[0].category_id;

        // Create product images
        for (let image of product.images) {
            await pool.query(
                "INSERT INTO `product_image` (product_id, image_url) VALUES (?, ?)",
                [insertedId, image]
            );
        }

        res.status(200).json({
            message: "",
            data: rows[0],
        });
    } catch (error) {
        console.log("productController::createProduct => error: " + error);
        res.status(500).send({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        // Delete product images
        const [productImages] = await pool.query("SELECT * FROM `product_image` WHERE product_id = ?", [id]);
        deleteImages(productImages.map(item => item.image_url));

        // Delete product
        await pool.query("DELETE FROM `product` WHERE product_id = ?", [id]);

        res.status(200).json({
            message: RES_MESSAGES.DELETE_PRODUCT_SUCCESSFULLY,
            data: "",
        });
    } catch (error) {
        console.log("productController::deleteProduct => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};

export const likeProduct = async (req, res) => {
    const data = req.body;
    if (!data.user_id || !data.product_id) {
        res.status(400).send({
            message: "Bad request",
            data: "",
        });
    }
    try {
        setTimeout(() => {
            res.status(200).json({
                message: "Thêm sản phẩm vào mục yêu thích.",
                data: "",
            });
        }, 500);
    } catch (error) {
        console.log("productController::likeProduct => error: " + error);
        res.status(500).send({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};
