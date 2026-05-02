import express from "express";
import authMiddleware from "../Middleware/Authmiddleware.js";
import adminMiddleware from "../Middleware/Adminmiddleware.js";
import { signup, login, getAllUsers, deleteUser, getUserProfile, updateUserProfile, addAddress, updateAddress, deleteAddress, addToWishlist, removeFromWishlist, getWishlist } from '../Controller/UserController.js'


const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User APIs
 */

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account with email and password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               username:
 *                 type: string
 *                 example: sanjana
 *               email:
 *                 type: string
 *                 example: sanjana@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               confirmPassword:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: Signup successful
 *         content:
 *           application/json:
 *             example:
 *               message: Signup successful
 *               token: "jwt_token_here"
 *               user:
 *                 id: "64f1c2abc123"
 *                 username: sanjana
 *                 email: sanjana@gmail.com
 *                 role: user
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             examples:
 *               passwordMismatch:
 *                 value:
 *                   message: password does not match
 *               userExists:
 *                 value:
 *                   message: User already exists
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               message: Signup error
 */
router.post('/signup', signup);
/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user
 *     description: Authenticate user using email and password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: sanjana@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               message: Login successful
 *               token: "jwt_token_here"
 *               user:
 *                 id: "64f1c2abc123"
 *                 username: sanjana
 *                 email: sanjana@gmail.com
 *                 role: user
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             examples:
 *               userNotFound:
 *                 value:
 *                   message: user does not exist
 *               wrongPassword:
 *                 value:
 *                   message: invalid password
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               message: login error
 */
router.post('/login', login);
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Fetch list of all registered users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               users:
 *                 - id: "64f1c2abc123"
 *                   username: sanjana
 *                   email: sanjana@gmail.com
 *                   role: user
 *                 - id: "64f1c2abc456"
 *                   username: rahul
 *                   email: rahul@gmail.com
 *                   role: admin
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Server error
 */
router.get('/', getAllUsers);
/**
 * @swagger
 * /api/users/delete/{id}:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     description: Only admin can delete a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *           example: 64f1c2abc123
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteUser);

// Profile and Address Routes
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);
router.post('/address', authMiddleware, addAddress);
router.put('/address/:addressId', authMiddleware, updateAddress);
router.delete('/address/:addressId', authMiddleware, deleteAddress);

// Wishlist Routes
router.get('/wishlist', authMiddleware, getWishlist);
router.post('/wishlist', authMiddleware, addToWishlist);
router.delete('/wishlist/:productId', authMiddleware, removeFromWishlist);

export default router;