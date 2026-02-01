import express from "express";
import authMiddleware from "../Middleware/authMiddleware.js";
import adminMiddleware from "../Middleware/Adminmiddleware.js";
import {signup, login, getAllUsers,deleteUser} from '../Controller/UserController.js'


const router = express.Router();
 
router.post('/signup', signup);
router.post('/login', login);
router.get('/', getAllUsers);
router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteUser);

export default router;