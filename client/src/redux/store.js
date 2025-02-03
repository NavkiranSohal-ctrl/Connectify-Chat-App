import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'

export const store = configureStore({ //creating a Redux store
  reducer: {user : userReducer}, //the reducer being applied to the state slice named user is userReducer. This userReducer would be responsible for handling actions related to the user data in your application (e.g., logging in, logging out, updating user details).
})

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

