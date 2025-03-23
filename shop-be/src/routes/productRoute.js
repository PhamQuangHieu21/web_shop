import express from "express";
import { createProduct, deleteProduct, getAllProducts, addProductToFavourite, updateProduct, getProductDetail, getAllProductsFavourite } from "../controllers/productController.js";
import { productImageUploader } from "../middlewares/uploader.js";

const router = express.Router();

router.get("/list/:id", getAllProducts);
router.get("/list_like/:id", getAllProductsFavourite);

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
