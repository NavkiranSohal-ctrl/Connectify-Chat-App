import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  _id : "",
    name : "",
  email : "",
  profile_pic : "",
  token : "",
  onlineUser : [],
  socketConnection : null
}

export const userSlice = createSlice({
  name: 'user', //This defines the name of the slice. It’s used to identify this part of the state in the Redux store.
  initialState, //This is the initial state for the slice. It typically contains default values for the data that will be managed by this slice (like _id, name, email, and profile_pic for the user).
  reducers: {
    setUser : (state,action)=>{
        state._id = action.payload._id
        state.name = action.payload.name
        state.email= action.payload.email     
        state.profile_pic= action.payload.profile_pic
    },
    setToken : (state,action)=>{
        state.token = action.payload
    },
    logout : (state,action)=>{
        state._id = ""
        state.name = ""
        state.email= ""     
        state.profile_pic= ""
        state.token =""
        state.socketConnection = null
    },
    setOnlineUser : (state,action)=>{
      state.onlineUser = action.payload
    },
    setSocketCoonection : (state,action)=>{
      state.socketConnection = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setUser, setToken,  logout, setOnlineUser, setSocketCoonection } = userSlice.actions

export default userSlice.reducer