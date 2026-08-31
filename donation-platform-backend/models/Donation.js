// models/Donation.js
const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  ngoId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }, // Optional: specific NGO ke liye
  category: { 
    type: String, 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true,
    min: 1 
  },
  condition: { 
    type: String, 
    enum: ['New', 'Gently Used', 'Fair'],
    required: true 
  },
  pickupAddress: { 
    type: String, 
    required: true 
  },
  location: {
    lat: { type: Number },
    lng: { type: Number }
  },
  scheduledTime: { 
    type: Date, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Accepted', 'Rejected', 'Scheduled', 'Collected'], 
    default: 'Pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);