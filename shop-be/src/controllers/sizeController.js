import { RES_MESSAGES } from "../utils/constants.js";
import pool from "../config/database.js";

export const getAllSizes = async (req, res) => {
    try {
        const [sizes] = await pool.query(
            "SELECT * FROM `size`",
        );

        res.status(200).json({
            message: "",
            data: sizes,
        });
    } catch (error) {
        console.log("sizeController::ping => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};

export const createSize = async (req, res) => {
    const size = req.body;
    try {
        // Validate
        const [existingSize] = await pool.query(
            "SELECT * FROM `size` WHERE size_name = ?",
            [size.size_name]
        );
        if (existingSize.length > 0)
            return res.status(409).send({
                message: RES_MESSAGES.SIZE_EXIST,
                data: "",
            });

        // Create size
        const [result] = await pool.query(
            "INSERT INTO `size` (size_name) VALUES (?)",
            [size.size_name]
        );

        const insertedId = result.insertId;
        const [rows] = await pool.query("SELECT * FROM `size` WHERE size_id = ?", [insertedId]);

        res.status(200).json({
            message: RES_MESSAGES.CREATE_SIZE_SUCCESS,
            data: rows[0],
        });
    } catch (error) {
        console.log("sizeController::createSize => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};

export const deleteSize = async (req, res) => {
    let { id } = req.params;
    id = Number(id);
    try {
        const [existingVariant] = await pool.query(
            "SELECT * FROM `variant` WHERE size_id = ? LIMIT 1",
            [id]
        );
        if (existingVariant.length > 0)
            return res.status(409).send({
                message: RES_MESSAGES.DELETE_SIZE_FAIL_VARIANT_EXIST,
                data: "",
            });

        // Delete size
        await pool.query("DELETE FROM `size` WHERE size_id = ?", [id]);

        res.status(200).json({
            message: RES_MESSAGES.DELETE_SIZE_SUCCESS,
            data: "",
        });
    } catch (error) {
        console.log("sizeController::deleteSize => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};

export const updateSize = async (req, res) => {
    const size = req.body;
    let { id } = req.params;
    id = Number(id);
    try {
        // Validate
        const [existingSize] = await pool.query(
            "SELECT * FROM `size` WHERE size_name = ?",
            [size.size_name]
        );
        if (existingSize.length > 0 && existingSize[0].size_id !== id)
            return res.status(409).send({
                message: RES_MESSAGES.SIZE_EXIST,
                data: "",
            });

        // Update size
        await pool.query(`UPDATE size
                        SET size_name = ?, modified_date = NOW()
                        WHERE size_id = ?`, [size.size_name, id]);

        // Get updated size
        const [updatedSize] = await pool.query(
            "SELECT * FROM `size` WHERE size_id = ?",
            [id]
        );

        res.status(200).json({
            message: RES_MESSAGES.UPDATE_SIZE_SUCCESS,
            data: updatedSize[0],
        });
    } catch (error) {
        console.log("sizeController::updateSize => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
}
