// routes/donationRoutes.js
const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const geocodeAddress = require('../utils/geocode'); // Added geocoding utility

// 1. Create a new donation request (Donor)
router.post('/', async (req, res) => {
  try {
    const { donorId, category, quantity, condition, pickupAddress, scheduledTime, ngoId } = req.body;

    // Convert address to coordinates before saving
    const coordinates = await geocodeAddress(pickupAddress);

    const donation = new Donation({
      donorId,
      category,
      quantity,
      condition,
      pickupAddress,
      location: coordinates, // Save generated coordinates mapping to the new schema
      scheduledTime,
      ngoId: ngoId || null,
      status: 'Pending',
    });

    const savedDonation = await donation.save();
    return res.status(201).json({ success: true, data: savedDonation });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

// 2. Fetch all active donation requests (NGO/Admin Dashboard)
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const donations = await Donation.find(filter)
      .populate('donorId', 'name email contactNumber')
      .populate('ngoId', 'organizationName email')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: donations.length, data: donations });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 3. Update donation status (Accept or Mark Collected)
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, ngoId } = req.body;

    const updateFields = { status };
    if (ngoId) updateFields.ngoId = ngoId;

    const updatedDonation = await Donation.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedDonation) {
      return res.status(404).json({ success: false, message: 'Donation request not found' });
    }

    return res.status(200).json({ success: true, data: updatedDonation });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;