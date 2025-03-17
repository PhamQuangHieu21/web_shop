import pool from "../config/database.js";
import { RES_MESSAGES } from "../utils/constants.js";
import { deleteImages } from "../utils/operator.js";

export const getAllProducts = async (req, res) => {
    try {
        const [products] = await pool.query(
            "SELECT * FROM `product`",
        );

        for (let product of products) {
            // Fetch category            
            const [existingCategory] = await pool.query(
                "SELECT * FROM `category` WHERE category_id = ?",
                [product.category_id]
            );
            if (existingCategory.length > 0) {
                product.category_id = existingCategory[0].category_id;
                product.category = existingCategory[0].name;
            }

            // Fetch images
            product.current_images = [];
            const [images] = await pool.query(
                "SELECT * FROM `product_image` WHERE product_id = ?",
                [product.product_id]
            );
            if (images.length > 0) {
                for (let image of images) {
                    product.current_images.push(image.image_url);
                }
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

        // Re-fetch product to return
        const insertedId = result.insertId;
        const [rows] = await pool.query("SELECT * FROM `product` WHERE product_id = ?", [insertedId]);
        rows[0].category = existingCategory[0].name;
        rows[0].category_id = existingCategory[0].category_id;

        // Create product images
        for (let image of product.new_images) {
            await pool.query(
                "INSERT INTO `product_image` (product_id, image_url) VALUES (?, ?)",
                [insertedId, image]
            );
        }
        rows[0].current_images = product.new_images;

        res.status(200).json({
            message: RES_MESSAGES.CREATE_PRODUCT_SUCCESSFULLY,
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

export const updateProduct = async (req, res) => {
    const product = req.body;
    const { product_id } = req.params;
    if (typeof product.deleted_images === 'string') product.deleted_images = [product.deleted_images];
    try {
        // Validate
        const [existingCategory] = await pool.query(
            "SELECT * FROM `category` WHERE category_id = ?",
            [product.category_id]
        );
        if (existingCategory.length === 0) {
            console.log("category")
            return res.status(400).send({
                message: RES_MESSAGES.CATEGORY_NAME_NOT_EXIST,
                data: "",
            });
        }

        const [existingProduct] = await pool.query(
            "SELECT * FROM `product` WHERE product_id = ?",
            [Number(product_id)]
        );
        if (existingProduct.length === 0) {
            console.log("product")
            return res.status(400).send({
                message: RES_MESSAGES.PRODUCT_NOT_EXIST,
                data: "",
            });
        }

        // Update product
        await pool.query(
            "UPDATE `product` SET product_name = ?, description = ?, price = ?, quantity = ?, category_id = ?, modified_date = NOW() where product_id = ?",
            [product.product_name, product.description, Number(product.price), Number(product.quantity), Number(product.category_id), Number(product_id)]
        );

        // Re-fetch category to return
        const [returnedProduct] = await pool.query(
            "SELECT * FROM `product` WHERE product_id = ?",
            [product_id]
        );
        const [returnedCategory] = await pool.query(
            "SELECT * FROM `category` WHERE category_id = ?",
            [product.category_id]
        );
        if (returnedCategory.length > 0) {
            returnedProduct[0].category = returnedCategory[0].name;
        }

        // Delete product images if needed
        if (product.deleted_images) {
            for (let image of product.deleted_images) {
                await pool.query(
                    "DELETE FROM `product_image` WHERE product_id = ? and image_url = ? ",
                    [Number(product_id), image]
                );
            }
            deleteImages(product.deleted_images);
        }

        // Create new product images if needed
        if (product.new_images) {
            for (let image of product.new_images) {
                await pool.query(
                    "INSERT INTO `product_image` (product_id, image_url) VALUES (?, ?)",
                    [Number(product_id), image]
                );
            }
        }

        // Re-fetch product images to return
        const [returnedImages] = await pool.query(
            "SELECT * FROM `product_image` WHERE product_id = ?",
            [Number(product_id)]
        );
        if (returnedImages) {
            returnedProduct[0].current_images = returnedImages.map(item => item.image_url)
        }

        res.status(200).json({
            message: RES_MESSAGES.UPDATE_PRODUCT_SUCCESSFULLY,
            data: returnedProduct[0],
        });
    } catch (error) {
        console.log("productController::updateProduct => error: " + error);
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

export const addProductToFavourite = async (req, res) => {
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
                message: RES_MESSAGES.ADD_PRODUCT_TO_FAVOURITE,
                data: "",
            });
        }, 500);
    } catch (error) {
        console.log("productController::addProductToFavourite => error: " + error);
        res.status(500).send({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};
