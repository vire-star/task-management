import { userStore } from '@/store/userStore'
import { Pencil } from 'lucide-react'
import React from 'react'

const Settings = () => {
    const user = userStore((state)=>state.user)
    console.log(user)
  return (
    <div className='h-screen w-full  flex items-center justify-start pt-5 flex-col mx-[8%] overflow-y-auto'>
        <div className='h-[20vh] w-full pb-6  border-b border-zinc-400 flex items-center gap-4 justify-start'>
            <div className='h-[20vh] w-[20vh] rounded-full bg-green-600 relative'>
                <Pencil fill='gray' className='absolute top-5 cursor-pointer right-0'/>

                <img src={user.avatarUrl} className='h-full w-full rounded-full object-cover' alt="" />


            </div>

            <h1 className='text-xl font-stretch-50% capitalize text-slate-400'>{user.name}</h1>

        </div>
        <div  className='w-full h-full bg-yellow-600 '>
            

        </div>
    </div>
  )
}

export default Settings