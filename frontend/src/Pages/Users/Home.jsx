import Sidebar from '@/components/Sidebar'
import { useCreateTaskHook, useDeleteTaskHook, useGetTask, useUpdateStatusHook } from '@/hooks/task.hook'
import { workshopStore } from '@/store/workshopStore'
import { 
  DndContext, 
  useDroppable, 
  useDraggable,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors 
} from '@dnd-kit/core'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import React, { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { userStore } from '@/store/userStore'
import { toast } from 'sonner'
import { useLeaveWorkshopHook } from '@/hooks/workshopHook'
import { Menu, Workflow, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import socket from '@/lib/socket' // ✅ Import socket


const Home = () => {
  const workshop = workshopStore((state) => state?.workshop)
  const clearWorkshop = workshopStore((state) => state?.clearWorkshop)
  const [openDialogue, setopenDialogue] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { register, handleSubmit, reset } = useForm()

  const { data, refetch } = useGetTask(workshop?._id)
  const { mutate: changeStatusMutate } = useUpdateStatusHook()
  const { mutate: createTask } = useCreateTaskHook()
  const { mutate: leaveWorkshop, isLoading: isLeavingWorkshop } = useLeaveWorkshopHook()

  // ✅ Local state for optimistic updates
  const [localTasks, setLocalTasks] = useState([])

  const navigate = useNavigate()

  const [activeTask, setActiveTask] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  // ✅ Sync server data with local state
  useEffect(() => {
    if (data) {
      setLocalTasks(data)
    }
  }, [data])

  // ✅ Socket.io Setup
  useEffect(() => {
    if (!workshop?._id) return;

    // Connect socket
    socket.connect();

    // Join workshop room
    socket.emit('joinWorkshop', workshop._id);

    // ✅ Listen for task updates from other users
    socket.on('taskUpdated', ({ taskId, status, task }) => {
      setLocalTasks(prev => 
        prev.map(t => t._id === taskId ? { ...t, status, ...task } : t)
      );
    });

    // ✅ Listen for new tasks
    socket.on('taskCreated', (newTask) => {
      setLocalTasks(prev => [...prev, newTask]);
    });

    // ✅ Listen for deleted tasks
    socket.on('taskDeleted', ({ taskId }) => {
      setLocalTasks(prev => prev.filter(t => t._id !== taskId));
    });

    // Cleanup
    return () => {
      socket.emit('leaveWorkshop', workshop._id);
      socket.off('taskUpdated');
      socket.off('taskCreated');
      socket.off('taskDeleted');
    };
  }, [workshop?._id]);

  const handleDragStart = (event) => {
    const { active } = event
    const task = localTasks?.find((item) => item?._id === active?.id)
    setActiveTask(task)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    
    setActiveTask(null)

    if (!over) return

    const taskId = active?.id
    const newStatus = over?.id

    const currentTask = localTasks?.find((item) => item?._id === taskId)
    if (currentTask?.status === newStatus) return

    // ✅ OPTIMISTIC UPDATE - Update UI immediately
    setLocalTasks(prev => 
      prev.map(task => 
        task._id === taskId ? { ...task, status: newStatus } : task
      )
    )

    // ✅ Send to server (no refetch needed, socket will sync)
    changeStatusMutate(
      { taskId, status: newStatus },
      {
        onError: (error) => {
          // ✅ Rollback on error
          setLocalTasks(prev => 
            prev.map(task => 
              task._id === taskId ? { ...task, status: currentTask.status } : task
            )
          )
          toast.error(error?.response?.data?.message || "Failed to update task")
        }
      }
    )
  }

  const leaveWorkshopHandler = () => {
    if (!workshop?._id) {
      toast.error("Workshop ID not found")
      return
    }

    leaveWorkshop(workshop._id, {
      onSuccess: () => {
        clearWorkshop?.()
        navigate("/")
        toast.success("Left workshop successfully")
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || "Failed to leave workshop")
      }
    })
  }

  const createTaskHandler = (data) => {
    if (!workshop?._id) {
      toast.error("Workshop not selected")
      return
    }

    createTask({
      workshopId: workshop._id,
      title: data?.title,
      description: data?.description
    }, {
      onSuccess: () => {
        reset()
        setopenDialogue(false)
        toast.success("Task created successfully")
        // No need to refetch, socket will handle it
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || "Failed to create task")
      }
    })
  }

  return (
    <div className="h-full w-full lg:w-[80%] flex flex-col">
      {/* Header Section - Same as before */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-slate-200 bg-white">
        {/* ... your existing header code ... */}
      </div>

      {/* ✅ Use localTasks instead of data */}
      <DndContext 
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 p-3 sm:p-4 lg:p-8 overflow-x-auto overflow-y-auto">
          <DroppableColumn
            id="todo"
            title="To Do"
            count={localTasks?.filter((item) => item?.status === 'todo')?.length || 0}
          >
            {localTasks
              ?.filter((item) => item?.status === 'todo')
              ?.map((item) => (
                <DraggableTask key={item?._id} task={item} />
              ))}
          </DroppableColumn>

          <DroppableColumn
            id="in-progress"
            title="In Progress"
            count={localTasks?.filter((item) => item?.status === 'in-progress')?.length || 0}
          >
            {localTasks
              ?.filter((item) => item?.status === 'in-progress')
              ?.map((item) => (
                <DraggableTask key={item?._id} task={item} />
              ))}
          </DroppableColumn>

          <DroppableColumn
            id="done"
            title="Done"
            count={localTasks?.filter((item) => item?.status === 'done')?.length || 0}
          >
            {localTasks
              ?.filter((item) => item?.status === 'done')
              ?.map((item) => (
                <DraggableTask key={item?._id} task={item} />
              ))}
          </DroppableColumn>
        </div>

        <DragOverlay>
          {activeTask ? (
            <div 
              className="bg-white p-3 sm:p-4 rounded-lg border-2 border-slate-400 shadow-2xl cursor-grabbing rotate-2 scale-105"
              style={{ 
                width: '280px',
                maxWidth: '90vw'
              }}
            >
              <h3 className="text-sm sm:text-base font-semibold text-slate-900 leading-snug mb-2">
                {activeTask?.title}
              </h3>
              {activeTask?.description && (
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                  {activeTask.description}
                </p>
              )}
              <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-slate-100">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                  Task ID: {activeTask?._id?.slice(-6)}
                </span>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

export default Home

// DroppableColumn and DraggableTask components remain the same

// ✅ Responsive Droppable Column Component
const DroppableColumn = ({ id, title, count, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={`
        flex-1 
        min-w-full sm:min-w-[280px] lg:min-w-[320px] 
        max-w-full sm:max-w-[400px] 
        flex flex-col 
        bg-slate-100 
        rounded-lg sm:rounded-xl 
        transition-all duration-200 
        ${isOver ? 'ring-2 ring-slate-400 bg-slate-200' : ''}
      `}
    >
      {/* Column Header */}
      <div className="px-3 sm:px-4 lg:px-5 py-3 sm:py-4 border-b border-slate-300">
        <div className="flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">
            {title}
          </h2>
          <span className="px-2 sm:px-2.5 py-0.5 text-xs font-bold text-slate-600 bg-slate-200 rounded-full">
            {count || 0}
          </span>
        </div>
      </div>

      {/* Tasks Container */}
      <div className="flex-1 p-2 sm:p-3 space-y-2 sm:space-y-2.5 overflow-y-auto min-h-[200px]">
        {children?.length > 0 ? children : (
          <div className="flex items-center justify-center h-32 text-xs sm:text-sm text-slate-400">
            No tasks yet
          </div>
        )}
      </div>
    </div>
  )
}



// ✅ Responsive Draggable Task Component



// export default DraggableTask

const DraggableTask = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task?._id,
  })

  const user = userStore((state) => state?.user)
  const { mutate } = useDeleteTaskHook()
  const navigate = useNavigate()
  
  // ✅ Popover state management
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  
  const isCreator = task?.creatorId?.toString() === user?._id?.toString()
  
  const isAssignee = task?.assignees?.some((assignee) => {
    const assigneeId = assignee?._id 
      ? assignee._id.toString() 
      : assignee?.toString()
    return assigneeId === user?._id?.toString()
  }) || false
  
  const canAccess = isCreator || isAssignee
  
  const singleTask = (e) => {
    if (isDragging) {
      e?.preventDefault()
      e?.stopPropagation()
      return
    }
    if (!canAccess) {
      toast.error("You are not assigned to this task")
      return
    }
    if (task?._id) {
      navigate(`/singleTask/${task._id}`)
    }
  }

  const deleteTaskHandler = (id) => {
    mutate(id)
    setIsPopoverOpen(false) // ✅ Delete ke baad popover close
  }

  const style = {
    transform: transform 
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)` 
      : undefined,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative',
    zIndex: isDragging ? 50 : 'auto',
    transition: 'opacity 200ms ease',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={singleTask}
      className={`
        group 
        bg-white 
        p-4 
        rounded-lg 
        border 
        border-slate-200
        shadow-sm 
        transition-all
        hover:shadow-md
        ${canAccess 
          ? 'cursor-grab active:cursor-grabbing hover:border-slate-300' 
          : 'opacity-60 cursor-not-allowed'
        }
        ${isDragging ? 'shadow-lg ring-2 ring-blue-400' : ''}
      `}
    >
      {/* Header with Title and Delete Button */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="flex-1 text-sm sm:text-base font-semibold text-slate-900 leading-snug line-clamp-2">
          {task?.title || 'Untitled Task'}
        </h3>
        
        {/* ✅ Controlled Popover */}
        {canAccess && (
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                className="flex-shrink-0 p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                aria-label="Delete task"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </button>
            </PopoverTrigger>

            <PopoverContent 
              onClick={(e) => e.stopPropagation()}
              className="w-72 p-0 border border-slate-200 shadow-lg"
              align="end"
            >
              <div className="p-4 space-y-3">
                {/* Warning Header */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 text-red-600" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">
                      Delete Task?
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      This action cannot be undone.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  {/* ✅ Cancel Button - manually close */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsPopoverOpen(false)
                    }}
                    className="flex-1 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  
                  {/* ✅ Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteTaskHandler(task._id)
                    }}
                    className="flex-1 px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Description */}
      {task?.description && (
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
          #{task?._id?.slice(-6) || 'N/A'}
        </span>
        
        {!canAccess && (
          <span className="flex items-center gap-1 text-xs text-red-500 font-medium">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-3 w-3" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" 
                clipRule="evenodd" 
              />
            </svg>
            Locked
          </span>
        )}
      </div>
    </div>
  )
}




// ✅ Reusable Task Dialog Component
const TaskDialog = ({ workshop, register, handleSubmit, createTaskHandler }) => {
  return (
    <DialogContent className="w-[90vw] sm:w-full sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="text-slate-800 tracking-tight text-lg sm:text-xl font-semibold">
          Create task in <span className="text-purple-600">{workshop?.name || 'Workshop'}</span>
        </DialogTitle>
      </DialogHeader>

      <form
        onSubmit={handleSubmit(createTaskHandler)}
        className="mt-4 sm:mt-5 flex flex-col gap-3 sm:gap-4"
      >
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500">
            Task title *
          </label>
          <input
            {...register("title", { required: true })}
            placeholder="Enter task title"
            className="border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500">
            Description
          </label>
          <textarea
            {...register("description")}
            placeholder="Describe the task (optional)"
            rows={3}
            className="border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm resize-none"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="submit"
            className="px-4 py-2 rounded-md text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 active:scale-95 transition"
          >
            Create Task
          </button>
        </div>
      </form>
    </DialogContent>
  )
}
