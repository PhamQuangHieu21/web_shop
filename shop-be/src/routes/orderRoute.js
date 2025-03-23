import express from "express";
import { getAllOrdersByAdmin } from "../controllers/orderController.js";

const router = express.Router();

router.get("/list-by-admin", getAllOrdersByAdmin);

export default router;
