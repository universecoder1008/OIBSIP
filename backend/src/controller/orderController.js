const Order = require('../models/orderModel')
const Cart = require('../models/cartModel')
const Inventory = require('../models/inventoryModel');
const sendLowStockEmail =
  require(
    '../utils/sendLowStockEmail'
  );



  const placeOrder = async (req, res) => {

    

    try {

      

      const {
        items,
        totalPrice,
        address
      } = req.body;

      // CREATE ORDER
      const order = await Order.create({

        user: req.user.id,

        items,

        totalPrice,

        address
      });

      // INVENTORY DEDUCTION + LOW STOCK ALERTS
      for (const item of items) {

        console.log("FULL ORDER ITEM:", item);
  console.log("BASE VALUE:", item.base);
const updatedBase =
  await Inventory.findOneAndUpdate(

    { name: item.base },

    { $inc: { stock: -1 } },

    { returnDocument: "after" }
  );


console.log("BASE:", updatedBase);


if (
  updatedBase &&
  updatedBase.stock <= updatedBase.threshold
) {

  console.log(
    "LOW BASE STOCK EMAIL",
    updatedBase.name
  );

  await sendLowStockEmail(
    updatedBase
  );
}
        // SAUCE
        const updatedSauce =
          await Inventory.findOneAndUpdate(

            { name: item.sauce },

            { $inc: { stock: -1 } },

          { returnDocument:"after" }
          );

        if (
          updatedSauce &&
          updatedSauce.stock <= updatedSauce.threshold
        ) {

          await sendLowStockEmail(
            updatedSauce
          );
        }

        // CHEESE
        const updatedCheese =
          await Inventory.findOneAndUpdate(

            { name: item.cheese },

            { $inc: { stock: -1 } },

           { returnDocument:"after" }
          );

        if (
          updatedCheese &&
          updatedCheese.stock <= updatedCheese.threshold
        ) {

          await sendLowStockEmail(
            updatedCheese
          );
        }

        // VEGGIES
        for (const veg of item.veggies) {

          const updatedVeg =
            await Inventory.findOneAndUpdate(

              { name: veg },

              { $inc: { stock: -1 } },

             { returnDocument:"after" }
            );

          if (
            updatedVeg &&
            updatedVeg.stock <= updatedVeg.threshold
          ) {

            await sendLowStockEmail(
              updatedVeg
            );
          }
        }
      }

      res.status(201).json(order);

    } catch (error) {

      

      res.status(500).json({
        message: error.message
      });
    }
  };

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id
    });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


const getOrderById = async(req,res)=>{
    try {
        const order = await Order.findById(
        req.params.id
    )

    if(!order){
        return res.status(404).json({
            message:"Order not found"
        })
    }

    if(order.user.toString()!=req.user.id){
        return res.status(401).json({
            message:"not authorized"
        })
    }

    res.status(200).json(order)
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
}
const updateOrderStatus = async (req, res) => {

  try {

    const { status } = req.body;

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {

      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.status = status;

    await order.save();

    global.io.emit(

  'orderStatusUpdated',

  {

    orderId: order._id,

    status: order.status
  }
);

    res.status(200).json({

      message: "Order status updated",

      order,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {

    placeOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus
};