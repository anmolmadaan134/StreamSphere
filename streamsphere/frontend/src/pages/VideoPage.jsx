import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { fetchVideoById, fetchVideos, updateViewsCount } from '../services/video'
import { fetchComments } from '../services/comment'

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

  return (
    <div>VideoPage</div>
  )
}

export default VideoPage