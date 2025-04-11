import { RES_MESSAGES } from "../utils/constants.js";
import pool from "../config/database.js";

export const getChatHistory = async (req, res) => {
    const userId = req.params.userId;

    try {
        // Kiểm tra conversation
        const [conversations] = await pool.query(
            `SELECT conversation_id 
             FROM conversations 
             WHERE customer_id = ?`,
            [userId]
        );

        if (conversations.length === 0) {
            // Tạo conversation mới nếu chưa có
            const [newConversation] = await pool.query(
                `INSERT INTO conversations (customer_id) VALUES (?)`,
                [userId]
            );

            return res.status(200).json({
                success: true,
                message: "New conversation created",
                data: []
            });
        }

        // Lấy tin nhắn từ conversation
        const [messages] = await pool.query(
            `SELECT 
                m.message_id,
                m.conversation_id,
                m.sender_id,
                m.content,
                m.status,
                m.created_at,
                u.full_name as sender_name,
                u.role as sender_role
             FROM messages m
             LEFT JOIN users u ON m.sender_id = u.user_id
             WHERE m.conversation_id = ?
             ORDER BY m.created_at ASC`,
            [conversations[0].conversation_id]
        );

        // Cập nhật trạng thái tin nhắn thành đã đọc
        await pool.query(
            `UPDATE messages 
             SET status = 'read' 
             WHERE conversation_id = ? 
             AND sender_id != ?`,
            [conversations[0].conversation_id, userId]
        );

        return res.status(200).json({
            success: true,
            message: "Chat history retrieved successfully",
            data: messages
        });

    } catch (error) {
        console.error('Error in getChatHistory:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

// Lấy lịch sử chat với phân trang
export const getChatHistoryPaginated = async (req, res) => {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    try {
        // Lấy conversation_id
        const [conversations] = await pool.query(
            `SELECT conversation_id 
             FROM conversations 
             WHERE customer_id = ?`,
            [userId]
        );

        if (conversations.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No conversation found",
                data: {
                    messages: [],
                    pagination: {
                        total: 0,
                        page,
                        limit,
                        totalPages: 0
                    }
                }
            });
        }

        // Lấy tổng số tin nhắn
        const [totalRows] = await pool.query(
            `SELECT COUNT(*) as total 
             FROM messages 
             WHERE conversation_id = ?`,
            [conversations[0].conversation_id]
        );

        // Lấy tin nhắn với phân trang
        const [messages] = await pool.query(
            `SELECT 
                m.message_id,
                m.conversation_id,
                m.sender_id,
                m.content,
                m.status,
                m.created_at,
                u.full_name as sender_name,
                u.role as sender_role
             FROM messages m
             LEFT JOIN users u ON m.sender_id = u.user_id
             WHERE m.conversation_id = ?
             ORDER BY m.created_at DESC
             LIMIT ? OFFSET ?`,
            [conversations[0].conversation_id, limit, offset]
        );

        const totalMessages = totalRows[0].total;
        const totalPages = Math.ceil(totalMessages / limit);

        return res.status(200).json({
            success: true,
            message: "Chat history retrieved successfully",
            data: {
                messages: messages.reverse(),
                pagination: {
                    total: totalMessages,
                    page,
                    limit,
                    totalPages
                }
            }
        });

    } catch (error) {
        console.error('Error in getChatHistoryPaginated:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}