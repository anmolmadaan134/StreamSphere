export const getToken = ()=>{
    return localStorage.getItem('token')
}

export const setToken = (token)=>{
    return localStorage.setItem('token',token)
}

export const removeToken = () => {
    localStorage.removeItem('token');
  };

export const formatDate = (dateString)=>{
    const options = {year:'numeric',month:'short',day:'numeric'};
    return new Date(dateString).toLocaleDateString(undefined , options);
}

export const formatViewCount = (count)=>{
    if(count>=1000000){
        return `${(count/1000000).toFixed(1)}M`
    } else if(count>=1000){
        return `${(count/1000).toFixed(1)}K`
    }

    return count.toString();
}

export const formatRelativeTime = (dateString)=>{
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now-date)/1000);

    if(diffInSeconds<60){
        return "just now";
    }

    const diffInMinutes = Math.floor(diffInSeconds/60);
    if(diffInMinutes<60){
        return `${diffInMinutes} minute ${diffInMinutes>1?'s':''} ago`
    }

    const diffInHours = Math.floor(diffInMinutes/60);
    if(diffInHours<24){
        return `${diffInHours} hour ${diffInHours>1?'s':''} ago`
    }

    const diffInDays = Math.floor(diffInHours/24);
    if(diffInDays<30){
        return `${diffInDays} day ${diffInDays>1?'s':''} ago`
    }

    const diffInMonths = Math.floor(diffInDays/30);
    if(diffInMonths<12){
        return `${diffInMonths} month ${diffInMonths>1?'s':''} ago`
    }

    const diffInYears = Math.floor(diffInMonths/12);
    return `${diffInYears} year ${diffInYears>1?'s':''} ago`
}


export const formatDuration = (seconds)=>{
    const hours = Math.floor(seconds/3600);
    const minutes = Math.floor((seconds % 3600)/60);
    const secs = Math.floor(seconds%60);

    if(hours>0){
        return `${hours}:${minutes.toString().padStart(2,'0')} :${secs.toString().padStart(2,'0')}`;
    }

    return `${minutes} : ${secs.toString().padStart(2,'0')}`;
}

// Generate random string for IDs
export const generateRandomString = (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  };
  
  // Truncate text with ellipsis
  export const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    
    return text.substring(0, maxLength) + '...';
  };
  
  // Extract video ID from YouTube URL
  export const extractYouTubeId = (url) => {
    if (!url) return null;
    
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[7].length === 11) ? match[7] : null;
  };
  
  // Validate YouTube URL
  export const isValidYouTubeUrl = (url) => {
    if (!url) return false;
    
    const regExp = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+/;
    return regExp.test(url);
  };
  
  // Validate email address
  export const isValidEmail = (email) => {
    if (!email) return false;
    
    const regExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regExp.test(email);
  };
  
  // Get file extension
  export const getFileExtension = (filename) => {
    if (!filename) return '';
    return filename.split('.').pop().toLowerCase();
  };
  
  // Check if file is an image
  export const isImageFile = (filename) => {
    if (!filename) return false;
    
    const extension = getFileExtension(filename);
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    
    return imageExtensions.includes(extension);
  };
  
  // Check if file is a video
  export const isVideoFile = (filename) => {
    if (!filename) return false;
    
    const extension = getFileExtension(filename);
    const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'wmv', 'flv', 'mkv'];
    
    return videoExtensions.includes(extension);
  };
  
  // Format file size for display
  export const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  