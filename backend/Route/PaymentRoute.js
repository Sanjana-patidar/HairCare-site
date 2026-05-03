import express from "express";
import { createRazorpayOrder, verifyPayment } from '../Controller/PaymentController.js';
import authMiddleware from '../Middleware/AuthMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payment
 *   description: Razorpay payment APIs
 */

/**
 * @swagger
 * /api/payment/create-order:
 *   post:
 *     summary: Create a Razorpay payment order
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount]
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Amount in INR
 *                 example: 1198
 *               currency:
 *                 type: string
 *                 default: INR
 *     responses:
 *       200:
 *         description: Razorpay order created
 *         content:
 *           application/json:
 *             example:
 *               id: "order_PFgHjK123"
 *               amount: 119800
 *               currency: INR
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Razorpay error
 */
router.post("/create-order", authMiddleware, createRazorpayOrder);

/**
 * @swagger
 * /api/payment/verify:
 *   post:
 *     summary: Verify Razorpay payment signature
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [razorpay_order_id, razorpay_payment_id, razorpay_signature]
 *             properties:
 *               razorpay_order_id:
 *                 type: string
 *                 example: "order_PFgHjK123"
 *               razorpay_payment_id:
 *                 type: string
 *                 example: "pay_PFgHjL456"
 *               razorpay_signature:
 *                 type: string
 *                 example: "abc123hmacsha256signaturehere"
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Payment verified
 *       400:
 *         description: Invalid payment signature
 *       401:
 *         description: Unauthorized
 */
router.post("/verify", authMiddleware, verifyPayment);

export default router;