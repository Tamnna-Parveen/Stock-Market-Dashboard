const mongoose = require('mongoose');

const OrdersSchema = new mongoose.Schema({
  name: String,
  qty: Number,
  price: Number,
  mode: String,
  product: String,
  orderType: { type: String, default: 'MARKET' },
  status: { type: String, default: 'EXECUTED' },
  product:String,
  squaredOff: { type: Boolean, default: false },   // ✅ naya field
}, { timestamps: true });

module.exports = OrdersSchema;   // sirf schema export karo, model nahi