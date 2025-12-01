import express from "express"
import upload from "../middleware/upload.js";
import {addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct} from '../Controller/productController.js'


  const router  = express.Router();
  router.post("/add", upload.single("image"), addProduct); 
  router.get("/all", getAllProducts);
  router.get("/:id", getProductById);
  router.put("/update/:id", upload.single("image"), updateProduct);  // image optional
  router.delete("/delete/:id", deleteProduct);            


export default router;