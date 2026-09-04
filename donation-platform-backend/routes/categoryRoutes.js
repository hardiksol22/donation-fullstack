const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { protect, authorize } = require('../middleware/auth');

// ==========================================
// @desc    Get all active categories (Public/All Users)
// @route   GET /api/categories
// ==========================================
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// @desc    Create a new category
// @route   POST /api/categories
// @access  Private (Admin Only)
// ==========================================
router.post('/', protect, authorize('Admin', 'admin'), async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ==========================================
// @desc    Delete/Deactivate a category
// @route   DELETE /api/categories/:id
// @access  Private (Admin Only)
// ==========================================
router.delete('/:id', protect, authorize('Admin', 'admin'), async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;