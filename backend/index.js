
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import {connectDB} from './Config/db.js'
import router from "./Route/UserRoute.js";
import productRoute from "./Route/productRoute.js";
import contactRoute from './Route/contactRoute.js'
import orderRoute from "./Route/orderRoute.js";
import BrandRoute from "./Route/BrandRoute.js";
import path from "path";
dotenv.config();

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
connectDB();
const PORT = process.env.PORT;
app.listen(PORT, () =>{
    console.log('server running on port', PORT);

})
