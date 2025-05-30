import express from "express";
import { createReview, deleteReview, getAllReviewsByProduct, getAllReviewsByProductByUser, updateReview } from "../controllers/reviewController.js";

const router = express.Router();

router.get("/list-by-product/:product_id", getAllReviewsByProduct)
router.get("/list-by-user/:id", getAllReviewsByProductByUser)
router.post("/new", createReview)
router.delete("/delete/:review_id", deleteReview)
router.put("/update/:review_id", updateReview)

export default router;
