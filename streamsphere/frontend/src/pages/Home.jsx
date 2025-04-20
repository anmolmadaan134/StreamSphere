import React, { useEffect, useState } from 'react'
import { fetchVideos } from '../services/video';
import Sidebar from '../components/common/Sidebar';
import VideoList from '../components/video/VideoList';

const Home = () => {

  const [videos, setVideos] = useState([])
  const [loading,setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category,setCategory] = useState('all')

  useEffect(()=>{
    const loadVideos = async()=>{
      try{
        setLoading(true)
        const response = await fetchVideos({category:category!=='all'?category:null});
        setVideos(response.data);
        setLoading(false);
      }
      catch(err){
        console.error('Error fetching videos',err);
        setError('Failed to load videos. Please try again later.');
        setLoading(false);
      }
    }

    loadVideos()
  },[category])

  const categories = [
    'all','music','gaming','news','sports','education','comedy','technology'
  ]

  return (
    <div className='flex'>
      <Sidebar/>
      <div>
        <div>
          <div>
            {
              categories.map((cat)=>(
                <button
                key={cat}
                onClick={()=>setCategory(cat)}
                className={`px-4 py-1 rounded-full text-sm whitespace-nowrap ${
                  category === cat
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))
            }
          </div>
        </div>

        {loading?(
          <div className='flex justify-center items-center h-64'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900'></div>
          </div>
        ):error ? (
          <div className='text-center py-10'>
            <p className='text-red-500'>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        ):(<VideoList videos={videos} layout="grid" />)}
      </div>
    </div>
  )
}

export default Home