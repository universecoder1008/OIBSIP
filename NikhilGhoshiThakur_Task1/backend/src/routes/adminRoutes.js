const express = require('express');

const router = express.Router();

const {

    getAllOrders,
    updateOrderStatus,
    getAnalytics,
    getUsers

} = require('../controller/adminController');

const { protect } = require('../middleware/authMiddleware');

const { admin } = require('../middleware/adminMiddleware');

const { getInventory, deleteInventoryItem, updateInventoryItem, createInventoryItem } = require('../controller/inventoryController')



router.get(

  '/users',

  protect,
  admin,

  getUsers
);
// GET ALL ORDERS

router.get(

    '/orders',

    protect,
    admin,

    getAllOrders
);

router.get(

  '/analytics',

  protect,
  admin,

  getAnalytics
);


// UPDATE ORDER STATUS

router.put(

    '/orders/:id',

    protect,
    admin,

    updateOrderStatus
);

router.get(
  '/inventory',
  protect,
  admin,
  getInventory
);

router.post(
  '/inventory',
  protect,
  admin,
  createInventoryItem
);

router.put(
  '/inventory/:id',
  protect,
  admin,
  updateInventoryItem
);

router.delete(
  '/inventory/:id',
  protect,
  admin,
  deleteInventoryItem
);


module.exports = router;