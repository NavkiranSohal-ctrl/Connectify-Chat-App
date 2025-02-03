import React, { Children } from 'react'
import logo from '../assets/logo.png'

const AuthLayouts = ({children}) => {
  return (
    <>
        <header className='flex justify-center items-center py-3 h-50 shadow-md bg-white'>
            <img src = {logo} alt='logo' width ={400} height={300}/>
        </header>

        {children}
    </>
    
  )
}

export default AuthLayouts
