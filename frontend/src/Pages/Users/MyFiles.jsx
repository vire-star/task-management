import { useGetPrivateFileHook } from '@/hooks/file.hook'
import { Ellipsis, EllipsisVertical } from 'lucide-react'
import React from 'react'

const MyFiles = () => {
    const {data} = useGetPrivateFileHook()
    console.log(data)
  return (
    <div className='h-screen w-full bg-purple-600 p-9'>

        {
            data?.map((item,index)=>{
                return(
        //             <div key={index} className='w-40 h-48 border border-slate-200 rounded-lg bg-slate-50 flex flex-col overflow-hidden shadow-sm'>
        //         <div className="flex-1 bg-slate-100 flex items-center justify-center">
        //   <span className="text-4xl">📄</span>
        // </div>
        //  <div className="px-3 py-2 border-t border-slate-200 flex items-center justify-between">
        //  <div>
        //      <p className="text-xs font-semibold text-slate-800 truncate">
        //     {item.name || "Attachment"}
        //   </p>
        //   <button
        //     onClick={() => window.open(item.url, "_blank")}
        //     className="mt-1 w-full text-[11px] font-medium text-purple-600 hover:text-purple-700"
        //   >
        //     Open PDF
        //   </button>
        //  </div>
        //   <EllipsisVertical/>
        // </div>

        //     </div>
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

    <EllipsisVertical
      size={18}
      className="text-slate-600 cursor-pointer hover:text-slate-800"
    />
  </div>
</div>
                )
            })
        }
       

            

        </div>
   
  )
}

export default MyFiles