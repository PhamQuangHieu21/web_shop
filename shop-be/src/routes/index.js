import express from "express";

import userRoutes from "./userRoute.js";
import categoryRoutes from "./categoryRoute.js"
import productRoutes from "./productRoute.js"

const router = express.Router();

router.use("/user", userRoutes);
router.use("/category", categoryRoutes);
router.use("/product", productRoutes);

export default router;
