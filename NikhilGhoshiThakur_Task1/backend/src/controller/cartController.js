const Cart = require('../models/cartModel');

const addToCart = async(req,res)=>{
    try {
       const {pizzaId,quantity,size} = req.body
       
       const existingItem = await Cart.findOne({
        user:req.user.id,
        pizza: pizzaId,
        size: size
       })

       if(existingItem){
        existingItem.quantity +=quantity

        await existingItem.save()

        return res.status(200).json(existingItem)
       }

       const cartItem = await Cart.create({
        user:req.user.id,
        pizza: pizzaId,
        quantity,
        size
       })

       res.status(201).json(cartItem)

    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

const getCart = async (req,res) => {
    try {
        const cartItems = await Cart.find({
            user: req.user.id,
        }).populate('pizza');

        res.status(200).json(cartItems)
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

const removeFromCart = async (req,res) => {
    try {
        
        const cartItem = await Cart.findById(req.params.id)

        if(!cartItem){
            return res.status(404).json({
                message:"pizza not found in cart"
            })
        }

        await cartItem.deleteOne();

         res.status(200).json({
            message: "Item removed from cart"
        });



    } catch (error) {
         res.status(500).json({
            message:error.message
        })
    }
}

module.exports = {

    addToCart,
    getCart,
    removeFromCart
};

