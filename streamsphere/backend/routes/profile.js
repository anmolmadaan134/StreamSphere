// routes/profile.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const profileController = require('../controllers/profileController');

// @route   GET /api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, profileController.getMyProfile);

// @route   GET /api/profile/:username
// @desc    Get user profile by username
// @access  Public
router.get('/:username', profileController.getProfile);

// @route   PUT /api/profile
// @desc    Update user profile
// @access  Private
router.put(
  '/',
  [
    auth,
    profileController.upload.single('avatar'),
    [
      check('name', 'Name is required').not().isEmpty()
    ]
  ],
  profileController.updateProfile
);

// @route   PUT /api/profile/subscribe/:channelId
// @desc    Subscribe/unsubscribe to a channel
// @access  Private
router.put('/subscribe/:channelId', auth, profileController.subscribe);

// @route   GET /api/profile/history
// @desc    Get user's watch history
// @access  Private
router.get('/history', auth, profileController.getWatchHistory);

// @route   GET /api/profile/liked
// @desc    Get user's liked videos
// @access  Private
router.get('/liked', auth, profileController.getLikedVideos);

module.exports = router;
