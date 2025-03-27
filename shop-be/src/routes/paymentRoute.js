import express from "express";
import { handlePaypalPaymentCancel, handlePaypalPaymentSuccess } from "../controllers/paymentController.js";

const router = express.Router();

router.get("/paypal-success", handlePaypalPaymentSuccess)
router.get("/paypal-cancel", handlePaypalPaymentCancel)

export default router;
