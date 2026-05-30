const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const protect = async(req,res,next)=>{
    try {
        
        const token = req.cookies.token

        if(!token){
            return res.status(401).json({
                error:"unauthorized"
            })
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

          req.user = await User.findById(decoded.id)

            .select('-password');
        next()
    } catch (error) {
         return res.status(401).json({
            error: "Invalid token"
        });
    }
}

module.exports = {protect}