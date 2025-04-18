import express from "express";
import { createProduct, deleteProduct, getAllProducts, addProductToFavourite, updateProduct, getAllProductsList, getProductDetail, getAllProductsFavourite, getAllProductsByCategoryId, getAllProductsByAdmin } from "../controllers/productController.js";
import { productImageUploader } from "../middlewares/uploader.js";

const router = express.Router();

router.get("/list-by-admin", getAllProductsByAdmin)
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
router.post("/detail", getProductDetail)
router.get("/category_id/:id", getAllProductsByCategoryId)
router.get("/all-list", getAllProductsList)


export default router;
