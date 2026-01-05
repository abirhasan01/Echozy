import axios from "axios";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {


    const [token, setToken] = useState(localStorage.getItem("token"))
    const [authUser, setAuthUser] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [socket, setSocket] = useState(null)

    const checkAuth = async () => {
        try {
            const {data} = await axios.get(backendUrl + "/api/auth/check")

            if(data.success){
                setAuthUser(data.user)
                connectSocket(data.user)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // user login and register
    const login = async (state, credentials) => {
        try {
            const { data } = await axios.post(backendUrl + `/api/auth/${state}`, credentials,)
            if(data.success){
                setAuthUser(data.userData)
                connectSocket(data.userData)
                setToken(data.token)
                localStorage.setItem("token", data.token)
                toast.success(data.message)
            }else {
                toast.error(data.message)
            }
            
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    // logout user and disconnect socket
    const logout = async () => {
        localStorage.removeItem("token")
        setToken(null)
        setAuthUser(null)
        setOnlineUsers("")
        axios.defaults.headers.common["token"] = null
        toast.success("Logged out successfully")
        socket.disconnect();
    }

    // update user profile
    const updateProfile = async (body) => {
        try {
            const { data } = await axios.put(backendUrl + "/api/auth/update-profile", body)
            if(data.success){
                setAuthUser(data.user)
                toast.success("Profile updated successfully")
            }
            
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    // connect socket fn to handle socket connection and online users updates
    const connectSocket = (userData) => {
        if(!userData || socket?.connected) return

        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id
            }
        })
        newSocket.connect()
        setSocket(newSocket)

        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds)
        })
    }

    useEffect(() => {
        if(token){
            axios.defaults.headers.common["token"] = token
        }
        checkAuth()
    },[])

    const value = {
      backendUrl,
      authUser, setAuthUser,
      onlineUsers, setOnlineUsers,
      socket, setSocket,
      login,
      logout,
      updateProfile,
    };
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext