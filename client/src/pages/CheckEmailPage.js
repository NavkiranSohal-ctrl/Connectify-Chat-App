import React, {useState} from 'react'
import { IoMdClose } from "react-icons/io";
import { Link}  from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { LuCircleUserRound } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/uploadFile';


const CheckEmailPage = () => {
  const [data,setData] = useState({
    email : ""
  })

  const navigate = useNavigate()

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

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/email`

    try {
        const response = await axios.post(URL,data)
        
        toast.success(response.data.message)

        if(response.data.success){ //If the request is successful, it shows a success notification with the message from response.data.message in GREEN COLOR
            setData({  //since we want data to get blank once we enter Register
                email : ""   

            })
            navigate('/password',{
              state: response?.data.data //we want profile pic to be visible when it navigate to email page, transfering data here.
            })

        }
    } catch (error){ //If there is an error (caught in the catch block), it shows an error notification with the message from the server's response or the error details IN RED COLOR
        toast.error(error?.response?.data?.message) //? because if this field is not available then it will show error
    }
} 
  return (
      <div className='mt-5'>
        <div className='bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto'>

        <div className='w-fit mx-auto mb-2'>
          <LuCircleUserRound size={90}/>
        </div>
          <h3>Welcome to Chat app!</h3>
  
          <form className='grid gap-4 mt-5' onSubmit={handleSubmit}>
              <div className='flex flex-col gap-1'>
                  <label htmlFor='email'>Email :</label>
                  <input type='email' id='email' name='email' placeholder='Enter your Email' 
                  className='bg-slate-100 px-2 py-1 focus:outline-primary'
                      value={data.email} onChange={handleOnChange}
                      required
                  />
              </div>

              <button className='bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide'>
                  Let's Go
              </button>
          </form>
  
          <p className='my-3 text-center'>New User? <Link to= {"/register"} className='hover:text-primary font-semibold'>Register</Link></p>
        </div>
      </div>
  
      
    )
  }
export default CheckEmailPage
