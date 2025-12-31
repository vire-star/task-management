import React, { useEffect, useState } from "react";
import { useLogoutHook } from "@/hooks/userHooks";
import { useGetInvitedWorkshopHook, useGetMyWorkshopHook } from "@/hooks/workshopHook";
import { workshopStore } from "@/store/workshopStore";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, File, LayoutDashboard, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Notification from "./Notification";
import { userStore } from "@/store/userStore";

// const Sidebar = () => {
//   const { mutate } = useLogoutHook();
//   const { data, isSuccess } = useGetMyWorkshopHook();
//   const { data:invitedWorkshop } = useGetInvitedWorkshopHook();
//   const navigate= useNavigate()
//   const user = userStore((state)=>state.user)

//   const setWorkshop = workshopStore((state) => state.setWorkshop);

//   const logoutHandler = () => {
//     mutate();
//   };

//   const workshopHandler = (item) => {
//     setWorkshop(item);
//   };

  

//   return (
//     <aside className="h-full w-[260px] bg-gradient-to-b from-slate-900 to-slate-950 text-slate-50 flex flex-col border-r border-slate-800">
//       {/* Top: Logo + App name */}
//       <div onClick={()=>navigate('/setting')} className="flex cursor-pointer items-center gap-2 px-4 py-4 border-b border-slate-800">
//         <div  className="h-9 w-9 rounded-xl cursor-pointer bg-purple-500/80 flex items-center justify-center text-lg font-bold shadow-sm">
//           <img src={user?.avatarUrl} className="h-full w-full rounded-xl" alt="" />
//         </div>
//         <div className="flex flex-col">
//           <span className="text-sm font-semibold capitalize tracking-wide">
//             {user?.name}
//           </span>
//           <span className="text-[11px] text-slate-400">
//             Manage your sessions
//           </span>
//         </div>
//       </div>

//       {/* Middle: Workshop selector */}
//       <div className="px-4 py-4 space-y-4 flex-1 overflow-y-auto">
//         <div className="space-y-2">
//           <p  onClick={()=>navigate('/workshops')}  className="text-xs font-medium text-slate-400 uppercase flex items-center justify-start  gap-2 cursor-pointer">
//             <LayoutDashboard size={15}/> Workshop
//           </p>

//           <Popover>
//             <PopoverTrigger asChild>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="w-full justify-between bg-slate-900/60 border-slate-700 text-slate-100 hover:bg-slate-800 hover:border-slate-600"
//               >
//                 <span className="truncate">
//                   Select your workshop
//                 </span>
//                 <span className="ml-2 text-xs text-slate-400">
//                   {data?.workshops?.length || 0} available
//                 </span>
//               </Button>
//             </PopoverTrigger>

//             <PopoverContent className="w-72 p-3 bg-slate-900 border-slate-700 shadow-xl">
//               {/* Create workshop dialog */}
//               <div className="flex items-center justify-between mb-3">
//                 <p className="text-xs font-medium text-slate-400 uppercase">
//                   My workshops
//                 </p>

//                 <Dialog>
//                   <DialogTrigger asChild>
//                     <Button
//                       size="xs"
//                       variant="secondary"
//                       className="text-[11px] px-2 py-1 h-7 bg-purple-600 hover:bg-purple-500 text-white"
//                     >
//                       + Create
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent className="sm:max-w-md">
//                     <DialogHeader>
//                       <DialogTitle>Create a new workshop</DialogTitle>
//                       <DialogDescription>
//                         Define a name and basic details for your new workshop.
//                         You can customize it further after creation.
//                       </DialogDescription>
//                     </DialogHeader>
//                     {/* TODO: Add workshop form here */}
//                   </DialogContent>
//                 </Dialog>
//               </div>

//               <div className="max-h-56 space-y-1 overflow-y-auto pr-1">
//                 {data?.workshops?.length ? (
//                   data.workshops.map((item, index) => (
//                     <button
//                       key={index}
//                       onClick={() => workshopHandler(item)}
//                       className="w-full text-left text-sm px-2.5 py-1.5 rounded-md hover:bg-slate-800 text-slate-100 transition-colors"
//                     >
//                       {item.name}
//                     </button>
//                   ))
//                 ) : (
//                   <p className="text-xs text-slate-500">
//                     No workshops found. Create a new one to get started.
//                   </p>
//                 )}
//               </div>

//               <p className="text-xs font-medium text-slate-400 uppercase my-6">Invited Workshop</p>

//                 <div className="max-h-56 space-y-1 overflow-y-auto pr-1">
//                 {invitedWorkshop?.workshops?.length ? (
//                   invitedWorkshop.workshops.map((item, index) => (
//                     <button
//                       key={index}
//                       onClick={() => workshopHandler(item)}
//                       className="w-full text-left text-sm px-2.5 py-1.5 rounded-md hover:bg-slate-800 text-slate-100 transition-colors"
//                     >
//                       {item.name}
//                     </button>
//                   ))
//                 ) : (
//                   <p className="text-xs text-slate-500">
//                     No one added you in any workshop yet
//                   </p>
//                 )}
//               </div>
//             </PopoverContent>
//           </Popover>
//           <p onClick={()=>navigate('/setting')} className="text-xs font-medium text-slate-400 uppercase flex items-center justify-start  gap-2 cursor-pointer">
//             <Settings size={15}/> Settings

//           </p>

//           <Notification/>

//           <p onClick={()=>navigate('/file')} className="text-xs font-medium text-slate-400 uppercase flex items-center justify-start  gap-2 cursor-pointer">
//             <File size={15}/> My files

//           </p>
          
//         </div>

//         {/* Add more sidebar sections here if needed */}
//       </div>

