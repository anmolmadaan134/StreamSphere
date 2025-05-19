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
// Update profile
exports.updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const {
      name,
      bio,
      location,
      websiteUrl,
      socialLinks
    } = req.body;
    
    const profileFields = {};
    if (name) profileFields.name = name;
    if (bio) profileFields.bio = bio;
    if (location) profileFields.location = location;
    if (websiteUrl) profileFields.websiteUrl = websiteUrl;
    
    if (socialLinks) {
      profileFields.socialLinks = {};
      if (socialLinks.twitter) profileFields.socialLinks.twitter = socialLinks.twitter;
      if (socialLinks.facebook) profileFields.socialLinks.facebook = socialLinks.facebook;
      if (socialLinks.instagram) profileFields.socialLinks.instagram = socialLinks.instagram;
      if (socialLinks.tiktok) profileFields.socialLinks.tiktok = socialLinks.tiktok;
    }
    
    // Avatar file is handled separately by multer middleware
    if (req.file) {
      profileFields.avatar = `/uploads/profile/${req.file.filename}`;
    }
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Subscribe to a channel
exports.subscribe = async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.user.id;
    
    // Check if channel exists
    const channel = await User.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }
    
    // Check if already subscribed
    const existingSubscription = await Subscription.findOne({
      subscriber: userId,
      channel: channelId
    });
    
    if (existingSubscription) {
      // Unsubscribe if already subscribed
      await existingSubscription.remove();
      
      // Update user's subscribedTo list
      await User.findByIdAndUpdate(userId, {
        $pull: { subscribedTo: channelId }
      });
      
      // Update channel's subscribers list
      await User.findByIdAndUpdate(channelId, {
        $pull: { subscribers: userId }
      });
      
      return res.json({ 
        subscribed: false,
        message: 'Unsubscribed from channel'
      });
    }
    
    // Create new subscription
    const subscription = new Subscription({
      subscriber: userId,
      channel: channelId
    });
    
    await subscription.save();
    
    // Update user's subscribedTo list
    await User.findByIdAndUpdate(userId, {
      $push: { subscribedTo: channelId }
    });
    
    // Update channel's subscribers list
    await User.findByIdAndUpdate(channelId, {
      $push: { subscribers: userId }
    });
    
    res.json({ 
      subscribed: true,
      message: 'Subscribed to channel'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}
// Get user's watch history
exports.getWatchHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('watchHistory')
      .populate({
        path: 'watchHistory.video',
        select: 'title thumbnail duration user views createdAt',
        populate: {
          path: 'user',
          select: 'name username avatar'
        }
      });
    
    // Sort by most recently watched
    const watchHistory = user.watchHistory.sort((a, b) => 
      new Date(b.watchedAt) - new Date(a.watchedAt)
    );
    
    res.json(watchHistory);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get user's liked videos
exports.getLikedVideos = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('likedVideos')
      .populate({
        path: 'likedVideos',
        select: 'title thumbnail duration user views createdAt',
        populate: {
          path: 'user',
          select: 'name username avatar'
        }
      });
    
    res.json(user.likedVideos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};