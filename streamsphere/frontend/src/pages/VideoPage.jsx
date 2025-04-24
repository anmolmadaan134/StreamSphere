import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { dislikeVideo, fetchVideoById, fetchVideos, likeVideo, updateViewsCount } from '../services/video'
import { fetchComments, postComment } from '../services/comment'
import { formatRelativeTime, formatViewCount } from '../utils/helper'

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

  if(loading){
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900'></div>
      </div>
    )
  }

  if(error){
    return (
      <div className='container mx-auto p-4 text-center'>
        <p className='text-red-500 text-lg'>{error}</p>
        <button onClick={()=>window.location.reload()}>Try Again</button>
      </div>
    )
  }

  if(!video) return null;

  return (
    <div>
      <div>
        {/* Main Content */}
        <div>
          {/* Video Player */}
          <div>
            <video src={video.videoUrl}
            post={video.thumbnailUrl}
            controls 
            className='w-full h-full'></video>
          </div>
          {/* Video Info */}
          <div className='mt-4'>
            <h1 className='text-xl font-bold'>{video.title}</h1>
            <div className='flex items-center justify-between mt-2'>
              <div className='text-gray-700'>
                {formatViewCount(video.views)} views . {formatRelativeTime(video.createdAt)}
              </div>

              <div className='flex space-x-4'>
                <button onClick={handleLike}
                className={`flex items-center space-x-1 ${video.userLiked ?'text-blue-600':''}`}>
                  <ThumbsUp size={18}/>
                  <span>{video.likes || 0}</span>
                </button>

                <button 
                  onClick={handleDislike}
                  className={`flex items-center space-x-1 ${video.userDisliked ? 'text-blue-600' : ''}`}
                >
                  <ThumbsDown size={18} />
                  <span>{video.dislikes || 0}</span>
                </button>

                <button className="flex items-center space-x-1">
                  <Share size={18} />
                  <span>Share</span>
                </button>
                
                <button className="flex items-center space-x-1">
                  <Save size={18} />
                  <span>Save</span>
                </button>
                
                <button className="flex items-center space-x-1">
                  <Flag size={18} />
                  <span>Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoPage