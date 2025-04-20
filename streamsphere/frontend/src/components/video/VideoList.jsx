import React from 'react'
import VideoCard from './VideoCard'

const VideoList = ({videos,layout='grid'}) => {
    if(!videos || videos.length===0){
        return(
            <div>
                <h3>No videos found</h3>
                <p>Try searching for something else</p>
            </div>
        )
    }

    //Layout styles
    const layoutClasses = {
        grid: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
        row: "space-y-4",
        sidebar: "space-y-3"
    }

    // Choose the layout styles

    const containerClass = layoutClasses[layout] || layoutClasses.grid



  return (
    <div className={containerClass}>
        {
            videos.map((video)=>{
                <VideoCard key={video.id} video={video}/>
            })
        }
    </div>
  )
}

export default VideoList