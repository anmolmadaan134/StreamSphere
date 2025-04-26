import React, { useRef, useState } from 'react'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Upload = () => {

  const {user} = useContext(AuthContext)
  const navigate = useNavigate()

  const fileInputRef = useRef(null);

  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  //Check if the user is logged in

  if(!user){
    return (
      <div className='container mx-auto p-4 text-center'>
        <h2 className='text-2xl font-bold mb-4'>Login Required</h2>
        <p className='mb-4'>You need to be logged in to upload videos</p>
        <button onClick={()=> navigate('/login')}>Login now</button>
      </div>
    )
  }

  const categories = [
    'music', 'gaming', 'news', 'sports', 'education', 'comedy', 'technology', 'entertainment', 'travel', 'other'
  ];

  const handleDrag =(e)=>{
    e.preventDefault();
    e.stopPropagation()

    if(e.type==='dragenter' || e.type==='dragover'){
      setDragActive(true)
    }else if(e.type==='dragleave'){
      setDragActive(false)
    }
  }

  const handleDrop = (e) =>{
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if(e.dataTransfer.files && e.dataTransfer.files[0] && !videoFile){
      const file = e.dataTransfer.files[0];
      if(file.type.startsWith('video/')){
        setVideoFile(file)
      }else{
        setUploadError('Please upload a valid video file')
      }
    }
  }

  const handleFileChange = (e)=>{
    if(e.target.files && e.target.files[0]){
      const file = e.target.files[0];
      if(file.type.startsWith('video/')){
        setVideoFile(file)
        setUploadError(null);

      }else{
        setUploadError('Please upload a valid video file')
      }
    }
  }

  const handleThumbnailChange = (e) =>{
    if(e.target.files && e.target.files[0]){
      const file = e.target.files[0];

      if(file.type.startsWith('image/')){
        setThumbnailFile(file)

        //Create a review
        const reader = new FileReader()
        reader.onloadend = ()=>{
          setThumbnailPreview(reader.result)
        }

        reader.readAsDataURL(file)
      }else{
        alert('Please upload a valid image file for thumbnail.');
      }
    }
  }

  const handleRemoveVideo = ()=>{
    setVideoFile(null);
    if(fileInputRef.current){
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
  };

  return (
    <div>Upload</div>
  )
}

export default Upload
