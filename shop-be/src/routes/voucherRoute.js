import express from "express";
import { createVoucher, deleteVoucher, getAllVouchers, updateVoucher } from "../controllers/voucherController.js";

const router = express.Router();

router.get("/list", getAllVouchers)
router.post("/new", createVoucher)
router.delete("/delete/:voucher_id", deleteVoucher)
router.put("/update/:voucher_id", updateVoucher)

export default router;
