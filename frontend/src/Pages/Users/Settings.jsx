import { 
  useDeleteWorkshop, 
  useGetMyWorkshopHook, 
  useGetTotalMemberInWorkshopHook 
} from '@/hooks/workshopHook'
import { userStore } from '@/store/userStore'
import { Trash2, Pencil, ChevronDown, Crown, Users } from 'lucide-react'
import React, { useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useGetTaskAssignedToUser } from '@/hooks/task.hook'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover'
import { toast } from 'sonner'

const Settings = () => {
  const user = userStore((state) => state.user)
  const { data } = useGetMyWorkshopHook()
  
  const [activeWorkshopId, setActiveWorkshopId] = useState("")
  const [selectedUserId, setSelectedUserId] = useState("")
  const [deletePopoverId, setDeletePopoverId] = useState(null)
  
  const { data: totalMember } = useGetTotalMemberInWorkshopHook(activeWorkshopId)
  const { data: taskAssignedToUser } = useGetTaskAssignedToUser(selectedUserId)
  
  const { mutate: deleteWorkshop, isLoading: isDeleting } = useDeleteWorkshop()

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
                  {/* ✅ Custom Header - No nested buttons */}
                  <div className="relative">
                    <AccordionTrigger 
                      onClick={() => handleWorkshopClick(item._id)}
                      className="px-5 py-4 w-full hover:no-underline hover:bg-slate-50 transition-all"
                    >
                      <div className="flex items-center gap-3 pr-12">
                        <div className="w-3 h-3 rounded-full bg-slate-500" />
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

                    {/* ✅ Delete Button (Outside AccordionTrigger) */}
                    <div className="absolute right-12 top-1/2 -translate-y-1/2 z-10">
                      <Popover 
                        open={deletePopoverId === item._id}
                        onOpenChange={(open) => setDeletePopoverId(open ? item._id : null)}
                      >
                        <PopoverTrigger
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 rounded-lg hover:bg-red-50 transition-all"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
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
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                            <Dialog key={member._id}>
                              <DialogTrigger asChild>
                                <div
                                  onClick={() => handleMemberClick(member.userId?._id)}
                                  className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-3 hover:bg-slate-50 hover:border-slate-300 cursor-pointer transition-all"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                      {member.userId?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                      <p className="text-sm font-semibold text-slate-900">
                                        {member.userId?.name || 'Unknown User'}
                                      </p>
                                      <p className="text-xs text-slate-500 capitalize">
                                        {member.role}
                                      </p>
                                    </div>
                                  </div>
                                  <ChevronDown className="w-4 h-4 text-slate-400 -rotate-90" />
                                </div>
                              </DialogTrigger>

                              {/* Member Tasks Dialog */}
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle className="text-xl font-bold">
                                    {member.userId?.name}'s Tasks
                                  </DialogTitle>
                                </DialogHeader>

                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                  {taskAssignedToUser?.tasks?.length > 0 ? (
                                    taskAssignedToUser.tasks.map((task) => (
                                      <div 
                                        key={task._id} 
                                        className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-all"
                                      >
                                        <div className="flex items-start justify-between mb-2">
                                          <h4 className="font-bold text-slate-900">
                                            {task.title}
                                          </h4>
                                          <span className={`px-3 py-1 text-xs font-bold rounded-full capitalize ${
                                            task.status === 'completed' 
                                              ? 'bg-green-100 text-green-700'
                                              : task.status === 'in-progress'
                                              ? 'bg-blue-100 text-blue-700'
                                              : 'bg-slate-100 text-slate-700'
                                          }`}>
                                            {task.status}
                                          </span>
                                        </div>
                                        {task.description && (
                                          <p className="text-sm text-slate-600">
                                            {task.description}
                                          </p>
                                        )}
                                      </div>
                                    ))
                                  ) : (
                                    <div className="text-center py-12">
                                      <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                      <p className="text-slate-500">No tasks assigned yet</p>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                          ))
                        ) : (
                          <div className="text-center py-8 bg-white rounded-lg border-2 border-dashed border-slate-200">
                            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-sm text-slate-500">No members yet</p>
                          </div>
                        )}
                      </div>

                      {/* Settings Button */}
                     
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
    </div>
  )
}

export default Settings
