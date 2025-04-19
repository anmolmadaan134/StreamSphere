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