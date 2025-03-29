import { RES_MESSAGES } from "../utils/constants.js";
import pool from "../config/database.js";

// App api
export const getAllNotificationByUser = async (req, res) => {
    const { user_id } = req.params;
    try {
        const [notificationsList] = await pool.query(
            `SELECT 
                n.notification_id, n.title,  n.message, n.is_read, n.created_date
            FROM notification n
            WHERE n.user_id = ?`,
            [user_id]
        );

        res.status(200).json({
            message: "",
            data: notificationsList,
        });
    } catch (error) {
        console.log("cartController::getCartByUser => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
};

export const createNotificationByAdmin = async (req, res) => {
    const notification = req.body;
    try {
        const query = `
            INSERT INTO user_notification (user_id, title, message, is_read, created_date)
            VALUES (?, ?, ?, ?, NOW());
        `;
        await pool.query(
            query,
            [notification.user_id, notification.title, notification.message, false,]
        );

        res.status(200).json({
            message: RES_MESSAGES.ADD_NOTIFICATION,
            data: "",
        });
    } catch (error) {
        console.log("cartController::getCartByUser => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
}

export const updateStatusNotificationByUser = async (req, res) => {
    const { user_id, notification_id } = req.body;
    try {
        const query = `
            UPDATE user_notification
            SET is_read = TRUE
            WHERE user_id = ? AND notification_id = ?;
        `;
        await pool.query(
            query,
            [user_id, notification_id]
        );

        res.status(200).json({
            message: RES_MESSAGES.UPDATE_NOTIFICATION,
            data: "",
        });
    } catch (error) {
        console.log("cartController::getCartByUser => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
}

export const deleteNotificationByAdmin = async (req, res) => {
    const { user_id, notification_id } = req.body;
    try {
        const query = `
            DELETE FROM user_notification
            WHERE user_id = ? AND notification_id = ?;
        `;
        await pool.query(
            query,
            [user_id, notification_id]
        );

        res.status(200).json({
            message: RES_MESSAGES.UPDATE_NOTIFICATION,
            data: "",
        });
    } catch (error) {
        console.log("cartController::getCartByUser => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
}