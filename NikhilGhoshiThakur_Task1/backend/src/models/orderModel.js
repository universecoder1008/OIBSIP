const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:false,
        default:null
    },

    items:[{

    pizza:{
        type:String
    },

    quantity:Number,

    size:String,

    base:String,

    sauce:String,

    cheese:String,

    veggies:[String]

}],

    totalPrice:{
        type:Number,
        required:true
    },

    status: {
  type: String,

  enum: [
  'Order Received',
  'In Kitchen',
  'Preparing',
  'Out for Delivery',
  'Delivered',
],

  default: "Order Received",
},

    address:{
        type:String,
        required:true
    },

},{ timestamps:true
})

module.exports = mongoose.model("Order",orderSchema)