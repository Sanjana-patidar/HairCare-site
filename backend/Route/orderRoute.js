import express from "express";
import { placeOrder,getAllOrders,updateOrderStatus,getMyOrders} from "../Controller/orderController.js";
import authMiddleware from "../Middleware/Authmiddleware.js"; 
import adminMiddleware from "../Middleware/Adminmiddleware.js";
const router = express.Router();

router.post("/place",authMiddleware, placeOrder);
router.get("/orderhistory", authMiddleware, adminMiddleware, getAllOrders);
router.patch("/:id/status",authMiddleware,  adminMiddleware, updateOrderStatus);
// user order history   
router.get("/myorders", authMiddleware, getMyOrders);

export default router;
