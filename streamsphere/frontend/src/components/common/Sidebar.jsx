import React from 'react'
import { Link, Links, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaCompass, 
  FaHistory, 
  FaThumbsUp, 
  FaClock,
  FaYoutube,
  FaFireAlt,
  FaGamepad,
  FaMusic,
  FaNewspaper
} from 'react-icons/fa';

const Sidebar = ({isOpen}) => {
    const location = useLocation();

    const isActive = (path)=> location.pathname===path;

    const menuItems = [
        {path:'/',label:'Home', icon:<FaHome/>},
        {path:'/explore',label:'Explore', icon:<FaCompass/>},
        {path:'/trending',label:'Trending', icon:<FaFireAlt/>},
        {path:'/subsciptions',label:'Subscriptions', icon:<FaYoutube/>},
    ]

    const libraryItems = [
        {path:'/history',label:'History', icon:<FaHistory/>},
        {path:'/liked',label:'Liked Videos', icon:<FaThumbsUp/>},
        {path:'/watch-later',label:'Watch Later', icon:<FaClock/>},
    ]

    const exploreItems = [
        { path: '/gaming', label: 'Gaming', icon: <FaGamepad /> },
        { path: '/music', label: 'Music', icon: <FaMusic /> },
        { path: '/news', label: 'News', icon: <FaNewspaper /> }
      ];

      const renderMenuItems = (items)=>{
        return items.map((item)=>{
            <Link key={item.path} to={item.path} 
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path) 
                  ? 'bg-gray-200 font-medium' 
                  : 'hover:bg-gray-100'
              }`}>
            <span className='text-gray-700 mr-5'>{item.icon}</span>
            {isOpen && <span className='text-gray-800'>{item.label}</span>}
            </Link>
        })
      }
  return (
    <aside className={`bg-white h-screen fixed left-0 top-14 transition-all duration-300 shadow-md z-10 ${
        isOpen ? 'w-64' : 'w-20'
      } overflow-y-auto pb-20`}>
    <div className='flex flex-col py-2'>
        <div className='mb-4'>{renderMenuItems(menuItems)}</div>
        {isOpen && (
            <>
            <div className='border-t border-gray-200 pt4 mb-4'>
                <h3 className='px-4 text-gray-400 font-medium mb-2 text-sm'>LIBRARY</h3>
                {renderMenuItems(libraryItems)}
            </div>
            <div className='border-t border-gray-200 pt4 mb-4'>
                <h3 className='px-4 text-gray-400 font-medium mb-2 text-sm'>EXPLORE</h3>
                {renderMenuItems(exploreItems)}
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4 px-4 text-sm text-gray-500">
                <p>© 2025 Streamsphere</p>
            </div>
            </>
        )}
    </div>
    </aside>
  )
}

export default Sidebar