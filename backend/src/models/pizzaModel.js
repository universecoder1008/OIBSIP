const mongoose = require('mongoose');

const pizzaSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    description:{
        type:String,
        required:true
    },

    image:{
        type:String,
        required:true
    },

    sizes:{
        type:[String],
        default:["small","medium","large"]
    },

    price : {
        type:Number,
        required:true
    },

    isVeg:{
        type: Boolean,
        default:false
    },

},{

    timestamps:true


});

module.exports = mongoose.model("Pizza",pizzaSchema)