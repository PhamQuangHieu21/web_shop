import express from "express";
import { createProduct, deleteProduct, getAllProducts, likeProduct, updateProduct } from "../controllers/productController.js";
import { productImageUploader } from "../middlewares/uploader.js";

const router = express.Router();

router.get("/list", getAllProducts);
router.post("/like", likeProduct);
router.post(
    "/new",
    productImageUploader.array("new_images"),
    createProduct
);
router.put(
    "/update/:product_id",
    productImageUploader.array("new_images"),
    updateProduct
);
router.delete("/delete/:id", deleteProduct)

export default router;
