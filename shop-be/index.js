import express from "express";
import { existsSync, mkdirSync } from "fs";
import { PORT, SERVER_URL } from "./src/utils/constant.js";
import connection from "./src/config/database.js";

// express
const app = express();

// middlewares
app.use(express.json({ limit: "100mb" }));
app.use(express.static("STATIC"));
// routes
app.get('/', (req, res) => {
    res.send('hello');
});

// STATIC
if (!existsSync("STATIC")) mkdirSync("STATIC");

// Connect to DB
app.listen(PORT, () => {
    console.log(`Server is running on ${SERVER_URL}`);
});