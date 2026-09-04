const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Donation = require('../models/Donation');

// ==========================================
// @desc    Get complete platform statistics
// @route   GET /api/admin/stats
// @access  Private (Admin Only)
// ==========================================
router.get('/stats', protect, authorize('Admin', 'admin'), async (req, res) => {
  try {
    const totalDonors = await User.countDocuments({ role: { $regex: /^donor$/i } });
    const totalNGOs = await User.countDocuments({ role: { $regex: /^ngo$/i } });
    
    // Fetch NGOs that are not yet verified
    const pendingNGOs = await User.find({ role: { $regex: /^ngo$/i }, isVerified: false }).select('-password');
    
    const totalDonations = await Donation.countDocuments();
    const completedPickups = await Donation.countDocuments({ status: 'Completed' });

    res.status(200).json({
      success: true,
      data: {
        users: { totalDonors, totalNGOs },
        donations: { totalDonations, completedPickups },
        pendingNGOs
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// @desc    Verify an NGO
// @route   PATCH /api/admin/verify-ngo/:id
// @access  Private (Admin Only)
// ==========================================
router.patch('/verify-ngo/:id', protect, authorize('Admin', 'admin'), async (req, res) => {
  try {
    const ngo = await User.findByIdAndUpdate(
      req.params.id, 
      { isVerified: true }, 
      { new: true }
    ).select('-password');

    if (!ngo) {
      return res.status(404).json({ success: false, message: 'NGO not found' });
    }

    res.status(200).json({ success: true, message: 'NGO Verified Successfully', data: ngo });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;