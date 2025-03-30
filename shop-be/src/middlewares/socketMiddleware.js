import dotenv from "dotenv";
import pool from "../config/database.js";
dotenv.config();

export const socketMiddleware = async (socket, next) => {
    const error = new Error("ALO");
    error.data = 401;

    // Validate userId from socket request
    const userId = socket.handshake.query.userId;
    if (!userId) {
        console.log("Socket request does not contain userId")
        next(error);
        return;
    }

    // Validate userId from DB
    const [existingUser] = await pool.query(
        "SELECT user_id FROM user WHERE user_id = ?",
        [userId]
    )
    if (!existingUser.length) {
        next(error);
        return;
    }

    socket.userId = userId;
    next();
};
