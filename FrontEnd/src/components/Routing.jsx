import React from 'react'
import {Routes,Route } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import ProfilePage from '../pages/ProfilePage'

const Routing = () => {
  return (
    <div>
      
        <Routes>
            <Route path='/' element={<HomePage/>}></Route>
            <Route path='/loginpage' element={<LoginPage/>}></Route>
            <Route path='/profilepage' element={<ProfilePage/>}></Route>
            {/* <Route path='/login' element={<LoginPage/>}></Route> */}
        </Routes>
      
    </div>
  )
}

export default Routing

