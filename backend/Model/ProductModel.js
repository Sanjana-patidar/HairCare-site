import mongoose from "mongoose"

 const productSchema = new mongoose.Schema({
    name:{type:String, required:true},
    description:{type:String, required: true},
    price :{type:Number, required:true},
    discountprice:{type:Number, required:true},
    discountpercentage:{type:Number},
    rating:{type:Number, default:0},
    stock:{type:Number, required:true},
    category: {
    type: String,
    enum: ["shampoo", "conditioner", "serum", "oil"],
    required: true
  },
  image:{
    type:String,
    required:true
  },
  status: {
  type: String,
  enum: ["active", "inactive", "outofstock"],
  default: "active"
}

 })

 export const productModel = mongoose.model("product", productSchema);
