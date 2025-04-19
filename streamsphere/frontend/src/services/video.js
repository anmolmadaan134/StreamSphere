import api from "./api"

export const fetchVideos =  async(params={})=>{
    const response = await api.get('/videos', {params})
    return response.data;
}

export const fetchVideoById = async(id)=>{
    const response = await api.get(`/videos/${id}`)
    return response.data;
}

export const uploadVideo = async(videoData,onUploadProgress)=>{
    const formData = new FormData();

    //Add video file
    formData.append('videoFile', videoData.videoFile)

    
  // Add other video data as JSON
    formData.append('title', videoData.title);
  formData.append('description', videoData.description);
  
  if (videoData.thumbnail) {
    formData.append('thumbnail', videoData.thumbnail);
  }

  const response = await api.post('/videos', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress
  });

  return response.data;
}