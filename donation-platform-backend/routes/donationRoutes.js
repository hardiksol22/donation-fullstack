const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const geocodeAddress = require('../utils/geocode'); 
const sendEmail = require('../utils/sendEmail'); 
const { protect, authorize } = require('../middleware/auth'); 

// ==========================================
// 1. CREATE DONATION (Strictly For Donors)
// ==========================================
router.post('/', protect, authorize('Donor', 'donor'), async (req, res) => {
  try {
    const { title, category, description, quantity, condition, pickupAddress, scheduledTime, imageUrl } = req.body;

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
      donorId: req.user._id, 
      category,
      quantity,
      condition,
      pickupAddress,
      location: coordinates, 
      scheduledTime,
      imageUrl, 
      status: 'Pending', 
    });

    const savedDonation = await donation.save();
    return res.status(201).json({ success: true, data: savedDonation });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

// ==========================================
// 2. GET DONOR'S HISTORY
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
// 3. GET ACTIVE REQUESTS (For NGO)
// ==========================================
router.get('/available', protect, authorize('NGO', 'ngo', 'Admin', 'admin'), async (req, res) => {
  try {
    const donations = await Donation.find({ status: 'Pending' }) 
      .populate('donorId', 'name email contactNumber')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: donations.length, data: donations });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 4. GET IMPACT LEADERBOARD
// ==========================================
router.get('/leaderboard', protect, async (req, res) => {
  try {
    const topDonors = await Donation.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { 
          _id: '$donorId', 
          totalItemsDonated: { $sum: '$quantity' }, 
          donationCount: { $sum: 1 } 
      } },
      { $sort: { totalItemsDonated: -1 } },
      { $limit: 10 },
      { $lookup: { 
          from: 'users', 
          localField: '_id', 
          foreignField: '_id', 
          as: 'donorDetails' 
      } },
      { $unwind: '$donorDetails' },
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
    
    if (status === 'Accepted' || status === 'Scheduled') {
      updateFields.ngoId = req.user._id; 
    }

    const updatedDonation = await Donation.findByIdAndUpdate(id, updateFields, {
      returnDocument: 'after', // 🔥 FIX: Cleaned up the Mongoose warning!
      runValidators: true,
    }).populate('donorId', 'name email contactNumber'); 

    if (!updatedDonation) {
      return res.status(404).json({ success: false, message: 'Donation request not found' });
    }

    if (status === 'Accepted' && updatedDonation.donorId.email) {
      try {
        const emailHTML = `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eaeaea; border-radius: 10px;">
            <h2 style="color: #10b981;">Good News, ${updatedDonation.donorId.name}! 🎉</h2>
            <p>Your donation request for <strong>"${updatedDonation.title}"</strong> has been officially accepted by a verified NGO.</p>
            <p>Their representative will contact you shortly at <strong>${updatedDonation.donorId.contactNumber}</strong> to coordinate the exact pickup time.</p>
            <br>
            <p>Thank you for making a difference in the community!</p>
            <p><strong>- The Platform Team</strong></p>
          </div>
        `;
        
        await sendEmail({
          email: updatedDonation.donorId.email,
          subject: 'Donation Accepted for Pickup! 🚚',
          html: emailHTML
        });
      } catch (emailError) {
        console.error("Email could not be sent:", emailError);
      }
    }

    return res.status(200).json({ success: true, data: updatedDonation });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;