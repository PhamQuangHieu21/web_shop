import express from "express";
import { getAllOrdersByAdmin, getOrderDetailByUser, getOrdersByUserIdAndStatus } from "../controllers/orderController.js";

const router = express.Router();

router.get("/list-by-admin", getAllOrdersByAdmin)
router.post("/orders-by-user", getOrdersByUserIdAndStatus)
router.get("/order-detail-by-user/:order_id", getOrderDetailByUser)

export default router;
