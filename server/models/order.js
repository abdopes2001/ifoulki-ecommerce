// server/models/order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  customer: {
    name: String,
    email: String,
    address: String,
    phone: String
  },
  total: Number,
  paymentMethod: { type: String, enum: ['Cash on Delivery', 'Mock Payment'], default: 'Cash on Delivery' },
  currency: String
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);