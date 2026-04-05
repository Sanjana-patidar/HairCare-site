import Razorpay from "razorpay";
import crypto from "crypto";
import { Order } from "../Model/OrderModel.js";



// ✅ 1. Create Razorpay Order
export const createRazorpayOrder = async (req, res) => {
  try {
     const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100, // convert ₹ to paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error creating Razorpay order" });
  }
};

// ✅ 2. Verify Payment & Save Order
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
  return res.status(400).json({
    message: "Payment verification failed",
  });
}

    // ✅ Save order AFTER payment success
   const newOrder = new Order({
  user: req.user.id,
  ...orderData,
  paymentMethod: "Online",
   paymentStatus: "Paid", 
  paymentId: razorpay_payment_id,
  razorpayOrderId: razorpay_order_id,
});
    await newOrder.save();

    res.json({ success: true, message: "Payment successful & order saved" });
  } catch (error) {
    res.status(500).json({ message: "Verification error" });
  }
};