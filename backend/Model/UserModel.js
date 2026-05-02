import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{type:String, required:true},
    email: {type: String, required:true, unique:true},
    password: {type:String, required:true },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    phone: { type: String, default: "" },
    gender: { type: String, enum: ["Male", "Female", "Other"], default: "Male" },
    dob: { type: String, default: "" }, // using string for easier mm/dd/yyyy management on frontend
    addresses: [
      {
        name: { type: String, required: true },
        phoneNo: { type: String, required: true },
        addressType: { type: String, enum: ["Home", "Business", "Other"], default: "Home" },
        address: { type: String, required: true },
        pincode: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, default: "India" }
      }
    ],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }]
},
 { timestamps: true }
);

export const UserModel = mongoose.model("Users", userSchema);   