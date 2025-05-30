import express from "express";
import {
    login,
    register,
    updateUsers,
    updatedPassword,
    resetPassword,
    getAllUsersByAdmin,
    adminLogin
} from "../controllers/userController.js";

const router = express.Router();

router.get("/users-by-admin", getAllUsersByAdmin);
router.post("/register", register);
router.post("/login", login);
router.post("/update", updateUsers);
router.post("/resetPassword", resetPassword);
router.post("/adminlogin", adminLogin);
router.post("/updatePassword/:id", updatedPassword);
export default router;
