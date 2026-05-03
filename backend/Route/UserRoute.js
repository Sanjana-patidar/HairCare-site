import express from "express";
import authMiddleware from "../Middleware/Authmiddleware.js";
import adminMiddleware from "../Middleware/Adminmiddleware.js";
import { signup, login, getAllUsers, deleteUser, getUserProfile, updateUserProfile, addAddress, updateAddress, deleteAddress, addToWishlist, removeFromWishlist, getWishlist, changePassword } from '../Controller/UserController.js'


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

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get logged-in user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched
 *         content:
 *           application/json:
 *             example:
 *               _id: "64f1c2abc123"
 *               username: sanjana
 *               email: sanjana@gmail.com
 *               phone: "9876543210"
 *               gender: Female
 *               dob: "1999-05-15"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/profile', authMiddleware, getUserProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update logged-in user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: sanjana_updated
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *                 example: Female
 *               dob:
 *                 type: string
 *                 example: "1999-05-15"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put('/profile', authMiddleware, updateUserProfile);

/**
 * @swagger
 * /api/users/address:
 *   post:
 *     summary: Add a new address
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, phoneNo, address, pincode, city, state]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sanjana Patidar
 *               phoneNo:
 *                 type: string
 *                 example: "9876543210"
 *               addressType:
 *                 type: string
 *                 enum: [Home, Business, Other]
 *                 example: Home
 *               address:
 *                 type: string
 *                 example: "123, Main Road"
 *               pincode:
 *                 type: string
 *                 example: "380001"
 *               city:
 *                 type: string
 *                 example: Ahmedabad
 *               state:
 *                 type: string
 *                 example: Gujarat
 *               country:
 *                 type: string
 *                 example: India
 *     responses:
 *       201:
 *         description: Address added successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/address', authMiddleware, addAddress);

/**
 * @swagger
 * /api/users/address/{addressId}:
 *   put:
 *     summary: Update an existing address
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phoneNo:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               pincode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Address updated successfully
 *       404:
 *         description: Address not found
 */
router.put('/address/:addressId', authMiddleware, updateAddress);

/**
 * @swagger
 * /api/users/address/{addressId}:
 *   delete:
 *     summary: Delete an address
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *         description: Address ID to delete
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *       404:
 *         description: Address not found
 */
router.delete('/address/:addressId', authMiddleware, deleteAddress);

/**
 * @swagger
 * /api/users/wishlist:
 *   get:
 *     summary: Get user wishlist
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist fetched
 *         content:
 *           application/json:
 *             example:
 *               wishlist:
 *                 - _id: "64f1c2abc123"
 *                   name: Rosemary Oil
 *                   discountprice: 599
 */
router.get('/wishlist', authMiddleware, getWishlist);

/**
 * @swagger
 * /api/users/wishlist:
 *   post:
 *     summary: Add product to wishlist
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId]
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "64f1c2abc123"
 *     responses:
 *       200:
 *         description: Added to wishlist
 *       404:
 *         description: User not found
 */
router.post('/wishlist', authMiddleware, addToWishlist);

/**
 * @swagger
 * /api/users/wishlist/{productId}:
 *   delete:
 *     summary: Remove product from wishlist
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID to remove from wishlist
 *     responses:
 *       200:
 *         description: Removed from wishlist
 */
router.delete('/wishlist/:productId', authMiddleware, removeFromWishlist);

/**
 * @swagger
 * /api/users/change-password:
 *   put:
 *     summary: Change user password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: "oldpass123"
 *               newPassword:
 *                 type: string
 *                 example: "newpass456"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Current password is incorrect
 *       401:
 *         description: Unauthorized
 */
router.put('/change-password', authMiddleware, changePassword);

export default router;