import express from "express";
import { addReview, getProductReviews, getAllReviews, deleteReview } from "../Controller/reviewController.js";
import authMiddleware from "../Middleware/Authmiddleware.js";
import adminMiddleware from "../Middleware/Adminmiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Product review APIs
 */

/**
 * @swagger
 * /api/reviews/all:
 *   get:
 *     summary: Get all reviews across all products (Admin only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All reviews with product and user info
 *         content:
 *           application/json:
 *             example:
 *               - _id: "64f1c2rev001"
 *                 product:
 *                   _id: "64f1c2abc123"
 *                   name: Rosemary Oil
 *                   image: "uploads/rosemary.jpg"
 *                 user:
 *                   _id: "64f1c2abc456"
 *                   email: sanjana@gmail.com
 *                 name: Sanjana
 *                 rating: 5
 *                 comment: Great product!
 *                 createdAt: "2026-05-03T10:00:00Z"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access denied
 */
router.get("/all", authMiddleware, adminMiddleware, getAllReviews);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete a review by ID (Admin only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID to delete
 *         example: "64f1c2rev001"
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Review deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access denied
 *       404:
 *         description: Review not found
 */
router.delete("/:id", authMiddleware, adminMiddleware, deleteReview);

/**
 * @swagger
 * /api/reviews/{productId}:
 *   get:
 *     summary: Get all reviews for a specific product (Public)
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *         example: "64f1c2abc123"
 *     responses:
 *       200:
 *         description: List of reviews for the product
 *         content:
 *           application/json:
 *             example:
 *               - _id: "64f1c2rev001"
 *                 name: Sanjana
 *                 rating: 5
 *                 comment: Great product!
 *                 createdAt: "2026-05-03T10:00:00Z"
 *       500:
 *         description: Server error
 */
router.get("/:productId", getProductReviews);

/**
 * @swagger
 * /api/reviews/{productId}:
 *   post:
 *     summary: Add a review for a product (Logged-in user)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID to review
 *         example: "64f1c2abc123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rating, comment]
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Amazing product, highly recommend!"
 *     responses:
 *       201:
 *         description: Review added successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Review added
 *               review:
 *                 _id: "64f1c2rev001"
 *                 rating: 5
 *                 comment: "Amazing product, highly recommend!"
 *       400:
 *         description: Rating and comment are required
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       409:
 *         description: You have already reviewed this product
 */
router.post("/:productId", authMiddleware, addReview);

export default router;
