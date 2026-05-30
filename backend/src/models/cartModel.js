const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
    },
    pizza:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Pizza",
        required:true
    },
    quantity:{
        type:Number,
        default:1
    },
    size:{
        type:String,
        default:"medium"
    }
},{
    timestamps:true
})

module.exports = mongoose.model("Cart",cartSchema);