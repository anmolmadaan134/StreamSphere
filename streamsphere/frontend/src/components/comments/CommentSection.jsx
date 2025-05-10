// src/components/comments/CommentSection.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getVideoComments, createComment } from '../../services/commentService';
import CommentItem from './CommentItem';

const CommentSection = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    loadComments();
  }, [videoId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await getVideoComments(videoId);
      setComments(data);
      setError(null);
    } catch (err) {
      setError('Failed to load comments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;
    
    try {
      const newComment = await createComment({
        content: commentText,
        videoId
      });
      
      setComments([newComment, ...comments]);
      setCommentText('');
    } catch (err) {
      setError('Failed to post comment');
      console.error(err);
    }
  };

  const handleAddReply = (parentComment, newReply) => {
    setComments(prevComments => {
      return prevComments.map(comment => {
        if (comment._id === parentComment._id) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply]
          };
        }
        return comment;
      });
    });
  };

  const handleDeleteComment = (commentId) => {
    setComments(prevComments => 
      prevComments.filter(comment => comment._id !== commentId)
    );
  };

  const commentsCount = comments.reduce((count, comment) => {
    // Count the comment itself
    let total = 1;
    // Add number of replies if any
    if (comment.replies && Array.isArray(comment.replies)) {
      total += comment.replies.length;
    }
    return count + total;
  }, 0);

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">{commentsCount} Comments</h3>
      
      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <img 
                src={user?.avatar || '/default-avatar.png'} 
                alt={user?.name}
                className="h-10 w-10 rounded-full"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="border-b border-gray-200 focus-within:border-blue-600">
                <textarea
                  rows="3"
                  name="comment"
                  id="comment"
                  className="block w-full resize-none border-0 border-b border-transparent p-0 pb-2 focus:ring-0 focus:border-blue-600 sm:text-sm"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                ></textarea>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2"
                  onClick={() => setCommentText('')}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Comment
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
          <p>Please <a href="/login" className="text-blue-600 hover:underline">sign in</a> to add a comment.</p>
        </div>
      )}

      {loading ? (
        <div className="py-4 text-center">Loading comments...</div>
      ) : error ? (
        <div className="py-4 text-center text-red-500">{error}</div>
      ) : comments.length === 0 ? (
        <div className="py-4 text-center text-gray-500">No comments yet. Be the first to comment!</div>
      ) : (
        <div className="space-y-6">
          {comments.map(comment => (
            <CommentItem 
              key={comment._id} 
              comment={comment} 
              videoId={videoId}
              onAddReply={handleAddReply}
              onDeleteComment={handleDeleteComment}
              refreshComments={loadComments}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;