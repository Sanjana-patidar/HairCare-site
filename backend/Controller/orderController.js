import nodemailer from "nodemailer";
import { Order } from "../Model/OrderModel.js";
export const placeOrder = async (req, res) => {
  try {
    const { customer, products, totalAmount, paymentMethod } = req.body;

    // validation
    if (!customer || !products || products.length === 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    const newOrder = new Order({
      user: req.user.id, 
      customer,
      products,
      totalAmount,
      paymentMethod,
    });

    await newOrder.save();

    /* ================= EMAIL SETUP ================= */

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // product list html
    const productHTML = products
      .map(
        (item) => `
          <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>₹${item.price}</td>
          </tr>
        `
      )
      .join("");

    const mailHTML = `
      <h2>🎉 Order Placed Successfully</h2>
      <p>Hello <b>${customer.firstname} ${customer.lastname}</b>,</p>

      <p>Your order has been placed successfully.</p>

      <p><b>Order ID:</b> ${newOrder._id}</p>
      <p><b>Payment Method:</b> ${paymentMethod}</p>

      <table border="1" cellpadding="8" cellspacing="0">
        <tr>
          <th>Product</th>
          <th>Qty</th>
          <th>Price</th>
        </tr>
        ${productHTML}
      </table>

      <h3>Total Amount: ₹${totalAmount}</h3>

      <p>Thank you for shopping with us ❤️</p>
    `;

    await transporter.sendMail({
      from: `"HairCare" <${process.env.EMAIL_USER}>`,
      to: customer.email,
      subject: "Your Order Placed Successfully 🎉",
      html: mailHTML,
    });

    /* ================= END EMAIL ================= */

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.log("order error",error)
    res.status(500).json({ message: "Order placement failed" });
  }
};
// GET ALL ORDERS (ADMIN)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

//
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["Pending", "Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid order status" });
  }

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET LOGGED-IN USER ORDERS
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user orders" });
  }
};