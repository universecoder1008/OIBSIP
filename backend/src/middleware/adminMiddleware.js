

const admin = async(req,res,next)=>{
    
    
    
    
    if(req.user&&req.user.isAdmin){
        next()
    }
    else{
        res.status(401).json({
            message:"Admin access only"
        })
    }
}

module.exports = {admin};