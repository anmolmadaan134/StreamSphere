const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middleware/authMiddleware');

// Get user profile - protected route
router.get('/profile', protect, userController.getUserProfile);

module.exports = router;