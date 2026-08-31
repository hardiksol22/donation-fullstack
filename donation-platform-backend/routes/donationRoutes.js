const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { 
  createDonation, 
  getMyDonations, 
  getAvailableDonations, 
  updateDonationStatus 
} = require('../controllers/donationController');

// 1. CREATE DONATION (Strictly For Donors)
router.post('/', protect, authorize('Donor', 'donor'), createDonation);

// 2. GET DONOR'S HISTORY (For Donor Impact Dashboard)
router.get('/my-donations', protect, authorize('Donor', 'donor'), getMyDonations);

// 3. GET ACTIVE REQUESTS (For NGO Command Center)
router.get('/available', protect, authorize('NGO', 'ngo', 'Admin', 'admin'), getAvailableDonations);

// 4. UPDATE STATUS / ACCEPT PICKUP (For NGOs & Admins)
router.patch('/:id/status', protect, authorize('NGO', 'ngo', 'Admin', 'admin'), updateDonationStatus);

module.exports = router;