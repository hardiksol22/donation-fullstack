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
      donorId: req.user._id, // Secure mapping from JWT
      category,
      quantity,
      condition,
      pickupAddress,
      location: coordinates, 
      scheduledTime,
      status: 'Available',
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
    const donations = await Donation.find({ status: 'Available' })
      .populate('donorId', 'name email contactNumber')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: donations.length, data: donations });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 4. GET IMPACT LEADERBOARD (Real Aggregation)
// ⚠️ CRITICAL: Kept ABOVE the /:id route below
// ==========================================
router.get('/leaderboard', protect, async (req, res) => {
  try {
    const topDonors = await Donation.aggregate([
      // 1. Sirf valid donations count karein
      { $match: { status: { $ne: 'Cancelled' } } },
      
      // 2. Har Donor ke total items aur frequency group karein
      { $group: { 
          _id: '$donorId', 
          totalItemsDonated: { $sum: '$quantity' }, 
          donationCount: { $sum: 1 } 
      } },
      
      // 3. Sabse zyada items donate karne walon ko top par rakhein
      { $sort: { totalItemsDonated: -1 } },
      
      // 4. Sirf top 10 heroes ko dikhayen
      { $limit: 10 },
      
      // 5. Users collection se unka real naam (name) fetch karein
      { $lookup: { 
          from: 'users', 
          localField: '_id', 
          foreignField: '_id', 
          as: 'donorDetails' 
      } },
      { $unwind: '$donorDetails' },
      
      // 6. Final JSON structure jo frontend par jayega
      { $project: { 
          _id: 1, 
          name: '$donorDetails.name', 
          totalItemsDonated: 1, 
          donationCount: 1 
      } }
    ]);

    return res.status(200).json({ success: true, data: topDonors });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 5. UPDATE STATUS / ACCEPT PICKUP (For NGOs)
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