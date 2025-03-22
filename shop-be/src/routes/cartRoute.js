import express from "express";
import { createCart, deleteCart, getCartByUser, updateCart } from "../controllers/cartController.js";

const router = express.Router();

router.get("/cart-by-user/:user_id", getCartByUser)
router.post("/new", createCart)
router.delete("/delete/:cart_id", deleteCart)
router.put("/update/:cart_id", updateCart)
export default router;
