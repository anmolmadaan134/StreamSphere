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

//Create a video record with metadata
export const createVideo = async(videoData)=>{
  try{
    const response = await api.post('/videos',videoData)
    return response.data;
  }catch(error){
    console.error('Error creating video record',error)
    throw error
  }
}

//Update video views count
export const updateViewsCount = async(videoId)=>{
  try{
    const response = await api.post(`/videos/${videoId}/views`)
    return response.data;
  }catch(error){
    console.error('Error creating video record',error)}
}

//Like a video
export const likeVideo = async(videoId)=>{
  try{
    const response = await api.post(`/videos/${videoId}/like`)
    return response.data;
  }catch(error){
    console.error('Error Liking video',error)
    throw error}
}

//dislike video
export const dislikeVideo = async(videoId)=>{
  try{
    const response = await api.post(`/videos/${videoId}/dislike`)
    return response.data;
  }catch(error){
    console.error('Error Disliking video',error)
    throw error}
}

//search a video
export const searchVideo = async(query)=>{
  try{
    const response = await api.get(`/videos/search`,{params:{q:query}})
    return response.data;
  }catch(error){
    console.error('Error searching videos',error)
    throw error}
}

// Delete a video
export const deleteVideo = async (videoId) => {
  try {
    const response = await api.delete(`/videos/${videoId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting video:', error);
    throw error;
  }
};

//Update Video details
export const updateVideo = async (videoId, videoData) => {
  try {
    const response = await api.put(`/videos/${videoId}`, videoData);
    return response.data;
  } catch (error) {
    console.error('Error updating video:', error);
    throw error;
  }
};