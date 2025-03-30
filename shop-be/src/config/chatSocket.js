import { socketMiddleware } from "../middlewares/socketMiddleware.js";

const chatSocket = (io) => {
    io.use(socketMiddleware).on("connection", (socket) => {
        // pre-setup
        console.log(`{ userId: ${socket.userId}, socketId: ${socket.id} } has connected`);
        global.DbID_to_SocketID.set(socket.userId, socket.id);

        // join
        socket.join("temp");

        socket.on("send-message", (data) => {
            console.log(`user ${socket.userId} sended - ${data}`);
            io.to("temp").emit("new-message", data);
        })

        socket.on("disconnect", () => {
            console.log(`{ userId: ${socket.userId}, socketId: ${socket.id} } has disconnected`);
            // remove user from the user map
            global.DbID_to_SocketID.delete(socket.userId);
        });
    });
};

export default chatSocket;
