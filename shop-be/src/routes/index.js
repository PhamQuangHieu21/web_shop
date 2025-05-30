import express from "express";

import userRoutes from "./userRoute.js";
import categoryRoutes from "./categoryRoute.js"
import productRoutes from "./productRoute.js"
import colorRoutes from "./colorRoute.js"
import sizeRoutes from "./sizeRoute.js"
import variantRoutes from "./variantRoute.js"
import voucherRoutes from "./voucherRoute.js"
import reviewRoutes from "./reviewRoute.js"
import cartRoutes from "./cartRoute.js"
import orderRoutes from "./orderRoute.js"
import paymentRoutes from "./paymentRoute.js"
import notificationRoutes from "./notificationRoute.js"
import dashboardRoutes from "./dashboardRoute.js"
import chatRoute from "./chatRoute.js"

const router = express.Router();

router.use("/user", userRoutes);
router.use("/category", categoryRoutes);
router.use("/product", productRoutes);
router.use("/color", colorRoutes);
router.use("/chat", chatRoute);
router.use("/size", sizeRoutes);
router.use("/variant", variantRoutes);
router.use("/voucher", voucherRoutes);
router.use("/review", reviewRoutes);
router.use("/cart", cartRoutes);
router.use("/order", orderRoutes);
router.use("/payment", paymentRoutes)
router.use("/notification", notificationRoutes)
router.use("/dashboard", dashboardRoutes)

export default router;
