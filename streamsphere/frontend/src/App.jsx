
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VideoPage from './pages/VideoPage';
import Upload from './pages/Upload';
import { useState } from 'react';


function App() {

  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
    <div className='flex flex-col min-h-screen'>
      <Header toggleSidebar={toggleSidebar}/>
      <div className='flex flex-1'>
      <Sidebar isOpen={sidebarOpen}/>
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
      <div className="container mx-auto px-4 py-4">
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/video/:id' element={<VideoPage/>}/>
          <Route path='/upload' element={<Upload/>}/>
        </Routes>
      </div>
      </main>
      </div>
    
      
    </div>
    </Router>
  )
}

export default App
