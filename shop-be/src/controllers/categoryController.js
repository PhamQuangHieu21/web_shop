import { RES_MESSAGES } from "../utils/constants.js";
import pool from "../config/database.js";

export const getAllCategories = async (req, res) => {
    try {
        const [categories] = await pool.query(
            "SELECT * FROM `category`",
        );

        res.status(200).json({
            message: "",
            data: categories,
        });
    } catch (error) {
        console.log("categoryController::ping => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};

export const createCategory = async (req, res) => {
    const category = req.body;
    try {
        // Validate
        const [existingCategory] = await pool.query(
            "SELECT * FROM `category` WHERE name = ?",
            [category.name]
        );
        if (existingCategory.length > 0)
            return res.status(409).send({
                message: RES_MESSAGES.CATEGORY_NAME_EXIST,
                data: "",
            });

        // Create category
        const [result] = await pool.query(
            "INSERT INTO `category` (name, icon) VALUES (?, ?)",
            [category.name, category.icon]
        );

        const insertedId = result.insertId;
        const [rows] = await pool.query("SELECT * FROM `category` WHERE category_id = ?", [insertedId]);

        res.status(200).json({
            message: RES_MESSAGES.CREATE_CATEGORY_SUCCESSFULLY,
            data: rows[0],
        });
    } catch (error) {
        console.log("categoryController::createCategory => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};

export const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM `category` WHERE category_id = ?", [id]);

        res.status(200).json({
            message: RES_MESSAGES.DELETE_CATEGORY_SUCCESSFULLY,
            data: "",
        });
    } catch (error) {
        console.log("categoryController::deleteCategory => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};

export const updateCategory = async (req, res) => {
    const category = req.body;
    let { id } = req.params;
    id = Number(id);
    try {
        // Validate
        const [existingCategory] = await pool.query(
            "SELECT * FROM `category` WHERE name = ?",
            [category.name]
        );

        if (existingCategory.length > 0 && existingCategory[0].category_id !== id)
            return res.status(409).send({
                message: RES_MESSAGES.CATEGORY_NAME_EXIST,
                data: "",
            });

        // Update category
        await pool.query(`UPDATE category
                        SET name = ?, icon = ?, modified_date = NOW()
                        WHERE category_id = ?`, [category.name, category.icon, id]);

        // Get updated category
        const [updatedCategory] = await pool.query(
            "SELECT * FROM `category` WHERE category_id = ?",
            [id]
        );

        res.status(200).json({
            message: RES_MESSAGES.UPDATE_CATEGORY_SUCCESSFULLY,
            data: updatedCategory[0],
        });
    } catch (error) {
        console.log("categoryController::updateCategory => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
}
