import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { dislikeVideo, fetchVideoById, fetchVideos, likeVideo, updateViewsCount } from '../services/video'
import { fetchComments, postComment } from '../services/comment'

const VideoPage = () => {

  const {videoId} = useParams()
  const {user} = useContext(AuthContext)
  const [video, setVideo] = useState(null)
  const [relatedVideos, setRelatedVideos] = useState([])
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [commentError, setCommentError] = useState(null)

  useEffect(()=>{
    const loadVideo = async()=>{
      try{
        setLoading(true)
        const videoData = await fetchVideoById(videoId)
        setVideo(videoData)

        //Update Video Count
        await updateViewsCount(videoId)

        //Fetch related videos (based on tags/category)
        const related = await fetchVideos({
          category:videoData.category,
          exclude:videoId,
          limit:8,
        })
        setRelatedVideos(related.data)

        const commentsData = await fetchComments(videoId)
        setComments(commentsData)

        setLoading(false)
      }
      catch(error){
        console.error('Error loading video data:', error);
        setError('Failed to load video. Please try again later.');
        setLoading(false);
      }
    }
    loadVideo()
  },[videoId])


  const handleLike = async() =>{
    if(!user){
      alert('Please login to like videos')
      return;
    }

    try{
      await likeVideo(videoId);

      setVideo(prev=>({
        ...prev,
        likes:prev.likes+1,
        dislikes:prev.userDisliked? prev.dislikes-1:prev.dislikes,
        userLiked:true,
        userDisliked:false
      }))
    }catch(err){
      console.error('Error Liking Video', err);
    }
  }

  const handleDislike = async ()=>{
    if(!user){
      alert('Please login to Dislike videos')
      return;
    }

    try{
      await dislikeVideo(videoId);

      setVideo(prev=>({
        ...prev,
        dislikes:prev.dislikes+1,
        likes:prev.userLiked? prev.likes-1:prev.likes,
        userDisliked:true,
        userLiked:false
      }))
    }catch(err){
      console.error('Error DisLiking Video', err);
    }
  }

  const handleCommentSubmit = async(e)=>{
    e.preventDefault();

    if(!commentText.trim()) return;

    if(!user){
      alert('Please login to comment')
    }

    try{
      setCommentError(null)
      const newComment = await postComment(videoId,{text:commentText})
      setComments(prev=>[newComment,...prev])
      setCommentText('')
    }catch(err){
      console.error('Error posting comment:', err);
      setCommentError('Failed to post comment. Please try again.');
    }
  }

  return (
    <div>VideoPage</div>
  )
}

export default VideoPage