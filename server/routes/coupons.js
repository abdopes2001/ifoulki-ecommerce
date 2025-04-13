const express = require('express');
const router = express.Router();
const Coupon = require('../models/coupon');

// Get all coupons
router.get('/', async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new coupon
router.post('/', async (req, res) => {
  const { code, type, value, expires } = req.body;
  try {
    const coupon = new Coupon({ code, type, value, expires });
    const saved = await coupon.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Validate a coupon
router.post('/validate', async (req, res) => {
  const { code } = req.body;
  try {
    const coupon = await Coupon.findOne({ code });
    if (!coupon) return res.status(404).json({ message: 'Invalid coupon code' });
    if (coupon.expires && new Date() > coupon.expires) {
      return res.status(400).json({ message: 'Coupon expired' });
    }
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a coupon
router.delete('/:id', async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coupon deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
