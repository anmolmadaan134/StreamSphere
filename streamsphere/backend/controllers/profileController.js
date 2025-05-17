// controllers/profileController.js
const User = require('../models/User');
const Video = require('../models/Video');
const Subscription = require('../models/Subscription');
const Playlist = require('../models/Playlist');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer storage for profile images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/profile';
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filter for image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Initialize upload
exports.upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const username = req.params.username;
    
    const user = await User.findOne({ username })
      .select('-password -email -watchHistory')
      .populate('playlists', 'title visibility thumbnail');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get user's videos
    const videos = await Video.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate('user', 'name username avatar');
    
    // Get subscriber count
    const subscriberCount = await Subscription.countDocuments({ channel: user._id });
    
    // If requesting user is logged in, check if they are subscribed
    let isSubscribed = false;
    if (req.user) {
      isSubscribed = await Subscription.exists({
        subscriber: req.user.id,
        channel: user._id
      });
    }
    
    res.json({
      user,
      videos,
      subscriberCount,
      isSubscribed: !!isSubscribed
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get my profile
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('subscribedTo', 'name username avatar');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get user's videos
    const videos = await Video.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    
    // Get subscriber count
    const subscriberCount = await Subscription.countDocuments({ channel: req.user.id });
    
    // Get user's playlists
    const playlists = await Playlist.find({ creator: req.user.id });
    
    res.json({
      user,
      videos,
      subscriberCount,
      playlists
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
