// server/models/product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  currency: { type: String, enum: ['USD', 'EUR', 'MAD'], default: 'MAD' },
  category: String,
  image: String,
  stock: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);