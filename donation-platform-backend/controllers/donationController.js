const Donation = require('../models/Donation');
const geocodeAddress = require('../utils/geocode');

// @desc    Create a new donation request
// @route   POST /api/donations
// @access  Private (Donor only)
const createDonation = async (req, res) => {
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

    const donation = await Donation.create({
      title,
      description,
      category,
      quantity,
      condition,
      pickupAddress,
      location: coordinates,
      scheduledTime,
      status: 'Pending', // 🔥 Synced with Model
      donorId: req.user._id // Secured via JWT middleware
    });

    res.status(201).json({ success: true, data: donation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged-in donor's history
// @route   GET /api/donations/my-donations
// @access  Private (Donor only)
const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donorId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: donations.length, data: donations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all available donations (Pending requests for NGOs)
// @route   GET /api/donations/available
// @access  Private (NGO & Admin)
const getAvailableDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ status: 'Pending' }) // 🔥 Synced with Model
      .populate('donorId', 'name contactNumber')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: donations.length, data: donations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update donation status (Accept or Mark Collected)
// @route   PATCH /api/donations/:id/status
// @access  Private (NGO & Admin)
const updateDonationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updateFields = { status };
    
    // 🔥 Synced with Model: Using 'Accepted' instead of 'Requested'
    if (status === 'Accepted' || status === 'Scheduled') {
      updateFields.ngoId = req.user._id; 
    }

    const updatedDonation = await Donation.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    }).populate('donorId', 'name contactNumber');

    if (!updatedDonation) {
      return res.status(404).json({ success: false, message: 'Donation request not found' });
    }

    res.status(200).json({ success: true, data: updatedDonation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { 
  createDonation, 
  getMyDonations, 
  getAvailableDonations, 
  updateDonationStatus 
};