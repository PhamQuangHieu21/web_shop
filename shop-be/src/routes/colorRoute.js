import express from "express";
import { createColor, deleteColor, getAllColors, updateColor } from "../controllers/colorController.js";

const router = express.Router();

router.get("/list", getAllColors)
router.post("/new", createColor)
router.delete("/delete/:id", deleteColor)
router.put("/update/:id", updateColor)

export default router;
