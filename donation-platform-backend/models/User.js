const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // 🔒 Encryption package

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Donor', 'NGO', 'Admin'], default: 'Donor' },
  organizationName: { type: String },
  contactNumber: { type: String },
  isVerified: { type: Boolean, default: true }
}, { timestamps: true });

// ==========================================
// 1. ENCRYPT PASSWORD BEFORE SAVING
// ==========================================
userSchema.pre('save', async function (next) {
  // Agar password modify nahi hua hai, toh wahi se return ho jao
  if (!this.isModified('password')) {
    return next(); // ⚠️ FIX: Added 'return' to stop execution here
  }
  // Password ko securely hash karo
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ==========================================
// 2. MATCH PASSWORD DURING LOGIN
// ==========================================
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);