const express = require('express');
const router = express.Router();
const User = require('../models/User'); // ⚠️ Yeh zaroori hai taaki User.findById chal sake
const { protect } = require('../middleware/auth');

// ==========================================
// (Agar aapke REGISTER aur LOGIN routes the, toh unhe yahan rakhna mat bhoolna)
// ==========================================

// ==========================================
// 3. GET REAL USER PROFILE (Real DB Fetch)
// ==========================================
router.get('/profile', protect, async (req, res) => {
  try {
    // Fetch the real user from MongoDB using their secure JWT token
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 4. UPDATE USER PROFILE (Real DB Update)
// ==========================================
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, contactNumber, address } = req.body;
    
    // Update real details in MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, contactNumber, address },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;