import React, {useState} from 'react'
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/uploadFile';
import axios from 'axios';
import toast from 'react-hot-toast';


const RegisterPage = () => {
    const [data,setData] = useState({
        name : "",
        email : "",
        password : "",
        profile_pic : ""
    })
    const [uploadPhoto,setUploadPhoto] = useState("")
    const Navigate = useNavigate()

    const handleOnChange =(e)=>{
        const {name,value} =e.target //reminder, this is not user name, this is label/form input name

        setData((preve)=>{
            return{
                ...preve,
                [name] : value
            }
        })
    }

    const handleUploadPhoto = async (e) => {
        const file = e.target.files[0]

        const uploadPhoto = await uploadFile(file) //don't get confuse here, this is not related to setting up variable, its just a const to update profilepic

        setUploadPhoto(file)

        setData((preve)=>{
            return{
                ...preve,
                profile_pic : uploadPhoto?.url
            }
        })


    }

    const handleClearUploadPhoto = (e) => {
        e.stopPropagation() //prevent an event from bubbling up to parent elements, stopping it from triggering any other event listeners on those elements.
        e.preventDefault() //prevent the default action associated with an event from occurring, such as preventing a form submission or a link from navigating.
        setUploadPhoto(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/register`

        try {
            const response = await axios.post(URL,data)
            console.log("response",response) // object returned by the axios.post() method. It contains the full response from the server after making the HTTP request.
            toast.success(response.data.message) //response.data: This is the body of the response, which is typically the actual data sent by the server. 
             // This is a field where the server may include a message describing the result of the request, such as "Data saved successfully" or "An error occurred."
            if(response.data.success){ //success is boolean, and if it is true
                setData({
                    name : "", //since we want data to get blank once we enter Register
                    email : "",
                    password : "",
                    profile_pic : ""
                })
                
                Navigate('/email')

            }
        } catch (error){ //We can't use response?.data?.message directly because response only exists in a successful axios request, not in an error.
            toast.error(error?.response?.data?.message) //? because if this field is not available then it will show error
        } //The ?. (optional chaining) ensures that if any part of the object path doesn't exist (for example, if there's no response or data), it won't throw an error. Instead, it will return undefined, preventing the app from crashing.

        console.log("data",data) 
    } 
  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto'>
        <h3>Welcome to Chat app!</h3>

        <form className='grid gap-4 mt-5' onSubmit={handleSubmit}>
            <div className='flex flex-col gap-1'>
                <label htmlFor='name'>Name :</label>
                <input type='text' id='name' name='name' placeholder='Enter your Name' 
                className='bg-slate-100 px-2 py-1 focus:outline-primary'
                    value={data.name} onChange={handleOnChange}
                    required
                />
            </div>

            <div className='flex flex-col gap-1'>
                <label htmlFor='email'>Email :</label>
                <input type='email' id='email' name='email' placeholder='Enter your Email' 
                className='bg-slate-100 px-2 py-1 focus:outline-primary'
                    value={data.email} onChange={handleOnChange}
                    required
                />
            </div>

            <div className='flex flex-col gap-1'>
                <label htmlFor='password'>Password :</label>
                <input type='password' id='password' name='password' placeholder='Enter your Password' 
                className='bg-slate-100 px-2 py-1 focus:outline-primary'
                    value={data.password} onChange={handleOnChange}
                    required
                />
            </div>

            <div className='flex flex-col gap-1'>
                <label htmlFor='profile_pic'>Photo :
                    <div className='h-14 bg-slate-200 flex justify-center items-center border rounded hover:border-primary cursor-pointer'>
                        <p className='text-sm max-w-[300px] text-ellipsis line-clamp-1'>
                        {uploadPhoto?.name ? uploadPhoto.name : "Upload Profile Photo"}
                        </p>
                        {
                            uploadPhoto?.name && (
                                <button className='text-lg ml-2 hover:text-red-600' onClick={handleClearUploadPhoto}>
                                    <IoMdClose />
                                </button>
                            )
                        }
                        
                    </div>
                </label>
                <input type='file' id='profile_pic' name='profile_pic' 
                className='bg-slate-100 px-2 py-1 focus:outline-primary hidden'
                onChange={handleUploadPhoto}
                />
            </div>

            <button className='bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide'>
                Register
            </button>
        </form>

        <p className='my-3 text-center'>Already have account? <Link to= {"/email"} className='hover:text-primary font-semibold'>Login</Link></p>
      </div>
    </div>

    
  )
}

export default RegisterPage
