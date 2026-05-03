import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { connectDB } from './Config/db.js'
import router from "./Route/UserRoute.js";
import productRoute from "./Route/productRoute.js";
import contactRoute from './Route/contactRoute.js'
import orderRoute from "./Route/orderRoute.js";
import BrandRoute from "./Route/BrandRoute.js";
import PaymentRoutes from './Route/PaymentRoute.js';
import reviewRoute from './Route/reviewRoute.js';
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./Config/swagger.js";
import bcrypt from "bcrypt";
import path from "path";




const app = express();
app.use(cors());
app.use(express.json());
// swagger documentation path
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/uploads", express.static("uploads"));
// api routes for user
app.use('/api/users', router);
app.use("/api/products", productRoute);
app.use("/api/contact", contactRoute);
app.use("/api/orders", orderRoute);
app.use("/api/brands", BrandRoute);
app.use("/api/payment", PaymentRoutes);
app.use("/api/reviews", reviewRoute);

connectDB();
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log('server running on port', PORT)
  console.log("Swagger docs on http://localhost:5000/api-docs");

})
