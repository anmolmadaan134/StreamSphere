import React, { useContext, useEffect } from 'react'
import LoginForm from '../components/auth/Loginform'
import { AuthContext } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {

  const {user} = useContext(AuthContext)
  const navigate = useNavigate();

  useEffect(()=>{
    if(user){
      navigate('/')
    }
  },[user,navigate])

  return (

    <div className='min-h-screen clex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <Link to='/' className="flex justify-center items-center">
        <div className="bg-red-600 text-white p-2 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l-8 4m0 0l-4-2m4 2v6.5m0-6.5l8-4" />
            </svg>
          </div>
        </Link>
        <h2 className='mt-6 text-center text-3xl font-bold text-gray-600'>Sign in to your account</h2>
      </div>
      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <LoginForm/>
        <div className='mt-6 text-center'>
          <p className='text-sm text-gray-600'>
            Don't have an account?{' '}
            <Link to='/register' className='font-medium text-blue-600 hover:text-blue-500'>Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login