import Login from '@/Pages/Auth/Login'
import Register from '@/Pages/Auth/Register'
import Home from '@/Pages/Users/Home'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { ProtectRoute } from './ProtectRoute'
import SingleTask from '@/Pages/Users/SingleTask'
import Settings from '@/Pages/Users/Settings'
import AcceptInvitation from '@/Pages/Users/Accept-Invitation'
import MyFiles from '@/Pages/Users/MyFiles'
import HomePage from '@/Pages/Users/HomePage'

const MainRoute = () => {
  return (
    <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/workshops' element={
          <ProtectRoute>
            <Home/>
          </ProtectRoute>
        }/>
        <Route path='/setting' element={
          <ProtectRoute>
            <Settings/>
          </ProtectRoute>
        }/>
        <Route path='/accept-invite/:id' element={
          <ProtectRoute>
            <AcceptInvitation/>
          </ProtectRoute>
        }/>
        <Route path='/singleTask/:id' element={
          <ProtectRoute>
            <SingleTask/>
          </ProtectRoute>
        }/>
        <Route path='/file' element={
          <ProtectRoute>
            <MyFiles/>
          </ProtectRoute>
        }/>
    </Routes>
  )
}

export default MainRoute