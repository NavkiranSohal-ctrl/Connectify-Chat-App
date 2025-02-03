import React, {useState} from 'react'
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { LuCircleUserRound } from "react-icons/lu";
import { useLocation } from 'react-router-dom';
import Avatar from '../components/Avatar';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';
import { setToken } from '../redux/userSlice';


const CheckPasswordPage = () => {
  
    const [data,setData] = useState({  
      password : ""
    })
    
    const Navigate = useNavigate()
    const location = useLocation() //to use profile pic and name from email route to here
    const dispatch = useDispatch() //used to send that user data to Redux. 

    useEffect(()=>{ //we want user to redirect to email route when someone is trying to skip email and directly want to go to password
      if(!location?.state?.name){
        Navigate('/email')
      }
    },[]) //[] means that the code will only run once, when the component first appears on the screen. This is useful when you want to fetch data, like user information from an API, or perform some action only when the component is first loaded, and not every time it updates
    
    console.log("location",location.state)

    const handleOnChange =(e)=>{
        const {name,value} =e.target

        setData((preve)=>{
            return{
                ...preve,
                [name] : value
            }
        })
    }
    

    const handleSubmit = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/password`

        try {
            const response = await axios({  //this is to create a cookie
              method : 'post',
              url : URL,
              data : {
                userId : location?.state?._id,
                password : data.password
          },
          withCredentials : true
        })
            toast.success(response.data.message)

            if(response.data.success){
              dispatch(setToken(response?.data?.token)) //used to send that user data to Redux.  //It dispatches an action to update the Redux store by calling dispatch(setToken(response?.data?.token)). This stores the user's token in the global state managed by Redux, so it can be used throughout the application for things like authentication.
              localStorage.setItem('token', response?.data?.token) //to save in localstoarge too //It saves the same token in the browser's localStorage with localStorage.setItem('token', response?.data?.token). This is done so that the token persists even if the page is refreshed, allowing the user to stay logged in across sessions.
                setData({
                    password : "",
                })
                
                Navigate('/')

            }
        } catch (error){
            toast.error(error?.response?.data?.message) //? because if this field is not available then it will show error
        }

        console.log("data",data) 
    } 
    return (
        <div className='mt-5'>
          <div className='bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto'>
          <div className='w-fit mx-auto mb-2 flex justify-center items-center flex-col'>
            <Avatar 
            width={70}
              height={70}
              name={location?.state?.name}
              imageUrl={location?.state?.profile_pic}
            />
            <h2 className='font-semibold text-lg mt-1'>{location?.state?.name}</h2>
          </div>
            <h3>Welcome to Chat app!</h3>
    
            <form className='grid gap-4 mt-3' onSubmit={handleSubmit}>
    
            <div className='flex flex-col gap-1'>
                <label htmlFor='password'>Password :</label>
                <input type='password' id='password' name='password' placeholder='Enter your Password' 
                className='bg-slate-100 px-2 py-1 focus:outline-primary'
                    value={data.password} onChange={handleOnChange}
                    required
                />
            </div>
    
                <button className='bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide'>
                    Login
                </button>
            </form>
    
            <p className='my-3 text-center'> <Link to= {"/forgot-password"} className='hover:text-primary font-semibold'>Forgot Password ?</Link></p>
          </div>
        </div>
      )
    }
    


export default CheckPasswordPage
