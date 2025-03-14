import express from "express";
import { existsSync, mkdirSync } from "fs";
import { PORT, SERVER_URL } from "./src/utils/constants.js";
import routes from "./src/routes/index.js"
import cors from "cors";

// express
const app = express();

// middlewares
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true, //access-control-allow-credentials:true
}));
app.use(express.json({ limit: "100mb" }));
app.use(express.static("STATIC"));
// routes
app.use("/", routes);

// STATIC
if (!existsSync("STATIC")) mkdirSync("STATIC");

// Connect to DB
app.listen(PORT, () => {
    console.log(`Server is running on ${SERVER_URL}`);
});