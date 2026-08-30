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
  }, // Remains null until an NGO accepts the request
  category: { 
    type: String, 
    enum: ['Clothes', 'Household Items', 'Books', 'Toys'], 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true 
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
  // Added location field to store geocoded Maps coordinates
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
    enum: ['Pending', 'Accepted', 'Collected', 'Cancelled'], 
    default: 'Pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);