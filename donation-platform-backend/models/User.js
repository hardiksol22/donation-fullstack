const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  }, // Note: This will be hashed via bcrypt in production
  role: { 
    type: String, 
    enum: ['Donor', 'NGO', 'Admin'], 
    required: true 
  },
  // NGO-specific fields (Optional for donors)
  organizationName: { 
    type: String 
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  contactNumber: { 
    type: String 
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);