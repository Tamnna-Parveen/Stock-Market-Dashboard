const mongoose = require('mongoose');

const FundsSchema = new mongoose.Schema({
  balance: { type: Number, default: 100000 },   // starting balance ₹1,00,000
}, { timestamps: true });

module.exports = FundsSchema;
