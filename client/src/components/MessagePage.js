import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import Avatar from './Avatar'
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link } from 'react-router-dom';
import { FaAngleLeft } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import uploadFile from '../helpers/uploadFile';
import { IoClose } from "react-icons/io5";
import Loading from './Loading';
import backgroundImage from '../assets/wallpaper.jpg';
import { IoMdSend } from "react-icons/io";
import moment from 'moment';

const MessagePage = () =>{
  const params = useParams() //retrieve URL parameters, specifically the userId //is used to get dynamic parameters from the URL. //it is retrieving the userId of the other user from the URL. //If the URL is /messages/12345, params.userId would be "12345".
  const socketConnection = useSelector(state => state?.user?.socketConnection)
  const user = useSelector(state => state?.user) //when we refreshing the home message tab with user info, it goes away. to keep it there we are adding this.
  const [dataUser,setDataUser] = useState({ //this one is to display data on home message page 
      name : "", //This state stores the details of the other user (the one the current user is messaging).
      email : "", //Initially, it's empty but will later be updated with real data.
      profile_pic : "",
      online : false,
      _id : ""
  }) 
  const [openImageVideoUpload,setOpenImageVideoUpload] = useState(false)
  const [message, setMessage] = useState({ //adding here the data fields which setup in backend message page
      text : "",
      imageUrl : "",
      videoUrl : ""
  })

  const [loading,setLoading] = useState(false) //is used to track if messages are being fetched.
  const [allMessage,setAllMessage] = useState([]) //to display all th messages // is an array that stores all messages between the current user and the other user.
  const currentMessage = useRef() //useRef() creates a reference (currentMessage) that can be attached to a DOM element.

  useEffect(()=>{ //triggers whenever allMessage changes.
      if(currentMessage.current){
        currentMessage.current.scrollIntoView({behavior : 'smooth', block : 'end' }) //If currentMessage.current exists, it automatically scrolls to the last message for a smooth chat experience.
      }
  },[allMessage])

  const handleUploadImageVideoOpen = () =>{ //when we click on plus it will open/close
    setOpenImageVideoUpload(preve => !preve)
  }

  const handleUploadImage = async(e) => {
    const file = e.target.files[0]
        setLoading(true) //This can be used to show a loading spinner or disable the upload button
        const uploadPhoto = await uploadFile(file) 
        setLoading(false)
        setOpenImageVideoUpload(false) //If the image was uploaded inside a modal or popup, this line ensures it closes after the upload is done.
        setMessage(preve =>{
          return{
            ...preve,
            imageUrl : uploadPhoto.url //It then adds/updates the imageUrl field with the uploaded image URL.
          }
        })
  }

  const handleClearUploadImage = ()=>{
    setMessage(preve =>{
      return{
        ...preve,
        imageUrl : ""
      }
    })
  }

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0]
        setLoading(true)
        const uploadPhoto = await uploadFile(file) 
        setLoading(false)
        setOpenImageVideoUpload(false)
        setMessage(preve =>{
          return{
            ...preve,
            videoUrl : uploadPhoto.url
          }
        })
  }

  const handleClearUploadVideo = ()=>{
    setMessage(preve =>{
      return{
        ...preve,
        videoUrl : ""
      }
    })
  }

  useEffect(()=>{ //useEffect runs when socketConnection, params?.userId, or user changes.
    if(socketConnection){
      socketConnection.emit('message-page',params.userId) //ends an event ('message-page') to the server with the userId from the URL. This tells the server: "Send me the conversation history with this user."

      socketConnection.emit('seen',params.userId) //Sends a 'seen' event to notify the server that messages from this user have been viewed.

      socketConnection.on('message-user', (data)=>{ //data we are getting after finding from backend
        setDataUser(data) //Updates the dataUser state with this information.
      })

      socketConnection.on('message',(data)=>{ //Listens for 'message' event from the server.
        console.log('message data',data) //data contains an array of messages between the logged-in user and the selected user.
        setAllMessage(data) //Updates allMessage state, triggering a re-render to show new messages.
      })
    }
  },[socketConnection,params?.userId, user])

  const handleOnChange = (e)=>{
      const {name,value} = e.target

      setMessage(preve => {
        return {
          ...preve,
          text : value
        }
      })
  }

  const handleSendMessage =(e)=>{
      e.preventDefault()

      if(message.text || message.imageUrl || message.videoUrl){   //if user has provide text or image or video then
          if(socketConnection){
            socketConnection.emit('new message' ,{
              sender : user?._id,
              receiver : params.userId, //sending all this data from frontend side side, go to socket now for further process
              text : message.text,
              imageUrl : message.imageUrl,
              videoUrl : message.videoUrl,
              msgByUserId : user?._id
            })
            setMessage({
                text : "",
                imageUrl : "",
                videoUrl : ""
          })
          }
      } 
  }

  return (
    <div style={{ background: `url(${backgroundImage})` }}>
      <header className='sticky top-0 h-16 bg-white flex justify-between items-center px-4'>
      <div className='flex items-center gap-4'>
      <Link to={"/"} > 
        <FaAngleLeft size={20}/>
      </Link>
      <div>
        <Avatar
          width = {50}
          height = {50}
          imageUrl={dataUser?.profile_pic}
          name = {dataUser?.name}
          userId = {dataUser?._id}
        />
      </div>
      <div>
        <h3 className='font-semibold text-lg my-0 text-ellipsis line-clamp-1'>{dataUser?.name}</h3>
        <p className=' -my-2 text-sm'>
          {
            dataUser.online ? <span className='text-primary'>online</span> : <span className='text-slate-400'>offline</span>
          }
        </p>
      </div>
      </div>

      <div>
      <button className='cursor-pointer hover:text-primary'>
      <BsThreeDotsVertical/>
      </button>    
      </div>
      </header>

      {/**show all messages */}
      <section className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-opacity-50'>
      
            
        {/**all message show here */}
        <div className='flex flex-col gap-2 py-2 mx-2' ref={currentMessage}>
          {
            allMessage.map((msg,index)=>{ //Maps over allMessage array, creating a div for each message
              return(
                <div className={`p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${user._id === msg.msgByUserId ? "ml-auto bg-teal-100" : "bg-white"}`}> {/**we want to understand which msg id send by me and which is received so that we can adjust messages left or right */}
                    <div className='w-full'>
                    {
                      msg?.imageUrl && (
                        <img src={msg?.imageUrl} className='w-full h-full object-scale-down'/>
                      )}
                  </div>
                  <div className='w-full'>
                    {
                      msg?.videoUrl && (
                        <video  src={msg.videoUrl} className='w-full h-full object-scale-down' controls />
                      )}
                  </div>
                  <p className='px-2'>{msg.text}</p>
                  <p className='text-xs ml-auto w-fit'>{moment(msg.createdAt).format('hh:mm')}</p>
                </div>
              )
            })
          }
        </div>

                {/**upload Image display */}
                {
              message.imageUrl && (
                <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
                <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600' onClick={handleClearUploadImage}>
                <IoClose size={30}/>
                </div>
                <div className='bg-white p-3'>
                  <img src={message.imageUrl} alt='UploadImage'className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'/>
                </div>
            </div>)
            }

            {/**upload Video display */}
            {
              message.videoUrl && (
                <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
                <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600' onClick={handleClearUploadVideo}>
                <IoClose size={30}/>
                </div>
                <div className='bg-white p-3'>
                  <video src={message.videoUrl} className='aspect-square w-full h-full max-w-sm m-2 object-scale-down' controls muted autoPlay/>
                </div>
            </div>)
            }

            {
              loading && (
                <div className='w-full h-full flex sticky bottom-0 justify-center items-center' ><Loading/></div>
              )
            }

      </section>

      {/**send message */}
      <section className='h-16 bg-white flex items-center px-4'>
          <div className='relative'>
            <button onClick={handleUploadImageVideoOpen} className=' flex justify-center items-center w-11 h-11 rounded-full hover:bg-primary hover:text-white'>
              <FaPlus size={20} />
            </button>

      {/** video and image*/}
      {
        openImageVideoUpload && (
          <div className='bg-white shadow rounded absolute bottom-14 w-36 p-2'>
          <form>
            <label htmlFor='uploadImage' className='flex items-center p-2  px-3 gap-3 hover:bg-slate-200 cursor-pointer'>
              <div className='text-primary'>
              <FaImage size={18}/>
              </div>
              <p>Image</p>
              </label>

              <label htmlFor='uploadVideo' className='flex items-center p-2  px-3 gap-3 hover:bg-slate-200 cursor-pointer'>
              <div className='text-primary'>
              <FaVideo size={18}/>
              </div>
              <p>Video</p>
              </label>

              <input type='file' id='uploadImage' onChange={handleUploadImage} className='hidden'/>
              <input type='file' id='uploadVideo' onChange={handleUploadVideo} className='hidden'/>
          </form>

          </div>
        )
      }
          
          </div>
          {/**input box */}
          <form className='h-full w-full flex gap-2' onSubmit={handleSendMessage}>
            <input type='text' placeholder='Type here message...' className='py-1 px-4 outline-none w-full h-full' value={message.text} onChange={handleOnChange}/>
            <button className='text-primary hover:text-secondary'>
            <IoMdSend size={28}/>
            </button>
          </form>

      </section>
    </div>
  )
}

export default MessagePage
