import express from "express";
import { createProduct, deleteProduct, getAllProducts, likeProduct } from "../controllers/productController.js";
import { productImageUploader } from "../middlewares/uploader.js";

const router = express.Router();

router.get("/list", getAllProducts);
router.post("/like", likeProduct);
router.post(
    "/new",
    productImageUploader.array("images"),
    createProduct
);
router.delete("/delete/:id", deleteProduct)

export default router;
