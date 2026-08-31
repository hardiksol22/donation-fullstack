// ==========================================
// 5. GET IMPACT LEADERBOARD (Real Aggregation)
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