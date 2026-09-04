const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema({
  donationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation',
    required: false // Can be related to a specific donation or a general issue
  },
  raisedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: [true, 'Please provide a subject for the dispute']
  },
  description: {
    type: String,
    required: [true, 'Please describe the issue in detail']
  },
  status: {
    type: String,
    enum: ['Open', 'Resolved'],
    default: 'Open'
  },
  adminResponse: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Dispute', disputeSchema);