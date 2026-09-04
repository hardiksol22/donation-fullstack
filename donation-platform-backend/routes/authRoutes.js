const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
const { protect } = require('../middleware/auth');

// Helper Function: Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// ==========================================
// 1. REGISTER NEW USER (With Admin Unique ID Support)
// ==========================================
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, organizationName, contactNumber, adminUniqueId } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    let finalRole = role || 'Donor';
    let isVerified = true;

    // 🔥 Admin Unique ID validation
    if (adminUniqueId) {
      if (adminUniqueId === 'DAANSETU_ADMIN_777') {
        finalRole = 'Admin';
        isVerified = true;
      } else {
        return res.status(400).json({ success: false, message: 'Invalid Admin Unique ID' });
      }
    } else if (finalRole.toLowerCase() === 'ngo') {
      isVerified = false; // NGOs require admin verification by default
    }

    // Create new user in DB
    const user = await User.create({ 
      name, 
      email, 
      password, 
      role: finalRole, 
      organizationName, 
      contactNumber, 
      isVerified 
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 2. LOGIN USER
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and explicitly select password (since it's usually hidden)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid Email or Password' });
    }

    // Smart Password Check: Uses schema method if exists, else falls back to bcrypt
    let isMatch = false;
    if (typeof user.matchPassword === 'function') {
      isMatch = await user.matchPassword(password);
    } else {
      const bcrypt = require('bcryptjs');
      isMatch = await bcrypt.compare(password, user.password);
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid Email or Password' });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 3. GET REAL USER PROFILE
// ==========================================
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// 4. UPDATE USER PROFILE
// ==========================================
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, contactNumber, address } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, contactNumber, address },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;