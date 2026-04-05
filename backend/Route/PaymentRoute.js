import express from "express";
import { createRazorpayOrder, verifyPayment } from '../Controller/PaymentController.js';
import  authMiddleware  from '../Middleware/AuthMiddleware.js';

const router = express.Router();

router.post("/create-order", authMiddleware, createRazorpayOrder);
router.post("/verify", authMiddleware, verifyPayment);

export default router;