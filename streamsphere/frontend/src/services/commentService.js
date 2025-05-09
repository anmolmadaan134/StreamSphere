import axios from 'axios';

const API_URL = '/api/comments';

// Get all comments for a video
export const getVideoComments = async (videoId) => {
  try {
    const response = await axios.get(`${API_URL}/video/${videoId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create a new comment
export const createComment = async (commentData) => {
  try {
    const response = await axios.post(API_URL, commentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Like a comment
export const likeComment = async (commentId) => {
  try {
    const response = await axios.put(`${API_URL}/like/${commentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Dislike a comment
export const dislikeComment = async (commentId) => {
  try {
    const response = await axios.put(`${API_URL}/dislike/${commentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete a comment
export const deleteComment = async (commentId) => {
  try {
    const response = await axios.delete(`${API_URL}/${commentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Video Interactions API functions
export const likeVideo = async (videoId) => {
  try {
    const response = await axios.put(`/api/videos/like/${videoId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const dislikeVideo = async (videoId) => {
  try {
    const response = await axios.put(`/api/videos/dislike/${videoId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
