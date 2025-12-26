import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required : true,
    },
    clerkId : {
        type : String,
        required : true,
    },
    clerkId : {
        type : String,
        required : true,
    },
    orderItems : [orderItemSchema],
})