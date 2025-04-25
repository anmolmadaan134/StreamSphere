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

          {/* Channel Info */}

          <div className='flex items-center mt-4 pb-4 border-b'>
            <Link to={`/channel/${video.user._id}`} className="flex items-center">
              <div>
                {video.user.profileImage?(
                  <img src={video.user.profileImage} alt={video.user.username} className='w-full h-full object-cover' />
                ):(
                  <span className='text-lg font-semibold'>
                    {video.user.username?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className='ml-3'>
                <p className='font-medium'>{video.user.username}</p>
                <p className='text-sm text-gray-600'>{video.user.subscribers || 0}</p>
              </div>
            </Link>
            <button>Subscribe</button>
          </div>

          {/* Video Description */}
          <div>
            <p>{video.description}</p>
          </div>

          {/* Comment Section */}

          <div className='mt-6'>
              <h3 className='text-lg font-medium mb-4'>{comments.length} Comments</h3>
              {
                user ? (
                  <form onSubmit={handleCommentSubmit} className='mb-6'>
                    <div>
                      <div>
                        {user.profileImage ? (
                          <img src={user.profileImage} alt={user.username} className='w-full h-full object-cover' />
                        ): (
                          <span className='text-lg font-semibold'>{user.username?.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div className='ml-3 flex-1'>
                        <textarea className='w-full border rounded p-2' 
                        rows="2"
                        placeholder='Add a comment..'
                        value={commentText}
                        onChange={(e)=>setCommentText(e.target.value)}></textarea>
                        {commentError && (
                          <p className='text-red-500 text-sm mt-1'>{commentError}</p>
                        )}
                        <div className='flex justify-end mt-2'>
                          <button type='button' className='px-4 py-1 text-gray-700' onClick={()=>setCommentText('')}> 
                            Cancel
                          </button>
                          <button type='submit'
                          className='ml-2 px-4 py-1 bg-blue-600 text-white rounded disabled:bg-blue-300' 
                          disabled={!commentText.trim()}>
                            Comment
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                ):(
                  <div className="mb-6 p-4 bg-gray-50 text-center rounded">
                <p>
                  <Link to="/login" className="text-blue-600">Sign in</Link> to add a comment
                </p>
              </div>

                )
              }

                {/* Comments list */}
            <div className="space-y-4">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment._id} className="flex">
                    <Link to={`/channel/${comment.user._id}`} className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                        {comment.user.profileImage ? (
                          <img 
                            src={comment.user.profileImage} 
                            alt={comment.user.username} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <span className="text-lg font-semibold">
                            {comment.user.username?.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </Link>
                    <div className="ml-3">
                      <div className="flex items-center">
                        <Link to={`/channel/${comment.user._id}`} className="font-medium">
                          {comment.user.username}
                        </Link>
                        <span className="ml-2 text-sm text-gray-500">
                          {formatRelativeTime(comment.createdAt)}
                        </span>
                      </div>
                      <p className="mt-1">{comment.text}</p>
                      <div className="flex items-center mt-2 space-x-4">
                        <button className="flex items-center text-sm">
                          <ThumbsUp size={14} className="mr-1" />
                          {comment.likes || 0}
                        </button>
                        <button className="flex items-center text-sm">
                          <ThumbsDown size={14} className="mr-1" />
                        </button>
                        <button className="text-sm">Reply</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No comments yet</p>
              )}
          </div>
        </div>
      </div>

        {/* Sidebar with related videos */}
      <div className="lg:w-1/3">
          <h3 className="text-lg font-medium mb-4">Related Videos</h3>
          <VideoList videos={relatedVideos} layout="sidebar" />
        </div>
      </div>
    </div>
   
  )
}

export default VideoPage

