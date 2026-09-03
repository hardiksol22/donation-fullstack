const Donation = require('../models/Donation');
const geocodeAddress = require('../utils/geocode');

// @desc    Create a new donation request
// @route   POST /api/donations
// @access  Private (Donor only)
const createDonation = async (req, res) => {
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

    const donation = await Donation.create({
      title,
      description,
      category,
      quantity,
      condition,
      pickupAddress,
      location: coordinates,
      scheduledTime,
      imageUrl, 
      status: 'Pending', 
      donorId: req.user._id 
    });

    res.status(201).json({ success: true, data: donation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donorId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: donations.length, data: donations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAvailableDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ status: 'Pending' }) 
      .populate('donorId', 'name contactNumber')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: donations.length, data: donations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateDonationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updateFields = { status };
    
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