const Inventory = require('../models/inventoryModel');


// GET ALL

const getInventory = async (req, res) => {

  try {

    const items = await Inventory.find();

    res.status(200).json(items);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};


// CREATE

const createInventoryItem = async (req, res) => {

  try {

    const item = await Inventory.create(
      req.body
    );

    res.status(201).json(item);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};


// UPDATE

const updateInventoryItem = async (req, res) => {

  try {

    const item =
      await Inventory.findByIdAndUpdate(

        req.params.id,

        req.body,

        { new: true }
      );

    res.status(200).json(item);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};


// DELETE

const deleteInventoryItem = async (req, res) => {

  try {

    await Inventory.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      message: 'Item deleted'
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};


module.exports = {

  getInventory,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem
};