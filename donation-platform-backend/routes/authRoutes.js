const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const geocodeAddress = require('../utils/geocode'); 

// 🛡️ Import our Advanced Security Middleware
const { protect, authorize } = require('../middleware/auth'); 

// ==========================================
// 1. CREATE DONATION (Strictly For Donors)
// ==========================================
router.post('/', protect, authorize('Donor', 'donor'), async (req, res) => {
  try {
    // ⚠️ Security Fix: We no longer trust 'donorId' from req.body. 
    // We pull it securely from the verified JWT token (req.user._id).
    const { title, category, description, quantity, condition, pickupAddress, scheduledTime } = req.body;

    // Convert address to coordinates before saving
    let coordinates = { type: 'Point', coordinates: [0, 0] };
    if (pickupAddress) {
      try {
        coordinates = await geocodeAddress(pickupAddress);
      } catch (geoErr) {
        console.error("Geocoding warning:", geoErr.message);
      }
    }

    const donation = new Donation({
      title,
      description,
      donorId: req.user._id, // Highly secure mapping
      category,
      quantity,
      condition,
      pickupAddress,
      location: coordinates, 
      scheduledTime,
      status: 'Available', // Matches our React frontend state
    });

    const savedDonation = await donation.save();
    return res.status(201).json({ success: true, data: savedDonation });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

// ==========================================
// 2. GET DONOR'S HISTORY (For Donor Impact Dashboard)
// ==========================================
router.get('/my-donations', protect, authorize('Donor', 'donor'), async (req, res) => {
  try {
    // Automatically fetches ONLY the donations belonging to the logged-in user
    const donations = await Donation.find({ donorId: req.user._id }).sort({ createdAt: -1 });
    
    return res.status(200).json({ success: true, count: donations.length, data: donations });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 3. GET ACTIVE REQUESTS (For NGO Command Center)
// ==========================================
router.get('/available', protect, authorize('NGO', 'ngo', 'Admin', 'admin'), async (req, res) => {
  try {
    // Fetch only available donations for NGOs to accept
    const donations = await Donation.find({ status: 'Available' })
      .populate('donorId', 'name email contactNumber')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: donations.length, data: donations });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 4. UPDATE STATUS / ACCEPT PICKUP (For NGOs)
// ==========================================
router.patch('/:id/status', protect, authorize('NGO', 'ngo', 'Admin', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updateFields = { status };
    
    // If an NGO is accepting the request, tie their secure user ID to this donation
    if (status === 'Requested' || status === 'Accepted') {
      updateFields.ngoId = req.user._id; 
    }

    const updatedDonation = await Donation.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    }).populate('donorId', 'name contactNumber');

    if (!updatedDonation) {
      return res.status(404).json({ success: false, message: 'Donation request not found' });
    }

    return res.status(200).json({ success: true, data: updatedDonation });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;