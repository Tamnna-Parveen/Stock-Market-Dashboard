const mongoose = require('mongoose');

const GTTSchema = new mongoose.Schema({
  name: String,               // stock name
  qty: Number,
  mode: String,                // 'BUY' or 'SELL'
  triggerPrice: Number,        // jis price par trigger hoga
  orderPrice: Number,          // trigger hone par order kis price par place hoga
  product: { type: String, default: 'CNC' },
  status: { type: String, default: 'ACTIVE' },   // ACTIVE, TRIGGERED, CANCELLED
}, { timestamps: true });

module.exports = GTTSchema;
