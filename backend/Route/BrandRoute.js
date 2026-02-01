import express from 'express';
import authMiddleware from "../Middleware/Authmiddleware.js"; 
import adminMiddleware from "../Middleware/Adminmiddleware.js";
import upload from "../middleware/upload.js";
import { createBrand, getAllBrands, deleteBrand } from '../Controller/BrandController.js';

const router = express.Router();

router.post('/add', authMiddleware,adminMiddleware,upload.single("logo"), createBrand);
router.get('/',  getAllBrands);
router.delete('/:id',authMiddleware,adminMiddleware, deleteBrand); 
export default router;