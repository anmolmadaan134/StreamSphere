// src/components/video/VideoInteractions.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  Save,
  PlaySquare
} from 'lucide-react';
import { likeVideo, dislikeVideo } from '../../services/commentService';

const VideoInteractions = ({ video, onLikeUpdate }) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likesCount, setLikesCount] = useState(video.likes?.length || 0);
  const [dislikesCount, setDislikesCount] = useState(video.dislikes?.length || 0);
  
  const { user, isAuthenticated } = useSelector(state => state.auth);
  
  const handleLike = async () => {
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      return;
    }
    
    try {
      const response = await likeVideo(video._id);
      setLiked(response.liked);
      setDisliked(response.disliked);
      setLikesCount(response.likes);
      setDislikesCount(response.dislikes);
      
      if (onLikeUpdate) {
        onLikeUpdate(response);
      }
    } catch (err) {
      console.error('Failed to like video:', err);
    }
  };
  
  const handleDislike = async () => {
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      return;
    }
    
    try {
      const response = await dislikeVideo(video._id);
      setLiked(response.liked);
      setDisliked(response.disliked);
      setLikesCount(response.likes);
      setDislikesCount(response.dislikes);
      
      if (onLikeUpdate) {
        onLikeUpdate(response);
      }
    } catch (err) {
      console.error('Failed to dislike video:', err);
    }
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: video.description,
        url: window.location.href,
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // Show a toast or notification
    }
  };
  
  const handleSave = () => {
    // Logic to save to Watch Later or playlist
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      return;
    }
    
    // Implement save to playlist logic
  };
  
  return (
    <div className="flex items-center flex-wrap md:flex-nowrap justify-between py-3 border-t border-b border-gray-200 my-4">
      <div className="flex items-center space-x-4">
        <button 
          onClick={handleLike}
          className={`flex items-center space-x-1 py-1 px-3 rounded-full ${
            liked ? 'bg-gray-200 text-blue-600' : 'hover:bg-gray-100'
          }`}
        >
          <ThumbsUp className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
          <span className="text-sm font-medium">{likesCount > 0 ? likesCount : ''}</span>
        </button>
        
        <button 
          onClick={handleDislike}
          className={`flex items-center space-x-1 py-1 px-3 rounded-full ${
            disliked ? 'bg-gray-200 text-red-600' : 'hover:bg-gray-100'
          }`}
        >
          <ThumbsDown className={`h-5 w-5 ${disliked ? 'fill-current' : ''}`} />
          <span className="text-sm font-medium">{dislikesCount > 0 ? dislikesCount : ''}</span>
        </button>
      </div>
      
      <div className="flex items-center space-x-4 mt-2 md:mt-0">
        <button 
          onClick={handleShare}
          className="flex items-center space-x-1 py-1 px-3 rounded-full hover:bg-gray-100"
        >
          <Share2 className="h-5 w-5" />
          <span className="text-sm font-medium">Share</span>
        </button>
        
        <button 
          onClick={handleSave}
          className="flex items-center space-x-1 py-1 px-3 rounded-full hover:bg-gray-100"
        >
          <Save className="h-5 w-5" />
          <span className="text-sm font-medium">Save</span>
        </button>
        
        <button 
          className="flex items-center space-x-1 py-1 px-3 rounded-full hover:bg-gray-100"
        >
          <PlaySquare className="h-5 w-5" />
          <span className="text-sm font-medium">Clip</span>
        </button>
      </div>
    </div>
  );
};

export default VideoInteractions;