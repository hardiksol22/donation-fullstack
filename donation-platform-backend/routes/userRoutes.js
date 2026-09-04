const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Ensure path to User model is correct
const { protect } = require('../middleware/auth');

// ==========================================
// GET ALL VERIFIED NGOS (For Donors)
// ==========================================
router.get('/ngos', protect, async (req, res) => {
  try {
    // Sirf NGO role wale users ko find karo, par unka password hide kar do
    const ngos = await User.find({ role: { $in: ['NGO', 'ngo'] } }).select('-password');
    return res.status(200).json({ success: true, count: ngos.length, data: ngos });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;