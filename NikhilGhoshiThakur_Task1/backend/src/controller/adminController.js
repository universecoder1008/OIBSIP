const Order = require('../models/orderModel');
const User = require('../models/userModel');

// ─────────────────────────────────────────────────────────────
// GET USERS
// ─────────────────────────────────────────────────────────────

const getUsers = async (req, res) => {

  try {

    const users = await User.find()

      .select('-password')

      .sort({ createdAt: -1 });

    res.status(200).json(users);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};

// ─────────────────────────────────────────────────────────────
// GET ALL ORDERS
// ─────────────────────────────────────────────────────────────

const getAllOrders = async (req, res) => {

  try {

    const orders = await Order.find()

      .populate('user', 'name email')

      .sort({ createdAt: -1 });

    res.status(200).json({
      orders
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};

// ─────────────────────────────────────────────────────────────
// UPDATE ORDER STATUS
// ─────────────────────────────────────────────────────────────

const updateOrderStatus = async (req, res) => {

  try {

    const { status } = req.body;

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {

      return res.status(404).json({
        message: "Order not found"
      });
    }

    order.status = status;

    await order.save();

    global.io.emit(

      'order-status-update',

      {
        orderId: order._id,
        status: order.status
      }
    );

    res.status(200).json({
      message: "Order status updated",
      order
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};

// ─────────────────────────────────────────────────────────────
// GET ANALYTICS
// ─────────────────────────────────────────────────────────────

const getAnalytics = async (
  req,
  res
) => {

  try {

    // TOTAL ORDERS
    const totalOrders =
      await Order.countDocuments();

    // TOTAL USERS
    const totalUsers =
      await User.countDocuments();

    // TOTAL REVENUE
    const totalRevenue =
      await Order.aggregate([

        {
          $group: {

            _id: null,

            total: {
              $sum: '$totalPrice'
            }
          }
        }

      ]);

    // PENDING ORDERS
    const pendingOrders =
      await Order.countDocuments({

        status: {
          $ne: 'Delivered'
        }
      });

    // AVERAGE ORDER VALUE
    const avgOrderValue =
      totalOrders > 0

        ? (totalRevenue[0]?.total || 0)
          / totalOrders

        : 0;

    // MONTHLY REVENUE
    const monthlyRevenue =
      await Order.aggregate([

        {
          $group: {

            _id: {

              month: {
                $month: '$createdAt'
              }
            },

            revenue: {
              $sum: '$totalPrice'
            },

            orders: {
              $sum: 1
            }
          }
        },

        {
          $sort: {
            '_id.month': 1
          }
        }

      ]);

    // MONTH NAMES
    const months = [

      '',
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];

    // FORMATTED MONTHLY DATA
    const formattedMonthlyRevenue =

      monthlyRevenue.map(item => ({

        month:
          months[item._id.month],

        revenue:
          item.revenue,

        orders:
          item.orders
      }));

      const topSellingPizzas =
  await Order.aggregate([
    {
      $unwind: '$items'
    },

    {
      $group: {
        _id: '$items.pizza',

        orders: {
          $sum: '$items.quantity'
        }
      }
    },

    {
      $sort: {
        orders: -1
      }
    },

    {
      $limit: 5
    },

    {
      $project: {
        _id: 0,
        name: '$_id',
        orders: 1
      }
    }
  ]);

    // RESPONSE
    res.status(200).json({

      totalOrders,

      totalUsers,

      totalRevenue:
        totalRevenue[0]?.total || 0,

      pendingOrders,

      avgOrderValue,

      monthlyRevenue:
        formattedMonthlyRevenue,
        
      topSellingPizzas
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {

  getAllOrders,

  updateOrderStatus,

  getAnalytics,

  getUsers
};