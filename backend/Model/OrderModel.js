import mongoose from "mongoose";
const orderSchema = new mongoose.Schema(
  {
     user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",   
      required: true,
    },

    customer: {
      firstname: { type: String, required: true },
      lastname: { type: String, required: true },
      email:{type:String,required:true},
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, required: true },  
    },

    products: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: {type:String},
      },
    ],

    totalAmount: { type: Number, required: true },

    paymentMethod: {
      type: String,
      enum: ["COD", "Online"],   // ✅ restrict values
      default: "COD",
    },

      paymentId: {
        type: String,   // Razorpay payment id
      },

      razorpayOrderId: {
        type: String,
      },

      paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending",
      },


    status: {
     type: String,
     enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
     },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
