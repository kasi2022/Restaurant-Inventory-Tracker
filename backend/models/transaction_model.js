const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  productName: String,
  quantityUsed: Number,
  unit: String,
  consumer: String,
  createdAt: { type: Date, default: Date.now },
  createdBy: String, // optional: admin name
});

module.exports = mongoose.model('Transaction', transactionSchema);