//       {/* Bottom: Logout */}
//       <div className="px-4 py-3 border-t border-slate-800">
//         <Button
         
          
//           onClick={logoutHandler}
//           className="w-full justify-center border-red-500/60 hover:bg-red-600/10 text-red-400 bg-red-500/10 "
//         >
//           Logout
//         </Button>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;


// import React, { useState } from "react";
import { Menu, X } from "lucide-react"; // Hamburger icon

const Sidebar = () => {
  const  clearWorkshop = workshopStore((state)=>state.clearWorkshop)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { mutate } = useLogoutHook();
  const { data, isSuccess } = useGetMyWorkshopHook();
  const { data: invitedWorkshop } = useGetInvitedWorkshopHook();
  const navigate = useNavigate();
  const user = userStore((state) => state.user);
  const setWorkshop = workshopStore((state) => state.setWorkshop);

  const logoutHandler = () =>{
    
    mutate({},{
      onSuccess:()=>{
        clearWorkshop()
      }
    });
  } 
  
  const workshopHandler = (item) => {
    setWorkshop(item);
    setIsMobileMenuOpen(false); // ✅ Mobile menu close karo
  };

  // ✅ Sidebar content ko reusable banao
  const sidebarContent = (
    <>
      {/* Top: Logo + App name */}
      <div
        onClick={() => {
          navigate('/setting');
          setIsMobileMenuOpen(false);
        }}
        className="flex cursor-pointer items-center gap-2 px-4 py-4 border-b border-slate-800"
      >
        <div className="h-9 w-9 rounded-xl cursor-pointer bg-purple-500/80 flex items-center justify-center text-lg font-bold shadow-sm">
          <img src={user?.avatarUrl} className="h-full w-full rounded-xl" alt="" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold capitalize tracking-wide">
            {user?.name}
          </span>
          <span className="text-[11px] text-slate-400">
            Manage your sessions
          </span>
        </div>
      </div>

      {/* Middle: Workshop selector */}
      <div className="px-4 py-4 space-y-4 flex-1 overflow-y-auto">
        <div className="space-y-2">
          <p
            onClick={() => {
              navigate('/workshops');
              setIsMobileMenuOpen(false);
            }}
            className="text-xs font-medium text-slate-400 uppercase flex items-center justify-start gap-2 cursor-pointer"
          >
            <LayoutDashboard size={15} /> Workshop
          </p>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-between bg-slate-900/60 border-slate-700 text-slate-100 hover:bg-slate-800 hover:border-slate-600"
              >
                <span className="truncate">Select your workshop</span>
                <span className="ml-2 text-xs text-slate-400">
                  {data?.workshops?.length || 0} available
                </span>
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-72 p-3 bg-slate-900 border-slate-700 shadow-xl">
              {/* Create workshop dialog */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-slate-400 uppercase">
                  My workshops
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="xs"
                      variant="secondary"
                      className="text-[11px] px-2 py-1 h-7 bg-purple-600 hover:bg-purple-500 text-white"
                    >
                      + Create
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create a new workshop</DialogTitle>
                      <DialogDescription>
                        Define a name and basic details for your new workshop.
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="max-h-56 space-y-1 overflow-y-auto pr-1">
                {data?.workshops?.length ? (
                  data.workshops.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => workshopHandler(item)}
                      className="w-full text-left text-sm px-2.5 py-1.5 rounded-md hover:bg-slate-800 text-slate-100 transition-colors"
                    >
                      {item.name}
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">
                    No workshops found. Create a new one to get started.
                  </p>
                )}
              </div>

              <p className="text-xs font-medium text-slate-400 uppercase my-6">
                Invited Workshop
              </p>

              <div className="max-h-56 space-y-1 overflow-y-auto pr-1">
                {invitedWorkshop?.workshops?.length ? (
                  invitedWorkshop.workshops.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => workshopHandler(item)}
                      className="w-full text-left text-sm px-2.5 py-1.5 rounded-md hover:bg-slate-800 text-slate-100 transition-colors"
                    >
                      {item.name}
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">
                    No one added you in any workshop yet
                  </p>
                )}
              </div>
            </PopoverContent>
          </Popover>

          <p
            onClick={() => {
              navigate('/setting');
              setIsMobileMenuOpen(false);
            }}
            className="text-xs font-medium text-slate-400 uppercase flex items-center justify-start gap-2 cursor-pointer"
          >
            <Settings size={15} /> Settings
          </p>

          <Notification />

          <p
            onClick={() => {
              navigate('/file');
              setIsMobileMenuOpen(false);
            }}
            className="text-xs font-medium text-slate-400 uppercase flex items-center justify-start gap-2 cursor-pointer"
          >
            <File size={15} /> My files
          </p>
        </div>
      </div>

      {/* Bottom: Logout */}
      <div className="px-4 py-3 border-t border-slate-800">
        <Button
          onClick={logoutHandler}
          className="w-full justify-center border-red-500/60 hover:bg-red-600/10 text-red-400 bg-red-500/10"
        >
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* ✅ Mobile Hamburger Button (only visible on mobile) */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-slate-900 text-white p-2 rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* ✅ Mobile Overlay (backdrop) */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* ✅ Desktop Sidebar (always visible on lg+) */}
      <aside className="hidden lg:flex h-full w-[260px] bg-gradient-to-b from-slate-900 to-slate-950 text-slate-50 flex-col border-r border-slate-800">
        {sidebarContent}
      </aside>

      {/* ✅ Mobile Sidebar (slide-in from left) */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-[260px] z-50
          bg-gradient-to-b from-slate-900 to-slate-950 text-slate-50
          flex flex-col border-r border-slate-800
          transition-transform duration-300 ease-in-out
          lg:hidden
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
