import axios from 'axios'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { logout, setOnlineUser, setUser, setSocketCoonection } from '../redux/userSlice'
import Sidebar from '../components/Sidebar'
import { useDispatch } from 'react-redux'
import logo from '../assets/logo.png'
import io from 'socket.io-client'

const Home = () => {
    const user = useSelector(state => state.user)
    const dispatch =useDispatch()
    const navigate = useNavigate()
    const location = useLocation()

  const fetchUserDetails = async()=>{
    try {
        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`
        const response = await axios({
        url : URL,
        withCredentials : true
  })

  dispatch(setUser(response.data.data))

  if(response.data.data.logout){
    dispatch(logout())
    navigate("/email")
  }

  console.log("current user Details",response)
} catch (error){
    console.log("error",error)
}
  }
useEffect(()=>{
  fetchUserDetails() // function is called right after the component is initially rendered.
},[])

/**socket connection */
useEffect(()=>{
  const socketConnection = io(process.env.REACT_APP_BACKEND_URL,{ //io() is the function from Socket.IO that establishes the connection with the server.
    auth : {
      token : localStorage.getItem('token') //The auth option is used to send a JWT token (from localStorage) to authenticate the user on the server. This allows the server to verify the user's identity and maintain the connection.
    }
  })

  socketConnection.on('onlineUser',(data)=>{ //The socketConnection.on('onlineUser', ...) listens for an event called 'onlineUser' sent by the server.
    console.log(data) //When the event is received, it triggers the callback function with data (which could be a list of online users or any relevant data sent by the server
    dispatch(setOnlineUser(data)) //dispatches an action to update the Redux store with the list of online users, so the application state can be updated and other components can react to the change.
  })

  dispatch(setSocketCoonection(socketConnection))

  return ()=>{
    socketConnection.disconnect() //This cleanup function ensures that when the component is removed from the DOM, the WebSocket connection is also gracefully closed.
  }
},[])


const basePath = location.pathname === '/'
//console.log("location",location)

  return (
    <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <Sidebar/>
      </section>

      {/**MESSAGE COMPONENT */}
      <section className={`${basePath && "hidden"}`}>
        <Outlet/>
      </section>

      <div className={` justify-center items-center flex-col gap-2 hidden ${!basePath ? "hidden" : "lg:flex" }`}>
        <div >
          <img src={logo} width={300} alt='logo'/>
        </div>
        <p className='text-lg mt-2 text-slate-500'>Select user to send message</p>
      </div>
    </div>
  )
}


export default Home
