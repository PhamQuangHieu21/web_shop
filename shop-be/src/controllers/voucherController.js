import pool from "../config/database.js";
import { RES_MESSAGES } from "../utils/constants.js";
import { formatDateForMySQL } from "../utils/operator.js";

export const getAllVouchers = async (req, res) => {
    try {
        const [vouchers] = await pool.query(`SELECT * FROM voucher`);
        console.log(vouchers);
        res.status(200).json({
            message: "",
            data: vouchers,
        });
    } catch (error) {
        console.log("voucherController::getAllVouchers => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};

export const createVoucher = async (req, res) => {
    const voucher = req.body;

    try {
        voucher.start_date = formatDateForMySQL(voucher.valid_date.from);
        voucher.end_date = formatDateForMySQL(voucher.valid_date.to);
        console.log(voucher)
        // Validate if code already exists
        const [[codeExists]] = await pool.query(
            "SELECT COUNT(*) AS count FROM `voucher` WHERE code = ?",
            [voucher.code]
        );
        if (codeExists.count) {
            return res.status(400).json({
                message: RES_MESSAGES.VOUCHER_CODE_EXIST,
                data: "",
            });
        }

        // Insert new voucher
        const [result] = await pool.query(
            `INSERT INTO voucher 
                (code, discount_type, discount_value, min_order_value, max_discount, quantity, start_date, end_date) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                voucher.code,
                voucher.discount_type,
                voucher.discount_value,
                voucher.min_order_value,
                voucher.max_discount,
                voucher.quantity,
                voucher.start_date,
                voucher.end_date,
            ]
        );

        // Get the inserted voucher
        const insertedId = result.insertId;
        const [[newVoucher]] = await pool.query(
            `SELECT 
                voucher_id, code, discount_type, discount_value, min_order_value, 
                max_discount, quantity, start_date, end_date, created_date, modified_date
             FROM voucher 
             WHERE voucher_id = ?`,
            [insertedId]
        );

        res.status(200).json({
            message: RES_MESSAGES.CREATE_VOUCHER_SUCCESS,
            data: newVoucher,
        });
    } catch (error) {
        console.log("voucherController::createVoucher => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};

export const deleteVoucher = async (req, res) => {
    const { voucher_id } = req.params;

    try {
        // Check if the voucher exists
        const [[voucher]] = await pool.query(
            "SELECT voucher_id FROM `voucher` WHERE voucher_id = ?",
            [voucher_id]
        );

        if (!voucher) {
            return res.status(404).json({
                message: RES_MESSAGES.VOUCHER_NOT_EXIST,
                data: "",
            });
        }

        // Delete the voucher
        await pool.query("DELETE FROM `voucher` WHERE voucher_id = ?", [voucher_id]);

        res.status(200).json({
            message: RES_MESSAGES.DELETE_VOUCHER_SUCCESS,
            data: "",
        });
    } catch (error) {
        console.error("voucherController::deleteVoucher => error:", error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};

export const updateVoucher = async (req, res) => {
    const { voucher_id } = req.params;
    const voucher = req.body;

    try {
        voucher.start_date = formatDateForMySQL(voucher.valid_date.from);
        voucher.end_date = formatDateForMySQL(voucher.valid_date.to);
        console.log(voucher);
        // Check if the voucher exists
        const [[existingVoucher]] = await pool.query(
            "SELECT * FROM `voucher` WHERE voucher_id = ?",
            [voucher_id]
        );

        if (!existingVoucher) {
            return res.status(404).json({
                message: RES_MESSAGES.VOUCHER_NOT_FOUND,
                data: "",
            });
        }

        // Check if voucher code is unique (excluding the current voucher)
        if (voucher.code) {
            const [[codeExists]] = await pool.query(
                "SELECT COUNT(*) AS count FROM `voucher` WHERE code = ? AND voucher_id != ?",
                [voucher.code, voucher_id]
            );

            if (codeExists.count > 0) {
                return res.status(400).json({
                    message: RES_MESSAGES.VOUCHER_CODE_EXIST,
                    data: "",
                });
            }
        }

        // Update voucher
        await pool.query(
            `UPDATE voucher 
             SET code = ?, discount_type = ?, discount_value = ?, min_order_value = ?, max_discount = ?, 
                 quantity = ?, start_date = ?, end_date = ?, modified_date = CURRENT_TIMESTAMP
             WHERE voucher_id = ?`,
            [
                voucher.code,
                voucher.discount_type,
                voucher.discount_value,
                voucher.min_order_value,
                voucher.max_discount,
                voucher.quantity,
                voucher.start_date,
                voucher.end_date,
                voucher_id,
            ]
        );

        // Fetch updated voucher
        const [[updatedVoucher]] = await pool.query(
            "SELECT * FROM `voucher` WHERE voucher_id = ?",
            [voucher_id]
        );

        res.status(200).json({
            message: RES_MESSAGES.UPDATE_VOUCHER_SUCCESS,
            data: updatedVoucher,
        });
    } catch (error) {
        console.error("voucherController::updateVoucher => error:", error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};

