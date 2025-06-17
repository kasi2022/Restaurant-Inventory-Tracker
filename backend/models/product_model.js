const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  unit: { type: String, required: true }, // kg, litre, etc.
  quantity: { type: Number, required: true },
  reorderThreshold: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('products', itemSchema);
