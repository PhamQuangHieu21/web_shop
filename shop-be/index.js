import express from "express";
import { existsSync, mkdirSync } from "fs";
import { PORT, SERVER_URL } from "./src/utils/constants.js";
import routes from "./src/routes/index.js"
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import chatSocket from "./src/config/chatSocket.js";

// express
dotenv.config();
const corsOptions = {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true, //access-control-allow-credentials:true
};

// server  
const app = express();
const server = createServer(app);
const socketIo = new Server(server, {
    cors: corsOptions,
});

// middlewares
app.use(cors(corsOptions));
app.use(express.json({ limit: "100mb" }));
app.use(express.static("STATIC"));

// routes
app.use("/", routes);

// STATIC
if (!existsSync("STATIC")) mkdirSync("STATIC");

// Connect to DB
server.listen(PORT, () => {
    console.log(`Server is running on ${SERVER_URL}`);
});

// chat
global.DbID_to_SocketID = new Map();
chatSocket(socketIo);