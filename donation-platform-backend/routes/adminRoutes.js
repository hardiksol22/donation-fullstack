const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Donation = require('../models/Donation');
const { protect, authorize } = require('../middleware/authMiddleware');

// Apply protection and Admin-only authorization to all routes in this router
router.use(protect);
router.use(authorize('Admin'));

// 1. Fetch all NGOs (Pending and Verified)
router.get('/ngos', async (req, res) => {
  try {
    const { status } = req.query; // Optional: filter by ?status=pending
    const filter = { role: 'NGO' };
    
    if (status === 'pending') {
      filter.isVerified = false;
    } else if (status === 'verified') {
      filter.isVerified = true;
    }

    const ngos = await User.find(filter).select('-password').sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: ngos.length, data: ngos });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 2. Verify or Reject an NGO
router.patch('/ngo/:id/verify', async (req, res) => {
  try {
    const { isVerified } = req.body; // true to approve, false to revoke

    const updatedNgo = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedNgo) {
      return res.status(404).json({ success: false, message: 'NGO not found' });
    }

    return res.status(200).json({ success: true, data: updatedNgo });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

// 3. Platform Overview Statistics (KPIs)
router.get('/stats', async (req, res) => {
  try {
    const totalDonors = await User.countDocuments({ role: 'Donor' });
    const verifiedNgos = await User.countDocuments({ role: 'NGO', isVerified: true });
    const totalDonations = await Donation.countDocuments();
    const completedCollections = await Donation.countDocuments({ status: 'Collected' });

    return res.status(200).json({
      success: true,
      data: {
        totalDonors,
        verifiedNgos,
        totalDonations,
        completedCollections
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;