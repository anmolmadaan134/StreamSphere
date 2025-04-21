import api from "./api";

// Fetch comments for a video
export const fetchComments = async (videoId) => {
    try {
      const response = await api.get(`/videos/${videoId}/comments`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  };
  
  // Post a new comment
  export const postComment = async (videoId, commentData) => {
    try {
      const response = await api.post(`/videos/${videoId}/comments`, commentData);
      return response.data;
    } catch (error) {
      console.error('Error posting comment:', error);
      throw error;
    }
  };
  
  // Like a comment
  export const likeComment = async (commentId) => {
    try {
      const response = await api.put(`/comments/${commentId}/like`);
      return response.data;
    } catch (error) {
      console.error('Error liking comment:', error);
      throw error;
    }
  };
  
  // Dislike a comment
  export const dislikeComment = async (commentId) => {
    try {
      const response = await api.put(`/comments/${commentId}/dislike`);
      return response.data;
    } catch (error) {
      console.error('Error disliking comment:', error);
      throw error;
    }
  };
  
  // Delete a comment
  export const deleteComment = async (commentId) => {
    try {
      const response = await api.delete(`/comments/${commentId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  };
  
  // Edit a comment
  export const updateComment = async (commentId, commentData) => {
    try {
      const response = await api.put(`/comments/${commentId}`, commentData);
      return response.data;
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  };
  
  // Fetch replies for a comment
  export const fetchReplies = async (commentId) => {
    try {
      const response = await api.get(`/comments/${commentId}/replies`);
      return response.data;
    } catch (error) {
      console.error('Error fetching replies:', error);
      throw error;
    }
  };
  
  // Post a reply to a comment
  export const postReply = async (commentId, replyData) => {
    try {
      const response = await api.post(`/comments/${commentId}/replies`, replyData);
      return response.data;
    } catch (error) {
      console.error('Error posting reply:', error);
      throw error;
    }
  };