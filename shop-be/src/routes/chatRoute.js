import express from "express";
import { getChatHistory, getChatHistoryPaginated } from "../controllers/chatController.js";

const router = express.Router();

router.get('/history/:userId', getChatHistory);
router.get('/history-paginated/:userId', getChatHistoryPaginated);



export default router;
