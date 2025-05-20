// src/services/profileService.js
import axios from 'axios';

const API_URL = '/api/profile';

// Get current user's profile
export const getMyProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/me`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get user profile by username
export const getUserProfile = async (username) => {
  try {
    const response = await axios.get(`${API_URL}/${username}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update user profile
export const updateProfile = async (profileData) => {
  try {
    // Since we may include file uploads, we need to use FormData
    const formData = new FormData();
    
    // Append text fields
    if (profileData.name) formData.append('name', profileData.name);
    if (profileData.bio) formData.append('bio', profileData.bio);
    if (profileData.location) formData.append('location', profileData.location);
    if (profileData.websiteUrl) formData.append('websiteUrl', profileData.websiteUrl);
    
    // Append social links
    if (profileData.socialLinks) {
      if (profileData.socialLinks.twitter) formData.append('socialLinks[twitter]', profileData.socialLinks.twitter);
      if (profileData.socialLinks.facebook) formData.append('socialLinks[facebook]', profileData.socialLinks.facebook);
      if (profileData.socialLinks.instagram) formData.append('socialLinks[instagram]', profileData.socialLinks.instagram);
      if (profileData.socialLinks.tiktok) formData.append('socialLinks[tiktok]', profileData.socialLinks.tiktok);
    }
    
    // Append avatar file if provided
    if (profileData.avatar && profileData.avatar instanceof File) {
      formData.append('avatar', profileData.avatar);
    }
    
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };
    
    const response = await axios.put(API_URL, formData, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Subscribe/unsubscribe to a channel
export const toggleSubscription = async (channelId) => {
  try {
    const response = await axios.put(`${API_URL}/subscribe/${channelId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get user's watch history
export const getWatchHistory = async () => {
  try {
    const response = await axios.get(`${API_URL}/history`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get user's liked videos
export const getLikedVideos = async () => {
  try {
    const response = await axios.get(`${API_URL}/liked`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};