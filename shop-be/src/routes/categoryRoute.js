import express from "express";
import { createCategory, deleteCategory, getAllCategories, updateCategory } from "../controllers/categoryController.js";

const router = express.Router();

router.get("/list", getAllCategories)
router.post("/new", createCategory)
router.delete("/delete/:id", deleteCategory)
router.put("/update/:id", updateCategory)

export default router;
