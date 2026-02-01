import mongoose from 'mongoose'

const brandSchema = new mongoose.Schema({
    name :{type: String, required: true},
    logo:{type: String, required: true},
    description:{type: String, required: true}
},
{timestamps: true}
)

export default mongoose.model("Brand", brandSchema);