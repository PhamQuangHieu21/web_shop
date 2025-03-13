import express from "express";
import { getAllProducts, likeProduct } from "../controllers/productController.js";

const router = express.Router();

router.get("/list", getAllProducts);
router.post("/like", likeProduct);

export default router;
