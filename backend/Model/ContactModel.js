import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema({
    firstname: {type:String, required:true},
    lastname: {type: String, required:true},
    email: {type:String, required:true},
    contactnumber:{type:Number,required:true},
    address:{type:String,required:true},
},
{ timestamps: true },
)
export const contactModel = mongoose.model("contact",contactSchema);