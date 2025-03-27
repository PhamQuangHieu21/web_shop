import pool from "../config/database.js";
import { capturePaypalOrder } from "../config/paypal.js";
import { ORDER_STATUS, RES_MESSAGES } from "../utils/constants.js";

export const handlePaypalPaymentSuccess = async (req, res) => {
    const { orderId, token } = req.query;
    try {
        // Validate
        if (!token || !orderId) {
            return res.status(400).json({
                message: RES_MESSAGES.PAYPAL_PAYMENT_FAIL,
                data: "",
            });
        }

        const [[orderExists]] = await pool.query(
            "SELECT COUNT(*) AS count FROM `order` WHERE order_id = ?",
            [orderId]
        );
        if (!orderExists.count) {
            return res.status(404).json({
                message: RES_MESSAGES.PAYPAL_PAYMENT_FAIL,
                data: "",
            });
        }

        // Capture Paypal order
        const captureResult = await capturePaypalOrder(token);

        // If the capture succeeds then complete the order
        if (captureResult.status === 200) {
            await pool.query(
                `UPDATE \`order\` SET status = ?, modified_date = NOW() WHERE order_id = ?`,
                [ORDER_STATUS.COMPLETED, orderId]
            );
        }

        res.status(captureResult.status).json({
            message: captureResult.message,
            data: "",
        });
    } catch (error) {
        console.log("paymentController::handlePaypalPaymentSuccess => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.PAYPAL_PAYMENT_FAIL,
            data: "",
        });
    }
};

export const handlePaypalPaymentCancel = async (req, res) => {
    const { orderId } = req.query;
    try {
        // Validate
        if (!orderId) {
            return res.status(400).json({
                message: RES_MESSAGES.PAYPAL_PAYMENT_FAIL,
                data: "",
            });
        }

        const [[orderExists]] = await pool.query(
            "SELECT COUNT(*) AS count FROM `order` WHERE order_id = ?",
            [orderId]
        );
        if (!orderExists.count) {
            return res.status(404).json({
                message: RES_MESSAGES.PAYPAL_PAYMENT_FAIL,
                data: "",
            });
        }

        // Mark the order as cancelled
        await pool.query(
            `UPDATE \`order\` SET status = ?, modified_date = NOW() WHERE order_id = ?`,
            [ORDER_STATUS.CANCELLED, orderId]
        );

        res.status(200).json({
            message: RES_MESSAGES.CANCEL_PAYMENT_SUCCESS,
            data: "",
        });
    } catch (error) {
        console.log("paymentController::handlePaypalPaymentCancel => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.PAYPAL_PAYMENT_FAIL,
            data: "",
        });
    }
};