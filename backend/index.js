import dotenv from "dotenv";
dotenv.config();
import express from "express";

import cors from "cors";
import {connectDB} from './Config/db.js'
import router from "./Route/UserRoute.js";
import productRoute from "./Route/productRoute.js";
import contactRoute from './Route/contactRoute.js'
import orderRoute from "./Route/orderRoute.js";
import BrandRoute from "./Route/BrandRoute.js";
import PaymentRoutes from './Route/PaymentRoute.js';
import bcrypt from "bcrypt";
import path from "path";




const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
// api routes for user
app.use('/api/users', router);
app.use("/api/products", productRoute);
app.use("/api/contact", contactRoute);
app.use("/api/orders", orderRoute);
app.use("/api/brands", BrandRoute);
app.use("/api/payment", PaymentRoutes);
//generate hash for password
async function generateHash() {
  const password = "admin@123";
  const hash = await bcrypt.hash(password, 10);
  console.log(hash);
}

generateHash();
connectDB();
const PORT = process.env.PORT;
app.listen(PORT, () =>{
    console.log('server running on port', PORT);

})
