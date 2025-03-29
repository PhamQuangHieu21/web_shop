import { RES_MESSAGES } from "../utils/constants.js";
import pool from "../config/database.js";

// App api
export const getAllNotificationByUser = async (req, res) => {
    const { id } = req.params;
    try {
        const [notificationsList] = await pool.query(
            `SELECT 
                notification_id, title,  message, is_read, created_date
            FROM user_notification
            WHERE user_id = ?`,
            [id]
        );

        res.status(200).json({
            message: "",
            data: notificationsList,
        });
    } catch (error) {
        console.log("notificationController::getAllNotificationByUser => error: " + error);
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
        console.log("notificationController::createNotificationByAdmin => error: " + error);
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
        console.log("notificationController::updateStatusNotificationByUser => error: " + error);
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
        console.log("notificationController::deleteNotificationByAdmin => error: " + error);
        res.status(500).json({
            message: RES_MESSAGES.SERVER_ERROR,
            data: "",
        });
    }
}