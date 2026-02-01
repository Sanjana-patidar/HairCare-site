import mongoose from "mongoose";

export const connectDB = async () =>{
    try{
       await mongoose.connect(process.env.MONGO_URL);
       console.log("Mongoodb Atlas database connect successfully")
    }
    catch(error){
      console.log("Databases connection error", error)
    }
}