import { RES_MESSAGES } from "../utils/constants.js";
import pool from "../config/database.js";

export const getAllColors = async (req, res) => {
    try {
        const [colors] = await pool.query(
            "SELECT * FROM `color`",
        );

        res.status(200).json({
            message: "",
            data: colors,
        });
    } catch (error) {
        console.log("colorController::getAllColors => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};

export const createColor = async (req, res) => {
    const color = req.body;
    try {
        // Validate
        const [existingColor] = await pool.query(
            "SELECT * FROM `color` WHERE color_name = ?",
            [color.color_name]
        );
        if (existingColor.length > 0)
            return res.status(409).send({
                message: RES_MESSAGES.COLOR_EXIST,
                data: "",
            });

        // Create color
        const [result] = await pool.query(
            "INSERT INTO `color` (color_name) VALUES (?)",
            [color.color_name]
        );

        const insertedId = result.insertId;
        const [rows] = await pool.query("SELECT * FROM `color` WHERE color_id = ?", [insertedId]);

        res.status(200).json({
            message: RES_MESSAGES.CREATE_COLOR_SUCCESS,
            data: rows[0],
        });
    } catch (error) {
        console.log("colorController::createColor => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};

export const deleteColor = async (req, res) => {
    let { id } = req.params;
    id = Number(id);
    try {
        const [existingVariant] = await pool.query(
            "SELECT * FROM `variant` WHERE color_id = ? LIMIT 1",
            [id]
        );
        if (existingVariant.length > 0)
            return res.status(409).send({
                message: RES_MESSAGES.DELETE_COLOR_FAIL_VARIANT_EXIST,
                data: "",
            });

        // Delete color
        await pool.query("DELETE FROM `color` WHERE color_id = ?", [id]);

        res.status(200).json({
            message: RES_MESSAGES.DELETE_COLOR_SUCCESS,
            data: "",
        });
    } catch (error) {
        console.log("colorController::deleteColor => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};

export const updateColor = async (req, res) => {
    const color = req.body;
    let { id } = req.params;
    id = Number(id);
    try {
        // Validate
        const [existingColor] = await pool.query(
            "SELECT * FROM `color` WHERE color_name = ?",
            [color.color_name]
        );
        if (existingColor.length > 0 && existingColor[0].color_id !== id)
            return res.status(409).send({
                message: RES_MESSAGES.COLOR_EXIST,
                data: "",
            });

        // Update color
        await pool.query(`UPDATE color
                        SET color_name = ?, modified_date = NOW()
                        WHERE color_id = ?`, [color.color_name, id]);

        // Get updated color
        const [updatedColor] = await pool.query(
            "SELECT * FROM `color` WHERE color_id = ?",
            [id]
        );

        res.status(200).json({
            message: RES_MESSAGES.UPDATE_COLOR_SUCCESS,
            data: updatedColor[0],
        });
    } catch (error) {
        console.log("colorController::updateColor => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
}
