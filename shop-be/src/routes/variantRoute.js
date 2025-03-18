import express from "express";
import { createVariant, deleteVariant, getAllVariants, getDependencies, updateVariant } from "../controllers/variantController.js";

const router = express.Router();

router.get("/list", getAllVariants);
router.get("/dependencies", getDependencies);
router.post("/new", createVariant);
router.put("/update/:variant_id", updateVariant);
router.delete("/delete/:id", deleteVariant);

export default router;
