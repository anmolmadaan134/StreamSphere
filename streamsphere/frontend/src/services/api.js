import axios from 'axios'
import { getToken } from '../utils/helper'

const API_URL = "http://localhost:5000/api"

//Creating axios instance with base configuration

const api = axios.create({
    baseURL:API_URL,
    headers:{
        'Content-Type':'application/json'
    }
})

// Add request interceptors to attach auth token
api.interceptors.request.use(
    (config)=>{
        const token = getToken();
        if(token){
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error)=>{
        return Promise.reject(error);
    }
)

//Adding response interceptors to take care of common errors

api.interceptors.response.use(
    (response)=>{
        return response.data;
    },
    (error)=>{
        if(error.response){
            //request was made and the server responded with a status code

            const {status,data} = error.response;

            if(status===401){
                //handle unauthorized errors
                localStorage.removeItem('token');
                window.location.href = '/login'
            }

            return Promise.reject(data)
        }
        else if(error.request){
            //The request was made but no response was received
            return Promise.reject({message:'Server not responding. Please try again later. '})
        }else{
            return Promise.reject({message:'An unexpected error occurred'});
        }
    }
)

export default api;