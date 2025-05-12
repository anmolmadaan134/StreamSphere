import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { createComment, deleteComment, dislikeComment, likeComment } from '../../services/commentService'
import moment from 'moment';

const CommentItem = ({comment, videoId, onAddReply, onDeleteComment, refreshComments}) => {
    const [showReplyForm, setShowReplyForm] = useState(false)
    const [replyText, setReplyText] = useState('')
    const [showReplies, setShowReplies] = useState(false)
    const [liked, setLiked] = useState(false)  
    const [disliked, setDisliked] = useState(false)
    const [likesCount, setLikesCount] = useState(comment.likes?.length || 0);
    const [dislikesCount, setDislikesCount] = useState(comment.dislikes?.length || 0);

    const {user,isAuthenticated} = useSelector(state=>state.auth)

    const hasReplies = comment.replies && comment.replies.length>0

    const handleLike = async()=>{
        if(!isAuthenticated) return;

        try {
            const response = await likeComment(comment._id)
            setLiked(response.liked)
            setDisliked(response.disliked)
            setLikesCount(response.likes)
            setDislikesCount(response.dislikes)
        } catch (error) {
            console.error('Failed to like comment:',error)
        }
    }

    const handleDislike = async()=>{
        if(!isAuthenticated) return;

        try {
            const response = await dislikeComment(comment._id)
            setLiked(response.liked)
            setDisliked(response.disliked)
            setLikesCount(response.likes)
            setDislikesCount(response.dislikes)
        } catch (error) {
            console.error('Failed to dislike comment:',error)
        }
    }

    const handleDelete = async()=>{
        if(!isAuthenticated || comment.user._id!==user._id) return;

        try{
            await deleteComment(comment._id)
            onDeleteComment(comment._id)

        }catch(error){
            console.error('Failed to delete comment:',error)
        }
    }

    const handleSubmitReply = async(e)=>{
        e.preventDefault()

        if(!replyText.trim()) return;

        try{
            const newReply = await createComment({
                content:replyText,
                videoId,
                parentCommentId: comment._id
            })

            onAddReply(comment,newReply);
            setReplyText('');
            setShowReplyForm(false)
            setShowReplies(true)

        }
        catch(error){
            console.error("Failed to post reply", error)
        }
    }

    const toggleReplies = ()=>{
        setShowReplies(prev=>!prev);
    }



  return (
    <div className="comment-item">
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <img 
            className="h-10 w-10 rounded-full"
            src={comment.user?.avatar || '/default-avatar.png'}
            alt={comment.user?.name || 'User'}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <p className="text-sm font-medium text-gray-900">
              {comment.user?.name || 'Anonymous User'}
            </p>
            <span className="ml-2 text-xs text-gray-500">
              {moment(comment.createdAt).fromNow()}
            </span>
          </div>
          <div className="mt-1 text-sm text-gray-700">
            <p>{comment.content}</p>
          </div>
          <div className="mt-2 flex items-center space-x-4">
            <button 
              onClick={handleLike}
              className={`flex items-center text-xs ${liked ? 'text-blue-600' : 'text-gray-500'} hover:text-blue-600`}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              <span>{likesCount}</span>
            </button>
            <button 
              onClick={handleDislike}
              className={`flex items-center text-xs ${disliked ? 'text-red-600' : 'text-gray-500'} hover:text-red-600`}
            >
              <ThumbsDown className="h-4 w-4 mr-1" />
              <span>{dislikesCount}</span>
            </button>
            {isAuthenticated && (
              <button 
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center text-xs text-gray-500 hover:text-gray-700"
              >
                <Reply className="h-4 w-4 mr-1" />
                <span>Reply</span>
              </button>
            )}
            {isAuthenticated && user && comment.user && user._id === comment.user._id && (
              <button 
                onClick={handleDelete}
                className="flex items-center text-xs text-gray-500 hover:text-red-600"
              >
                <Trash className="h-4 w-4 mr-1" />
                <span>Delete</span>
              </button>
            )}
          </div>
          
          {showReplyForm && (
            <div className="mt-3">
              <form onSubmit={handleSubmitReply}>
                <textarea
                  rows="2"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                ></textarea>
                <div className="mt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowReplyForm(false)}
                    className="px-3 py-1 text-xs text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-xs text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Reply
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {hasReplies && (
            <div className="mt-2">
              <button
                onClick={toggleReplies}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                {showReplies 
                  ? `Hide ${comment.replies.length} ${comment.replies.length === 1 ? 'reply' : 'replies'}` 
                  : `Show ${comment.replies.length} ${comment.replies.length === 1 ? 'reply' : 'replies'}`}
              </button>
              
              {showReplies && (
                <div className="mt-3 pl-6 border-l-2 border-gray-100 space-y-4">
                  {comment.replies.map(reply => (
                    <div key={reply._id} className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <img 
                          className="h-8 w-8 rounded-full"
                          src={reply.user?.avatar || '/default-avatar.png'}
                          alt={reply.user?.name || 'User'}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">
                            {reply.user?.name || 'Anonymous User'}
                          </p>
                          <span className="ml-2 text-xs text-gray-500">
                            {moment(reply.createdAt).fromNow()}
                          </span>
                        </div>
                        <div className="mt-1 text-sm text-gray-700">
                          <p>{reply.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  
  )
}

export default CommentItem