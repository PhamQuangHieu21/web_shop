import express from "express";

import userRoutes from "./userRoute.js";
import categoryRoutes from "./categoryRoute.js"
import productRoutes from "./productRoute.js"
import colorRoutes from "./colorRoute.js"
import sizeRoutes from "./sizeRoute.js"
import variantRoutes from "./variantRoute.js"
import voucherRoutes from "./voucherRoute.js"

const router = express.Router();

router.use("/user", userRoutes);
router.use("/category", categoryRoutes);
router.use("/product", productRoutes);
router.use("/color", colorRoutes);
router.use("/size", sizeRoutes);
router.use("/variant", variantRoutes);
router.use("/voucher", voucherRoutes);


export default router;
