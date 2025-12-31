import React from 'react'
import { Button } from './components/ui/button'
import MainRoute from './Routes/MainRoute'
import Sidebar from './components/Sidebar'
import { useLocation } from 'react-router-dom'

const App = () => {
  const location = useLocation()
  const hiddenRoutes=['/','/login', '/register']

  const shouldHide = hiddenRoutes.includes(location.pathname)
 
  return (
    <div className='flex h-screen  w-full'>
       {!shouldHide&& <Sidebar/>}
     <MainRoute/>

    </div>
  )
}

export default App