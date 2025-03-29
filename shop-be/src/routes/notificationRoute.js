import express from "express";

import { getAllNotificationByUser, updateStatusNotificationByUser } from "../controllers/notificationController.js"
const router = express.Router();


router.get("/list-by-user/:id", getAllNotificationByUser)
router.post("/updateStatusNotification", updateStatusNotificationByUser)


export default router;
