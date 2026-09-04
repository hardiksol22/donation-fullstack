const express = require('express');
const router = express.Router();
const Dispute = require('../models/Dispute');
const { protect, authorize } = require('../middleware/auth');

// ==========================================
// @desc    Create a new dispute/complaint
// @route   POST /api/disputes
// @access  Private (Donor or NGO)
// ==========================================
router.post('/', protect, async (req, res) => {
  try {
    req.body.raisedBy = req.user._id; // Automatic tag logged-in user
    const dispute = await Dispute.create(req.body);
    res.status(201).json({ success: true, data: dispute });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ==========================================
// @desc    Get all disputes (Admin sees all, Users see their own)
// @route   GET /api/disputes
// @access  Private
// ==========================================
router.get('/', protect, async (req, res) => {
  try {
    let disputes;
    // Check if user is an Admin
    if (req.user.role.toLowerCase() === 'admin') {
      // Admin gets all disputes with user details attached
      disputes = await Dispute.find()
        .populate('raisedBy', 'name email role')
        .sort({ createdAt: -1 });
    } else {
      // Normal users only get their own disputes
      disputes = await Dispute.find({ raisedBy: req.user._id })
        .sort({ createdAt: -1 });
    }
    res.status(200).json({ success: true, count: disputes.length, data: disputes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// @desc    Resolve a dispute
// @route   PATCH /api/disputes/:id/resolve
// @access  Private (Admin Only)
// ==========================================
router.patch('/:id/resolve', protect, authorize('Admin', 'admin'), async (req, res) => {
  try {
    const { adminResponse } = req.body;
    
    const dispute = await Dispute.findByIdAndUpdate(
      req.params.id,
      { status: 'Resolved', adminResponse },
      { new: true, runValidators: true }
    );

    if (!dispute) {
      return res.status(404).json({ success: false, message: 'Dispute not found' });
    }

    res.status(200).json({ success: true, message: 'Dispute resolved successfully', data: dispute });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;