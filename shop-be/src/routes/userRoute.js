import express from "express";
import {
    login,
    ping,
    register,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/ping", ping);
router.post("/register", register);
router.post("/login", login);

export default router;
