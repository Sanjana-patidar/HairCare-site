import mongoose from "mongoose";

export const connectDB = async () =>{
    try{
       await mongoose.connect(process.env.MONGO_URL);
       console.log("Database connect successfully")
    }
    catch(error){
      console.log("Databases connection error", error)
    }
}