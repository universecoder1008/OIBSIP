const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true
    },

    password:{
        type:String,
        required:true
    },

    phone:{
        type:String
    },

    address:{

        street:{
            type:String
        },

        city:{
            type:String
        },

        pinCode:{
            type:String
        }
    },

    isAdmin:{
        type:Boolean,
        default:false
    },

    isVerified:{
        type:Boolean,
        default:false
    },

    resetPasswordToken:{
        type:String
    },

    resetPasswordExpire:{
        type:Date
    },

    verificationToken:String,

    verificationTokenExpire:Date

},
{timestamps:true});


module.exports = mongoose.model("User", userSchema);