import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { createComment, deleteComment, dislikeComment, likeComment } from '../../services/commentService'

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
    <div className='comment-item'>
        <div>
            <div>
                <img className='h-10 w-10 rounded-full'
                src={comment.user?.avatar || '/default-avatar.png'} 
                alt={comment.user?.name || 'User'} />
            </div>
        </div>

    </div>
  )
}

export default CommentItem