import express from "express";
import { applyVoucher, cancelOrder, changeOrderStatusByAdmin, completedOrder, createOrder, createOrderWithPaypal, getAllOrdersByAdmin, getOrderDetailByUser, getOrdersByUserIdAndStatus } from "../controllers/orderController.js";

const router = express.Router();

router.post("/new-paypal-order", createOrderWithPaypal);
router.post("/new", createOrder)
router.get("/list-by-admin", getAllOrdersByAdmin)
router.post("/orders-by-user", getOrdersByUserIdAndStatus)
router.get("/order-detail-by-user/:order_id", getOrderDetailByUser)
router.put("/cancel", cancelOrder);
router.put("/complete", completedOrder);
router.put("/change-status-by-admin", changeOrderStatusByAdmin)
router.put("/apply-voucher", applyVoucher)

export default router;
