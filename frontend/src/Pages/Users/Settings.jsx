import { useGetAllWorkshopHook, useGetTotalMemberInWorkshopHook } from '@/hooks/workshopHook'
import { userStore } from '@/store/userStore'
import { Pencil } from 'lucide-react'
import React, { useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useGetTaskAssignedToUser } from '@/hooks/task.hook'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const Settings = () => {
    const user = userStore((state)=>state.user)
    const {data} = useGetAllWorkshopHook()
    const [Id, setId] = useState("")
    const [userId, setuserId] = useState("")
    const {data:totalMember} = useGetTotalMemberInWorkshopHook(Id)
    // console.log(totalMember)
    const {data:taskAssignedToUser} = useGetTaskAssignedToUser(userId)
    console.log(taskAssignedToUser)
    const WorkshopMember=(id)=>{
      setId(id)
    }
    // console.log(Id)
    const getMemberId=(id)=>{
      setuserId(id)
    }
  return (
    <div className='h-screen w-full  flex items-center justify-start  flex-col px-9 pt-9 overflow-y-auto'>
        <div className='h-[20vh] w-full pb-6  border-b border-zinc-400 flex items-center gap-4 justify-start'>
            <div className='h-[20vh] w-[20vh] rounded-full bg-green-600 relative'>
                <Pencil fill='gray' className='absolute top-5 cursor-pointer right-0'/>

                <img src={user?.avatarUrl} className='h-full w-full rounded-full object-cover' alt="" />


            </div>

            <h1 className='text-xl font-stretch-50% capitalize text-slate-400'>{user?.name}</h1>

        </div>
        <div  className='w-full h-full  py-9 '>
          <Accordion type="single" collapsible className="w-full space-y-2">
  {data?.workshops?.map((item, index) => (
    <AccordionItem
      key={item._id || index}
      onClick={()=>WorkshopMember(item._id)}
      value={`workshop-${index}`}
      className="border border-slate-200 rounded-lg bg-white shadow-sm"
    >
      <AccordionTrigger className="px-4 py-3 text-sm font-semibold text-slate-800 hover:no-underline">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {item.name}
        </div>
      </AccordionTrigger>

     <AccordionContent className="px-4 pb-4 text-sm text-slate-600">
  <div className="space-y-3">
    
    <p className="text-xs font-medium text-slate-500">
      Total Users: {totalMember?.allMember?.length || 0}
    </p>

   <Popover className="space-y-2">
    <PopoverContent>
      afd
    </PopoverContent>
    <PopoverTrigger className="space-y-2">
       <div className="space-y-2">
      {totalMember?.allMember?.map((member) => (
        <div
        onClick={()=>getMemberId(member?.userId?._id)}
          key={member._id}
          className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-md px-3 py-2"
        >
          <p className="text-sm font-semibold text-slate-900 capitalize truncate">
            {member.userId?.name || "Unknown User"}
          </p>

          <span className="text-xs text-slate-500 capitalize">
            {member.role}
          </span>
        </div>
      ))}
    </div>

    </PopoverTrigger>
   </Popover>
    <button className="text-xs font-medium text-slate-500 hover:text-slate-700">
      Settings
    </button>

  </div>
</AccordionContent>

    </AccordionItem>
  ))}
</Accordion>


            

        </div>
    </div>
  )
}

export default Settings