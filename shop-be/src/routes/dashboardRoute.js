import express from "express";
import { getStatistics } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/statistics", getStatistics)

export default router;
