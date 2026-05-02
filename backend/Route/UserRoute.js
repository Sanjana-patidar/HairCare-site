import express from "express";
import authMiddleware from "../Middleware/Authmiddleware.js";
import adminMiddleware from "../Middleware/Adminmiddleware.js";
import { signup, login, getAllUsers, deleteUser, getUserProfile, updateUserProfile, addAddress, updateAddress, deleteAddress, addToWishlist, removeFromWishlist, getWishlist } from '../Controller/UserController.js'


const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/', getAllUsers);
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