const Item = require('../models/product_model');

const addproduct = async (req, res) => {
  try {
    const { name, unit, quantity, reorderThreshold } = req.body;

    const existingItem = await Item.findOne({ name: name.trim() });
    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: "Product already exists",
      });
    }

    // Create and save new product
    const newItem = new Item({ name, unit, quantity, reorderThreshold });
    await newItem.save();

    res.status(201).json({
      success: true,
      message: "Product added",
      item: newItem,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

const getproduct = async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const editproduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItem = await Item.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedItem) return res.status(404).json({ success: false, message: "Item not found" });
    res.status(200).json({ success: true, message: "Product updated", item: updatedItem });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const deleteproduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Item.findByIdAndDelete(id);
    if (!deletedItem) return res.status(404).json({ success: false, message: "Item not found" });
    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
// Consumer 
const Consumer = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (typeof quantity !== 'number' || quantity < 0) {
            return res.status(400).json({ success: false, message: "Invalid quantity value" });
        }

        const updatedItem = await Item.findByIdAndUpdate(
            id,
            { quantity },
            { new: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        res.status(200).json({
            success: true,
            message: "Quantity updated successfully",
            item: updatedItem
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};


module.exports = { addproduct, getproduct, editproduct, deleteproduct,Consumer };
