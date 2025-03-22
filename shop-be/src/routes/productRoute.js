import express from "express";
import { createProduct, deleteProduct, getAllProducts, addProductToFavourite, updateProduct, getProductDetail } from "../controllers/productController.js";
import { productImageUploader } from "../middlewares/uploader.js";

const router = express.Router();

router.get("/list", getAllProducts);
router.post("/like", addProductToFavourite);
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
router.get("/detail/:id", getProductDetail)

export default router;
