import express from 'express';
import authMiddleware from "../Middleware/Authmiddleware.js";
import adminMiddleware from "../Middleware/Adminmiddleware.js";
import upload from "../middleware/upload.js";
import { createBrand, getAllBrands, deleteBrand } from '../Controller/BrandController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Brands
 *   description: Brand management APIs
 */

/**
 * @swagger
 * /api/brands/add:
 *   post:
 *     summary: Add a new brand (Admin only)
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Parachute
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: Brand logo image file
 *     responses:
 *       201:
 *         description: Brand created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Brand created
 *               brand:
 *                 _id: "64f1c2abc321"
 *                 name: Parachute
 *                 logo: "uploads/parachute.png"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access denied
 */
router.post('/add', authMiddleware, adminMiddleware, upload.single("logo"), createBrand);

/**
 * @swagger
 * /api/brands:
 *   get:
 *     summary: Get all brands
 *     tags: [Brands]
 *     responses:
 *       200:
 *         description: List of all brands
 *         content:
 *           application/json:
 *             example:
 *               - _id: "64f1c2abc321"
 *                 name: Parachute
 *                 logo: "uploads/parachute.png"
 *               - _id: "64f1c2abc322"
 *                 name: Mamaearth
 *                 logo: "uploads/mamaearth.png"
 *       500:
 *         description: Server error
 */
router.get('/', getAllBrands);

/**
 * @swagger
 * /api/brands/{id}:
 *   delete:
 *     summary: Delete a brand (Admin only)
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Brand ID to delete
 *         example: "64f1c2abc321"
 *     responses:
 *       200:
 *         description: Brand deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access denied
 *       404:
 *         description: Brand not found
 */
router.delete('/:id', authMiddleware, adminMiddleware, deleteBrand);

export default router;