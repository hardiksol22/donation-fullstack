// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// ==========================================
// Route Imports
// Note: Ensure these file names exactly match the files in your 'routes' folder
// ==========================================
const authRoutes = require('./routes/authRoutes');       // or './routes/auth'
const donationRoutes = require('./routes/donationRoutes'); // or './routes/donations'
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// Global Middleware
// ==========================================
app.use(cors()); // Cross-Origin Resource Sharing (Allows frontend to talk to backend)
app.use(express.json()); // Parses incoming JSON requests

// ==========================================
// API Routes Mounting
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes); 
app.use('/api/admin', adminRoutes);

// ==========================================
// Health Check Endpoint (Crucial for Deployment/Render)
// ==========================================
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'DaanSetu API is running perfectly! 🚀',
    timestamp: new Date() 
  });
});

// ==========================================
// Database Connection & Server Initialization
// ==========================================
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/donation_platform')
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ Database connection error:', err);
  });