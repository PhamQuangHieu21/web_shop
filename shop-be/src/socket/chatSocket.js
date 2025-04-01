import pool from "../config/database.js";
import { socketMiddleware } from "../middlewares/socketMiddleware.js";
import { formatDateForMySQL } from "../utils/operator.js";

const handleDisconnect = (socket) => {
    console.log(`{ userId: ${socket.userId}, socketId: ${socket.id} } has disconnected`);
    // remove user from the user map
    global.DbID_to_SocketID.delete(socket.userId);
}

const handleUserSendMessage = async (socket, data) => { // data { message, date }
    try {
        const [[user]] = await pool.query("SELECT full_name FROM user WHERE user_id = ?", [socket.userId])

        if (!user) {
            console.log("handleUserSendMessage() failed: user not found");
            return;
        }

        const [conversation] = await pool.query(
            "SELECT * FROM conversation WHERE customer_id = ?",
            [socket.userId]
        )

        const created_at = formatDateForMySQL(data.date)
        if (conversation.length === 0) { // not chat yet
            // create new conversation
            const [addConversationResult] = await pool.query(
                `INSERT INTO conversation (customer_id, name, last_message, last_message_time) 
                VALUES (?, ?, ?, ?)`,
                [socket.userId, user.full_name, data.message, created_at]
            )
            const insertedConversationId = addConversationResult.insertId;

            // re-fetch new conversation
            const [[newConversation]] = await pool.query(
                "SELECT * FROM conversation WHERE conversation_id = ?",
                [insertedConversationId]
            )

            // create new message
            const [addMessageResult] = await pool.query(
                `INSERT INTO message (conversation_id, sender_id, content, created_at) 
                VALUES (?, ?, ?, ?)`,
                [insertedConversationId, socket.userId, data.message, created_at]
            )
            const insertedMessageId = addMessageResult.insertId;

            // re-fetch new message
            const [[newMessage]] = await pool.query(
                "SELECT * FROM message WHERE message_id = ?",
                [insertedMessageId]
            )

            // notify admin with new conversation and new message
            socket.broadcast.emit("new-message-from-customer", {
                conversation: newConversation,
                message: newMessage,
            })
        } else { // already chat
            // create new message
            const [addMessageResult] = await pool.query(
                `INSERT INTO message (conversation_id, sender_id, content, created_at) 
                VALUES (?, ?, ?, ?)`,
                [conversation[0].conversation_id, socket.userId, data.message, created_at]
            )
            const insertedMessageId = addMessageResult.insertId;

            // re-fetch new message
            const [[newMessage]] = await pool.query(
                "SELECT * FROM message WHERE message_id = ?",
                [insertedMessageId]
            )

            // Update conversation with last message
            await pool.query(
                `UPDATE conversation
                SET last_message = ?, last_message_time = ?
                WHERE conversation_id = ?`,
                [newMessage.content, created_at, conversation[0].conversation_id]
            )

            // Update last message to local conversation
            conversation[0].last_message = newMessage.content;
            conversation[0].last_message_time = created_at;

            // notify admin with new message
            socket.broadcast.emit("new-message-from-customer", {
                conversation: conversation[0],
                message: newMessage,
            })
        }
    } catch (err) {
        console.error("handleUserSendMessage() failed: ", err);
    }
}

const handleAdminSendMessage = async (socket, data) => { // data { conversation_id, customer_id, message, date }
    try {
        const [conversation] = await pool.query(
            "SELECT * FROM conversation WHERE conversation_id = ?",
            [data.conversation_id]
        )

        const created_at = formatDateForMySQL(data.date);
        if (conversation.length > 0) { // not chat yet
            // create new message
            const [addMessageResult] = await pool.query(
                `INSERT INTO message (conversation_id, sender_id, content, created_at) 
                VALUES (?, ?, ?, ?)`,
                [conversation[0].conversation_id, socket.userId, data.message, created_at]
            )
            const insertedMessageId = addMessageResult.insertId;

            // re-fetch new message
            const [[newMessage]] = await pool.query(
                "SELECT * FROM message WHERE message_id = ?",
                [insertedMessageId]
            )

            // Update conversation with last message
            await pool.query(
                `UPDATE conversation
                SET last_message = ?, last_message_time = ?
                WHERE conversation_id = ?`,
                [newMessage.content, created_at, conversation[0].conversation_id]
            )

            // Update last message to local conversation
            conversation[0].last_message = newMessage.content;
            conversation[0].last_message_time = created_at;

            // notify customer with new message
            socket.broadcast.to(global.DbID_to_SocketID.get(data.customer_id)).emit("new-message-from-admin", {
                conversation: conversation[0],
                message: newMessage,
            })
        }
    } catch (err) {
        console.error("handleAdminSendMessage() failed: ", err);
    }
}

const fetchConversationList = async (socket) => {
    const [conversations] = await pool.query(
        "SELECT * FROM conversation",
        []
    )

    socket.emit("return-conversation-list", conversations);
}

const fetchConversation = async (socket, conversationId) => {
    const [conversation] = await pool.query(
        "SELECT * FROM message WHERE conversation_id = ?",
        [conversationId]
    )

    socket.emit("return-conversation", conversation);
}

const handleConnect = (socket) => {
    try {
        console.log(`{ userId: ${socket.userId}, socketId: ${socket.id} } has connected`);
        socket.on("fetch-conversation", (conversationId) => fetchConversation(socket, conversationId))
        socket.on("fetch-conversation-list", () => fetchConversationList(socket))
        socket.on("send-message-to-admin", (message) => handleUserSendMessage(socket, message))
        socket.on("send-message-to-customer", (data) => handleAdminSendMessage(socket, data))
        socket.on("disconnect", () => handleDisconnect(socket));
    } catch (error) {
        console.log(`handleConnect() failed: ${error}`);
    }
}

const chatSocket = (io) => {
    io.use(socketMiddleware).on("connection", handleConnect);
};

export default chatSocket;
