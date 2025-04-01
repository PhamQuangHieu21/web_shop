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

    // Validate userRole from socket request
    const userRole = socket.handshake.query.userRole;
    if (!userRole) {
        console.log("Socket request does not contain userRole")
        next(error);
        return;
    }

    // Validate if user exists
    const [existingUser] = await pool.query(
        "SELECT user_id, role FROM user WHERE user_id = ?",
        [userId]
    )
    if (!existingUser.length) {
        next(error);
        return;
    }

    // Validate role
    if (userRole !== existingUser[0].role) {
        console.log(userRole)
        console.log(existingUser[0].role)
        console.log("Roles from DB and request are not same")
        next(error);
        return;
    }

    // Assign admin id
    if (userRole === "admin") global.adminId = userId;

    socket.userId = Number(userId);
    socket.userRole = userRole;
    global.DbID_to_SocketID.set(socket.userId, socket.id);
    next();
};
