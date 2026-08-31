const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'https://donation-reuse-platform-one.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));

app.use(express.json()); 

// ==========================================
// MOUNTING ALL API ROUTES
// ==========================================
const authRoutes = require('./routes/authRoutes'); 
const donationRoutes = require('./routes/donationRoutes'); 
const adminRoutes = require('./routes/adminRoutes'); 

app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes); // Added Donation Engine
app.use('/api/admin', adminRoutes);       // Added Admin Dashboard

// ==========================================
// HEALTH & ERROR HANDLING
// ==========================================
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'DaanSetu API is running! 🚀' });
});

// Fallback for missing routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' });
});

// ==========================================
// DATABASE CONNECTION
// ==========================================
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/donation_platform')
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error('❌ DB Error:', err));