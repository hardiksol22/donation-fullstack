// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_daansetu_2026');

      // Fetch user from database and attach to request object (excluding password)
      // FIX: Added decoded.userId to match the token payload generated during login
      req.user = await User.findById(decoded.userId || decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error('Token Verification Error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

// Role authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if req.user exists and has a role
    if (!req.user || !req.user.role) {
      return res.status(403).json({ 
        success: false, 
        message: 'User role not found' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `User role '${req.user.role}' is not authorized to access this route` 
      });
    }
    
    next();
  };
};

module.exports = { protect, authorize };