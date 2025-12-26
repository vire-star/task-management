import { 
  useDeleteWorkshop, 
  useGetMyWorkshopHook, 
  useGetTotalMemberInWorkshopHook, 
  useRemoveUserFromWorkshopHook
} from '@/hooks/workshopHook'
import { userStore } from '@/store/userStore'
import { Trash2, Pencil, Crown, Users, EllipsisVertical } from 'lucide-react'
import React, { useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useGetTaskAssignedToUser } from '@/hooks/task.hook'
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const Settings = () => {
  const user = userStore((state) => state.user)
  const { data } = useGetMyWorkshopHook()
  
  const [activeWorkshopId, setActiveWorkshopId] = useState("")
  const [selectedUserId, setSelectedUserId] = useState("")
  const [deletePopoverId, setDeletePopoverId] = useState(null)
  const [memberPopoverId, setMemberPopoverId] = useState(null)
  const [deleteDialogMember, setDeleteDialogMember] = useState(null) // ✅ NEW STATE
  
  const { data: totalMember } = useGetTotalMemberInWorkshopHook(activeWorkshopId)
  const { data: taskAssignedToUser } = useGetTaskAssignedToUser(selectedUserId)
  
  const { mutate: removeUserFromWorkshop, isLoading: isRemovingMember } = useRemoveUserFromWorkshopHook()
  const { mutate: deleteWorkshop, isLoading: isDeleting } = useDeleteWorkshop()

  const removeUserFromWorkshopHandler = (member) => {
    removeUserFromWorkshop(
      { 
        workshopId: member.workshopId,
 
        deleteUserId: member.userId._id 
      },
      {
        onSuccess: () => {
          toast.success(`${member.userId.name} removed successfully`)
          setDeleteDialogMember(null)
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || 'Failed to remove member')
        }
      }
    )
    console.log(member.workshopId)
    console.log(member.userId._id)
    console.log(member)
  }

  const handleWorkshopClick = (id) => {
    setActiveWorkshopId(id)
  }

  const handleMemberClick = (userId) => {
    setSelectedUserId(userId)
  }

  const handleDeleteWorkshop = (workshopId, workshopName) => {
    deleteWorkshop(workshopId, {
      onSuccess: () => {
        toast.success(`${workshopName} deleted successfully`)
        setDeletePopoverId(null)
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || 'Failed to delete workshop')
      }
    })
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 px-9 pt-9 pb-16 overflow-y-auto">
      {/* Profile Header */}
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={user?.avatarUrl}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                alt={user?.name}
              />
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-slate-800 hover:bg-slate-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all">
                <Pencil className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 capitalize">
                {user?.name}
              </h1>
              <p className="text-slate-600 text-lg mt-1">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Your Workspaces Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="w-6 h-6 text-slate-600" />
            <h2 className="text-2xl font-bold text-slate-900">
              Your Workspaces
            </h2>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-bold rounded-full">
              {data?.workshops?.length || 0}
            </span>
          </div>

          {data?.workshops?.length > 0 ? (
            <Accordion type="single" collapsible className="space-y-3">
              {data.workshops.map((item, index) => (
                <AccordionItem
                  key={item._id || index}
                  value={`workshop-${index}`}
                  className="border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  {/* Custom Header */}
                  <div className="relative">
                    <AccordionTrigger 
                      onClick={() => handleWorkshopClick(item._id)}
                      className="px-5 py-4 w-full hover:no-underline hover:bg-slate-50 transition-all"
                    >
                      <div className="flex items-center gap-3 pr-12">
                        <div className="text-left">
                          <h3 className="font-bold text-lg text-slate-900">
                            {item.name}
                          </h3>
                          {item.description && (
                            <p className="text-xs text-slate-500 mt-1">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </AccordionTrigger>

                    {/* Delete Button */}
                    <div className="absolute right-12 top-1/2 -translate-y-1/2 z-10">
                      <Popover 
                        open={deletePopoverId === item._id}
                        onOpenChange={(open) => setDeletePopoverId(open ? item._id : null)}
                      >
                        <PopoverTrigger
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 rounded-lg hover:bg-slate-50 transition-all"
                        >
                          <Trash2 className="w-4 h-4 text-slate-500" />
                        </PopoverTrigger>

                        <PopoverContent 
                          align="end" 
                          className="w-80"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-bold text-slate-900 mb-2">
                                Delete Workshop?
                              </h4>
                              <p className="text-sm text-slate-600 leading-relaxed">
                                Are you sure you want to delete{' '}
                                <strong className="text-slate-900">{item.name}</strong>? 
                                This action cannot be undone.
                              </p>
                            </div>

                            <div className="flex gap-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setDeletePopoverId(null)
                                }}
                                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-all"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteWorkshop(item._id, item.name)
                                }}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                              </button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Accordion Content */}
                  <AccordionContent className="px-5 pb-5 bg-slate-50 border-t border-slate-200">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Team Members ({totalMember?.allMember?.length || 0})
                        </p>
                      </div>

                      {/* Members List */}
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {totalMember?.allMember?.length > 0 ? (
                          totalMember.allMember.map((member) => (
                            <div 
                              key={member._id} 
                              className='bg-white py-3 px-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-all flex items-center justify-between'
                            >
                              <h1 className="font-medium text-slate-900">{member.userId.name}</h1>
                              
                              <Popover
                                open={memberPopoverId === member._id}
                                onOpenChange={(open) => setMemberPopoverId(open ? member._id : null)}
                              >
                                <PopoverTrigger
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleMemberClick(member.userId._id)
                                  }}
                                  className="p-2 rounded-lg hover:bg-slate-100 transition-all"
                                >
                                  <EllipsisVertical className="w-4 h-4 text-slate-600" />
                                </PopoverTrigger>
                                
                                <PopoverContent 
                                  align="end" 
                                  className="w-[25vw]"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="space-y-3">
                                    <span className="font-bold text-slate-900 mb-2">
                                      Assigned Tasks
                                    </span>
                                    
                                    {taskAssignedToUser?.tasks?.length > 0 ? (
                                      <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {taskAssignedToUser.tasks.map((task, idx) => (
                                          <div 
                                            key={idx}
                                            className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between gap-3"
                                          >
                                            <p className="text-sm font-medium text-slate-900 truncate flex-1 min-w-0">
                                              {task.title}
                                            </p>
                                            <span className="text-xs cursor-pointer font-medium text-slate-600 hover:text-slate-700 whitespace-nowrap shrink-0">
                                              Remove
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-sm text-slate-500 py-2">
                                        No tasks assigned to this user
                                      </p>
                                    )}
                                    
                                    <button 
                                      className="w-full mt-3 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-all"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        toast.info('Assign task feature coming soon!')
                                      }}
                                    >
                                      Assign Task
                                    </button>

                                    {/* ✅ Remove from Workshop - Opens Dialog */}
                                    <button 
                                      className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-all"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setMemberPopoverId(null) // Close popover first
                                        setDeleteDialogMember(member) // Open dialog
                                      }}
                                    >
                                      Remove from Workshop
                                    </button>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 bg-white rounded-lg border-2 border-dashed border-slate-200">
                            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-sm text-slate-800">No members yet</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-12 text-center">
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">No workspaces created yet</p>
              <button className="mt-4 px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition-all">
                Create Workspace
              </button>
            </div>
          )}
        </div>

        {/* Invited Workspaces Section */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-zinc-600" />
            <h2 className="text-2xl font-bold text-slate-900">
              Invited Workspaces
            </h2>
          </div>
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-12 text-center">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No invited workspaces yet</p>
          </div>
        </div>
      </div>

      {/* ✅ Delete Member Dialog - OUTSIDE all Popovers */}
      <Dialog 
        open={deleteDialogMember !== null}
        onOpenChange={(open) => !open && setDeleteDialogMember(null)}
      >
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Remove Member from Workshop?</DialogTitle>
            <DialogDescription className="pt-3">
              Are you sure you want to remove{' '}
              <strong className="text-slate-900">{deleteDialogMember?.userId?.name}</strong>{' '}
              from this workshop? All their assigned tasks will be unassigned and tasks created by them will be deleted.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setDeleteDialogMember(null)}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => removeUserFromWorkshopHandler(deleteDialogMember)}
              disabled={isRemovingMember}
              className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRemovingMember ? 'Removing...' : 'Remove Member'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Settings
