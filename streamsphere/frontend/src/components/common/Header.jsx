import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { FaBars, FaSearch, FaVideo, FaUser, FaBell } from 'react-icons/fa';

const Header = ({toggleSidebar}) => {

    
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const handleSearch = (e)=>{
        e.preventDefault();

    }

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white shadow-md sticky top-0 z-10">
      {/* Left section */}
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="p-2 mr-2 rounded-full hover:bg-gray-200"
        >
          <FaBars className="text-gray-700" />
        </button>
        <Link to="/" className="flex items-center">
          <div className="text-red-600 font-bold text-2xl">StreamSphere</div>
        </Link>
      </div>

      {/* Center section - Search */}
      <div className="flex-1 max-w-2xl mx-4">
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:border-blue-500"
          />
          <button 
            type="submit"
            className="px-6 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-200"
          >
            <FaSearch className="text-gray-700" />
          </button>
        </form>
      </div>

      {/* Right section */}
      <div className="flex items-center">
        {isLoggedIn ? (
          <>
            <Link to="/upload" className="p-2 mx-2 rounded-full hover:bg-gray-200">
              <FaVideo className="text-gray-700" />
            </Link>
            <button className="p-2 mx-2 rounded-full hover:bg-gray-200">
              <FaBell className="text-gray-700" />
            </button>
            <Link to="/profile" className="p-2 mx-2 rounded-full hover:bg-gray-200">
              <FaUser className="text-gray-700" />
            </Link>
          </>
        ) : (
          <Link 
            to="/login"
            className="flex items-center px-4 py-2 mx-2 border border-blue-500 text-blue-500 rounded-full hover:bg-blue-50"
          >
            <FaUser className="mr-2" />
            Sign In
          </Link>
        )}
      </div>
    </header>

  )
}

export default Header