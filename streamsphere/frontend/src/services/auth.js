import api from './api'

export const registerUser = async (userData)=>{
        
    const response = await api.post('/auth/register',userData);
    return response;    
};

export const loginUser = async (credentials)=>{
        
    const response = await api.post('/auth/login',credentials);
    return response;    
};

export const getUserProfile = async ()=>{
        
    const response = await api.get('/users/me');
    return response;    
};

export const logoutUser = ()=>{
        
    localStorage.removeItem('token')
};