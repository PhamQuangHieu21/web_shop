import express from "express";
import { getCommonStatistics, getIncomeData, getOrderAndTopProductStatistics } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/common-statistics", getCommonStatistics)
router.post("/order-and-top-products", getOrderAndTopProductStatistics)
router.post("/income", getIncomeData)

export default router;
