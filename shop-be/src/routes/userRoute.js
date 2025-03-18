import express from "express";
import {
    login,
    ping,
    register,
    updateUsers,
    updatedPassword,
    getAllUsers
} from "../controllers/userController.js";

const router = express.Router();

router.get("/ping", ping);
router.get("/getAllUsers", getAllUsers);
router.post("/register", register);
router.post("/login", login);
router.post("/update/:id", updateUsers);
router.post("/updatePassword/:id", updatedPassword);
export default router;
