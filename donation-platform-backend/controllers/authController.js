const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Token Generate Function
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'daansetu_secret_123', {
    expiresIn: '30d',
  });
};

// 1. REGISTER FUNCTION
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, organizationName, contactNumber } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered! Please login.' });
    }

    // Create new user
    const user = await User.create({
      name, email, password, role, organizationName, contactNumber
    });

    if (user) {
      res.status(201).json({
        message: 'Account created successfully',
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid data format', error: error.message });
  }
};

// 2. LOGIN FUNCTION
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists AND password matches
    if (user && (await user.matchPassword(password))) {
      res.json({
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { registerUser, loginUser };