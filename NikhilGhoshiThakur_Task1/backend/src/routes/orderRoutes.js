const express = require('express')

const router = express.Router();

const {
    placeOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus
} = require('../controller/orderController')

const {protect} = require('../middleware/authMiddleware')
const {admin} = require('../middleware/adminMiddleware')

router.post('/',protect,placeOrder)

router.get('/',protect,getUserOrders)

router.get('/:id',protect,getOrderById)

router.put(
  "/orders/:id",protect,admin,updateOrderStatus);

module.exports = router