import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import {useNavigate} from 'react-router-dom'
import { registerUser } from '../../services/auth'

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        username:'',
        email:'',
        password:'',
        confirmPassword:''
    })

    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const {login} = useContext(AuthContext)
    const navigate = useNavigate()

    const handleChange = (e)=>{
      setFormData({...formData,
        [e.target.name]:e.target.value
      });
    }

    const validate = ()=>{
      const newErrors = {}

      //Vaildating username
      if(!formData.username.trim()){
        newErrors.username = 'Username is required'
      }else if(formData.username.length<3){
        newErrors.username = 'Username must be atleast 3 characters'
      }
    

    //Validating email

    if(!formData.email.trim()){
      newErrors.email = 'Email is required'
    }else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    //Validating Password

    if(!formData.password.trim()){
      newErrors.password = 'Password is required'
    }else if(formData.password.length<6){
      newErrors.password = 'Password must be atleast 6 characters'
    }

    //Validating password confirmation

    if(formData.password !== formData.confirmPassword){
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length===0;
    
    }

    const handleSubmit = async(e) =>{
      e.preventDefault();

      if(validate()){
        setLoading(true);

        try{
          const {confirmPassword, ...userData} = formData

          const data = await registerUser(userData)
          login(data.user,data.token);
          navigate('/')
        }catch (error) {
          setErrors({ form: error.response?.data?.message || 'Registration failed' });
      }finally{
        setLoading(false)
      }
    }

  
}

return (

  <div className='max-w-md mx-auto bg-white p-8 rounded-lg shadow-md'>
    {
      errors.form && (
        <div className='mb-4 bg-red-50 text-red-500 p-3 rounded'>{errors.form}</div>
      )
    }

    <form onSubmit={handleSubmit}>
      <div className='mb-4'>
      <label htmlFor="username" className='block text-gray-700 font-medium mb-2'>
        Username
      </label>
      <input type="text"
      id='username'
      name='username'
      value={formData.username}
      onChange={handleChange}
      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.username ? 'border-red-500 focus:ring-red-200':'border-gray-300 focus:ring-blue-200'}`} />
      {errors.username && <p className='mt-1 text-sm text-red-600'>{errors.username}</p>}
      </div>

      <div>
      <label htmlFor="username" className='block text-gray-700 font-medium mb-2'>
        Email
      </label>
      <input type="email"
      id='email'
      name='email'
      value={formData.email}
      onChange={handleChange}
      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-200':'border-gray-300 focus:ring-blue-200'}`}/>
      {errors.email && <p className='mt-1 text-sm text-red-600'> {errors.email}</p>}
      </div>

      <div>
      <label htmlFor="password" className='block text-gray-700 font-medium mb-2'>
        Password
      </label>
      <input type="password"
      id='password'
      name='password'
      value={formData.password}
      onChange={handleChange}
      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-200':'border-gray-300 focus:ring-blue-200'}`} />
      {errors.password && <p className='mt-1 text-sm text-red-600'>{errors.password}</p>}
      </div>

      <div>
      <label htmlFor="confirmPassword" className='block text-gray-700 font-medium mb-2'>
        Confirm Password
      </label>
      <input type="password"
      id='confirmPassword'
      name='confirmPassword'
      value={formData.confirmPassword}
      onChange={handleChange}
      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-200':'border-gray-300 focus:ring-blue-200'}`} />
      {errors.confirmPassword && <p className='mt-1 text-sm text-red-600'>{errors.confirmPassword}</p>}
      </div>

      <button type='submit' disabled={loading} className='w-full'>
        {loading ?'Creating account...' : 'Create Account'}
      </button>
    </form>
  </div>
)

}


export default RegisterForm;