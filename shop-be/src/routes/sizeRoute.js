import express from "express";
import { createSize, deleteSize, getAllSizes, updateSize } from "../controllers/sizeController.js";

const router = express.Router();

router.get("/list", getAllSizes)
router.post("/new", createSize)
router.delete("/delete/:id", deleteSize)
router.put("/update/:id", updateSize)

export default router;
