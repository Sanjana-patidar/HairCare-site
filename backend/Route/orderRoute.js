import express from "express";
import { placeOrder, getAllOrders, updateOrderStatus, getMyOrders, getOrderNotifications } from "../Controller/orderController.js";
import authMiddleware from "../Middleware/Authmiddleware.js";
import adminMiddleware from "../Middleware/Adminmiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management APIs
 */

/**
 * @swagger
 * /api/orders/place:
 *   post:
 *     summary: Place a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items, address, paymentMethod, totalAmount]
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                       example: "64f1c2abc123"
 *                     quantity:
 *                       type: number
 *                       example: 2
 *                     price:
 *                       type: number
 *                       example: 599
 *               address:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: Sanjana Patidar
 *                   phoneNo:
 *                     type: string
 *                     example: "9876543210"
 *                   address:
 *                     type: string
 *                     example: "123, Main Road"
 *                   city:
 *                     type: string
 *                     example: Ahmedabad
 *                   state:
 *                     type: string
 *                     example: Gujarat
 *                   pincode:
 *                     type: string
 *                     example: "380001"
 *               paymentMethod:
 *                 type: string
 *                 enum: [COD, Razorpay]
 *                 example: COD
 *               totalAmount:
 *                 type: number
 *                 example: 1198
 *     responses:
 *       201:
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Order placed successfully
 *               order:
 *                 _id: "64f1c2abc999"
 *                 status: Pending
 *                 totalAmount: 1198
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post("/place", authMiddleware, placeOrder);

/**
 * @swagger
 * /api/orders/orderhistory:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 *         content:
 *           application/json:
 *             example:
 *               - _id: "64f1c2abc999"
 *                 user:
 *                   username: sanjana
 *                   email: sanjana@gmail.com
 *                 status: Pending
 *                 totalAmount: 1198
 *                 createdAt: "2026-05-03T10:00:00Z"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access denied
 */
router.get("/orderhistory", authMiddleware, adminMiddleware, getAllOrders);

/**
 * @swagger
 * /api/orders/myorders:
 *   get:
 *     summary: Get orders of logged-in user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User order history
 *         content:
 *           application/json:
 *             example:
 *               - _id: "64f1c2abc999"
 *                 status: Delivered
 *                 totalAmount: 599
 *                 createdAt: "2026-05-01T10:00:00Z"
 *       401:
 *         description: Unauthorized
 */
router.get("/myorders", authMiddleware, getMyOrders);

/**
 * @swagger
 * /api/orders/notifications:
 *   get:
 *     summary: Get order notifications for admin
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent order notifications
 *         content:
 *           application/json:
 *             example:
 *               - _id: "64f1c2abc999"
 *                 user:
 *                   username: sanjana
 *                 totalAmount: 1198
 *                 createdAt: "2026-05-03T10:00:00Z"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access denied
 */
router.get("/notifications", authMiddleware, adminMiddleware, getOrderNotifications);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Update order status (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *         example: "64f1c2abc999"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Processing, Shipped, Delivered, Cancelled]
 *                 example: Shipped
 *     responses:
 *       200:
 *         description: Order status updated
 *         content:
 *           application/json:
 *             example:
 *               message: Order status updated
 *               order:
 *                 _id: "64f1c2abc999"
 *                 status: Shipped
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access denied
 *       404:
 *         description: Order not found
 */
router.patch("/:id/status", authMiddleware, adminMiddleware, updateOrderStatus);

export default router;
