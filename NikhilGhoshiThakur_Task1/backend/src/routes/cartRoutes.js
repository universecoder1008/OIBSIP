const express = require('express')

const router = express.Router();

const {

    addToCart,
    getCart,
    removeFromCart
}=require('../controller/cartController');

const {protect} = require('../middleware/authMiddleware')

router.post('/',protect,addToCart)

router.get('/',protect,getCart)

router.delete('/:id',protect,removeFromCart)

module.exports = router