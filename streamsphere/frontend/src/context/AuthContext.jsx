import { createContext, useEffect, useState } from "react";
import { getUserProfile } from "../services/auth";
import { getToken, removeToken, setToken } from "../utils/helper";

export const AuthContext = createContext();

export const AuthProvider = ({children})=>{
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)


    useEffect(()=>{
        const token = getToken()
        if(token){
            fetchUserProfile(token)
        }else{
            setLoading(false)
        }

    },[])

    const fetchUserProfile = async(token)=>{
        try{
            const userData = await getUserProfile(token);
            setUser(userData)
        }
        catch(err){
            setError(err.message);
            removeToken()

        }
        finally{
            setLoading(false);
        }
    
    }

    const login = async(token,userData)=>{
        setToken(token)
        setUser(userData)
    }

    const logout = ()=>{
        removeToken()
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{user,loading,error,login,logout}}>
            {children}
        </AuthContext.Provider>
    )

}