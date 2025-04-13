// server/models/setting.js
const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  storeName: String,
  logoUrl: String,
  bannerUrl: String,
  currencies: [String],
  socialLinks: {
    instagram: String,
    facebook: String,
    whatsapp: String
  },
  defaultCurrency: { type: String, default: 'MAD' },
  language: { type: String, default: 'en' }
});

module.exports = mongoose.model('Setting', settingSchema);