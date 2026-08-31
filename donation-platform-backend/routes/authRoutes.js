const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ==========================================
// TOKEN GENERATOR
// ==========================================
const generateToken = (id) => {
  // Using the same secret we check in our auth middleware
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_daansetu_2026', { 
    expiresIn: '30d' 
  });
};

// ==========================================
// 1. REGISTER ROUTE
// ==========================================
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, organizationName, contactNumber } = req.body;
    
    // Check if user already exists
    if (await User.findOne({ email })) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // Hash the password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user
    const user = await User.create({
      name, 
      email, 
      password: hashedPassword, 
      role: role || 'Donor',
      organizationName, 
      contactNumber,
      isVerified: role !== 'NGO' // Donors are auto-verified, NGOs need admin approval
    });

    // Send response with Token
    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: { _id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 2. LOGIN ROUTE (The one causing the 404!)
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });

    // Compare provided password with hashed password in DB
    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        success: true,
        token: generateToken(user._id),
        user: { _id: user.id, name: user.name, email: user.email, role: user.role }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router; // Make sure it is exported!