const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const { protect } = require('../middleware/auth');

// ==========================================
// 1. GET ALL VERIFIED NGOS (For Donors)
// ==========================================
router.get('/ngos', protect, async (req, res) => {
  try {
    const ngos = await User.find({ role: { $in: ['NGO', 'ngo'] } }).select('-password');
    return res.status(200).json({ success: true, count: ngos.length, data: ngos });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 2. GET CURRENT USER PROFILE
// ==========================================
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 3. UPDATE USER PROFILE
// ==========================================
router.put('/profile', protect, async (req, res) => {
  try {
    // Sirf allowed fields hi update karne denge (security ke liye)
    const { name, contactNumber, address } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, contactNumber, address },
      { new: true, runValidators: true }
    ).select('-password');

    return res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;