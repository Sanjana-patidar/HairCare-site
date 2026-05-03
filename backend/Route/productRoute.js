import express from "express"
import { uploadProductImages } from "../Middleware/upload.js";
import authMiddleware from "../Middleware/Authmiddleware.js"; 
import adminMiddleware from "../Middleware/Adminmiddleware.js";
import {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateProductStatus,
  getProductsByCategory
} from '../Controller/productController.js'

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management APIs
 */

/**
 * @swagger
 * /api/products/add:
 *   post:
 *     summary: Add a new product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, description, price, discountprice, discountpercentage, category, stock]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Rosemary Oil
 *               description:
 *                 type: string
 *                 example: Best for healthy Hair!
 *               price:
 *                 type: number
 *                 example: 799
 *               discountprice:
 *                 type: number
 *                 example: 599
 *               discountpercentage:
 *                 type: number
 *                 example: 10
 *               category:
 *                 type: string
 *                 example: oil
 *               stock:
 *                 type: number
 *                 example: 50
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access denied
 */
router.post("/add", uploadProductImages, authMiddleware, adminMiddleware, addProduct);

/**
 * @swagger
 * /api/products/all:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: Filter by product status
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             example:
 *               - _id: "64f1c2abc123"
 *                 name: Rosemary Oil
 *                 price: 799
 *                 discountprice: 599
 *                 category: oil
 *                 rating: 4.5
 *                 stock: 50
 *                 status: active
 */
router.get("/all", getAllProducts);

/**
 * @swagger
 * /api/products/category/{category}:
 *   get:
 *     summary: Get products by category
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Category name (e.g. shampoo, oil, serum, conditioner)
 *         example: oil
 *     responses:
 *       200:
 *         description: Products in the given category
 *       404:
 *         description: No products found
 */
router.get("/category/:category", getProductsByCategory);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a single product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *         example: "64f1c2abc123"
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             example:
 *               _id: "64f1c2abc123"
 *               name: Rosemary Oil
 *               price: 799
 *               discountprice: 599
 *               category: oil
 *               rating: 4.5
 *               stock: 50
 *       404:
 *         description: Product not found
 */
router.get("/:id", getProductById);

/**
 * @swagger
 * /api/products/update/{id}:
 *   put:
 *     summary: Update a product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               discountprice:
 *                 type: number
 *               discountpercentage:
 *                 type: number
 *               category:
 *                 type: string
 *               stock:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access denied
 *       404:
 *         description: Product not found
 */
router.put("/update/:id", uploadProductImages, authMiddleware, adminMiddleware, updateProduct);

/**
 * @swagger
 * /api/products/delete/{id}:
 *   delete:
 *     summary: Delete a product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access denied
 *       404:
 *         description: Product not found
 */
router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteProduct);

/**
 * @swagger
 * /api/products/status/{id}:
 *   patch:
 *     summary: Toggle product status active/inactive (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
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
 *                 enum: [active, inactive]
 *                 example: inactive
 *     responses:
 *       200:
 *         description: Product status updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access denied
 */
router.patch("/status/:id", authMiddleware, adminMiddleware, updateProductStatus);

export default router;