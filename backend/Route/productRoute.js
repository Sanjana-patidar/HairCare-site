import express from "express"
import upload from "../middleware/upload.js";
import authMiddleware from "../Middleware/Authmiddleware.js"; 
import adminMiddleware from "../Middleware/Adminmiddleware.js";
import {addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateProductStatus,
  getProductsByCategory
} from '../Controller/productController.js'
  const router  = express.Router();
  router.post("/add", upload.single("image"),authMiddleware,adminMiddleware, addProduct); 
  router.get("/all", getAllProducts);
  router.get("/:id", getProductById);
  router.get("/category/:category", getProductsByCategory);
  router.put("/update/:id", upload.single("image"),authMiddleware,adminMiddleware, updateProduct);  // image optional
  router.delete("/delete/:id",authMiddleware,adminMiddleware, deleteProduct);            
  router.patch("/status/:id",authMiddleware,adminMiddleware, updateProductStatus);

export default router;