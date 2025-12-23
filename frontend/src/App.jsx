import React from 'react'
import { Button } from './components/ui/button'
import MainRoute from './Routes/MainRoute'
import Sidebar from './components/Sidebar'

const App = () => {
  return (
    <div className='flex h-screen  w-full'>
        <Sidebar />
     <MainRoute/>

    </div>
  )
}

export default App