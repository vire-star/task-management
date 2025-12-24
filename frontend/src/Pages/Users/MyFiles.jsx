import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useGetPrivateFileHook } from '@/hooks/file.hook'
import { DeleteIcon, Ellipsis, EllipsisVertical } from 'lucide-react'
// import { PopoverContent } from 'node_modules/@radix-ui/react-popover/dist'
import React from 'react'

const MyFiles = () => {
    const {data} = useGetPrivateFileHook()
    console.log(data)
  return (
    <div className='h-screen w-full  p-9'>


        <div className='flex items-center justify-between h-[12vh] w-full  border-b border-zinc-400 mb-6 '>
            <h1 className='font-medium'>My Files</h1>

            <button className='px-6 py-2 rounded-md bg-zinc-900 text-zinc-50'>
                Add File +
            </button>
        </div>
        {
            data?.map((item,index)=>{
                return(
       
        <div
  key={index}
  className="w-40 h-48 border border-slate-200 rounded-lg bg-slate-50 flex flex-col overflow-hidden shadow-sm"
>
  {/* Preview */}
  <div className="flex-1 bg-slate-100 flex items-center justify-center">
    <span className="text-4xl">📄</span>
  </div>

  {/* Footer */}
  <div className="px-3 py-2 border-t border-slate-200 flex items-center justify-between gap-2">
    <div className="flex-1 min-w-0">
      <p className="text-xs font-semibold text-slate-800 truncate">
        {item.name || "Attachment"}
      </p>
      <button
        onClick={() => window.open(item.url, "_blank")}
        className="mt-1 text-[11px] font-medium text-purple-600 hover:text-purple-700"
      >
        Open PDF
      </button>
    </div>

<Popover>
    <PopoverContent className='flex items-center justify-start w-fit px-8 gap-4 text-red-600 cursor-pointer'>
        Delete 
        <DeleteIcon size={18} />
    </PopoverContent>
    <PopoverTrigger>
<EllipsisVertical
      size={18}
      className="text-slate-600 cursor-pointer hover:text-slate-800"
    />
    </PopoverTrigger>
</Popover>
    
  </div>
</div>
                )
            })
        }
       

            

        </div>
   
  )
}

export default MyFiles