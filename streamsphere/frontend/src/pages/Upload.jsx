import React, { useRef, useState } from 'react'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { createVideo, uploadVideo } from '../services/video'
import { Upload as UploadIcon, X, CheckCircle, AlertCircle } from 'react-feather';

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

  const handleSubmit = async(e)=>{
    e.preventDefault();

    if(!videoFile){
      setUploadError('Please select a video file to upload')
      return;

    }

    if(!title.trim()){
      setUploadError('Please enter a title for your video')
      return;
    }

    setIsUploading(true)
    setUploadError(null);

    try {
        //Process tags
        const tagArray = tags.split(',').map(tag=>tag.trim()).filter(tag=>tag.length>0)

        //First uploading the video file
        const videoData = await uploadVideo(videoFile, (progress)=>{
          setUploadProgress(progress)
        })

        //if there's a thumbnail, upload it

        let thumbnailUrl = null;
        if(thumbnailFile){
          const thumbnailData = await uploadVideo(thumbnailFile)
          thumbnailUrl = thumbnailData.url
        }

        //Create a video in the database
        const videoDetails = await createVideo({
          title,
          description,
          category,
          tags:tagArray,
          videoUrl: videoData.url,
          thumbnailUrl:thumbnailUrl || videoData.thumbnailUrl
        })

        setUploadSuccess(true)

        //Redirect to the video page after a short delay
        setTimeout(() => {
          navigate(`/video/${videoDetails._id}`)
        }, 2000);
      
    } catch (error) {
      console.error('Error uploading video:', error);
      setUploadError('Failed to upload video. Please try again.');
      setIsUploading(false);
    }
  }

  if(uploadSuccess){
    return(
      <div>
        <div>
          <CheckCircle className='mx-auto text-green-500' size={48}/>
          <h2>Upload Successful</h2>
          <p>Your video has been uploaded and is being processed</p>
          <p>You'll be redirected to your video page in a moment</p>
        </div>
      </div>
    )
  }



  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-6'>Upload Video</h1>
      
      {uploadError && (
        <div className="bg-red-50 text-red-700 p-4 rounded mb-6 flex items-start">
          <AlertCircle className="flex-shrink-0 mt-0.5 mr-2" size={18} />
          <p>{uploadError}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Video Upload Area */}
        {
          !videoFile ? (
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <UploadIcon className="mx-auto text-gray-500 mb-4" size={48} />
            <h3 className="text-lg font-medium mb-2">Drag and drop video file</h3>
            <p className="text-gray-500 mb-4">or</p>
            <Button
              type="button"
              onClick={() => fileInputRef.current.click()}
            >
              Select File
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="video/*"
              className="hidden"
            />
            <p className="mt-4 text-sm text-gray-500">
              Supported formats: MP4, WebM, AVI, MOV
            </p>
          </div>
        ) : (
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded">
                  <UploadIcon className="text-blue-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="font-medium">{videoFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {Math.round(videoFile.size / 1024 / 1024 * 10) / 10} MB
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={handleRemoveVideo}
                className="text-gray-500 hover:text-red-500"
              >
                <X size={20} />
              </button>
            </div>
            
            {isUploading && (
              <div className="mt-4">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Uploading: {uploadProgress}%
                </p>
              </div>
            )}
          </div>
        )
        }

        {/* Video Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Add a title that describes your video"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded"
                rows="5"
                placeholder="Tell viewers about your video"
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Add tags separated by commas"
              />
              <p className="text-xs text-gray-500 mt-1">
                Tags help viewers find your video
              </p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thumbnail
            </label>
            
            {!thumbnailPreview ? (
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                <button
                  type="button"
                  onClick={() => document.getElementById('thumbnail-upload').click()}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Upload Thumbnail
                </button>
                <input
                  id="thumbnail-upload"
                  type="file"
                  onChange={handleThumbnailChange}
                  accept="image/*"
                  className="hidden"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Recommended: 1280×720 (16:9 ratio)
                </p>
              </div>
            ) : (
              <div className="relative">
                <img 
                  src={thumbnailPreview} 
                  alt="Thumbnail preview" 
                  className="w-full rounded" 
                />
                <button
                  type="button"
                  onClick={handleRemoveThumbnail}
                  className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white p-1 rounded-full"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            
            <p className="text-sm text-gray-600 mt-2">
              If you don't upload a thumbnail, one will be generated from your video.
            </p>
          </div>
        </div>
        
        <div className="pt-4 border-t flex justify-end">
          <Button
            type="button"
            variant="secondary"
            className="mr-2"
            onClick={() => navigate('/')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isUploading || !videoFile || !title.trim()}
          >
            {isUploading ? 'Uploading...' : 'Upload Video'}
          </Button>
        </div>
      </form>
      
    </div>
  )
}

export default Upload
