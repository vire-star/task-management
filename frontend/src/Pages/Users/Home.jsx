import Sidebar from '@/components/Sidebar'
import { useGetTask, useUpdateStatusHook } from '@/hooks/task.hook'
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
import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import SingleTask from './SingleTask'
import { useStore } from 'zustand'
import { userStore } from '@/store/userStore'
import { toast } from 'sonner'

const Home = () => {
  const workshop = workshopStore((state) => state.workshop)
  

  const { data, refetch } = useGetTask(workshop?._id)
  const { mutate: changeStatusMutate } = useUpdateStatusHook()



  const navigate = useNavigate()

  
  // 1) Active task ko track karo for DragOverlay
  const [activeTask, setActiveTask] = useState(null)

  // 2) Sensors - better drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px move hone ke baad drag start
      },
    })
  )

  // 3) Drag start - active task set karo
  const handleDragStart = (event) => {
    const { active } = event
    const task = data?.find((item) => item._id === active.id)
    setActiveTask(task)
  }

  // 4) Drag end - status change + active task clear
  const handleDragEnd = (event) => {
    const { active, over } = event
    
    setActiveTask(null) // Clear active task

    if (!over) return

    const taskId = active.id
    const newStatus = over.id

    // Same column check
    const currentTask = data?.find((item) => item._id === taskId)
    if (currentTask?.status === newStatus) return

    changeStatusMutate(
      { taskId, status: newStatus },
      {
        onSuccess: () => {
          refetch()
        },
      }
    )
  }

  return (
   
    
      <div className="h-full w-[80%] flex flex-col">
        {/* Header Section */}
        <div className="px-8 py-6 border-b border-slate-200 bg-white">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {workshop?.name || 'Project Board'}
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Manage your tasks across different stages
          </p>
        </div>

        {/* Board Section with DND */}
        <DndContext 
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex-1 flex gap-6 p-8 overflow-x-auto">
            {/* TODO Column */}
            <DroppableColumn
              id="todo"
              title="To Do"
              count={data?.filter((item) => item.status === 'todo').length || 0}
            >
              {data
                ?.filter((item) => item.status === 'todo')
                .map((item) => (
                  <DraggableTask key={item._id} task={item} />
                ))}
            </DroppableColumn>

            {/* IN-PROGRESS Column */}
            <DroppableColumn
              id="in-progress"
              title="In Progress"
              count={data?.filter((item) => item.status === 'in-progress').length || 0}
            >
              {data
                ?.filter((item) => item.status === 'in-progress')
                .map((item) => (
                  <DraggableTask key={item._id} task={item} />
                ))}
            </DroppableColumn>

            {/* DONE Column */}
            <DroppableColumn
              id="done"
              title="Done"
              count={data?.filter((item) => item.status === 'done').length || 0}
            >
              {data
                ?.filter((item) => item.status === 'done')
                .map((item) => (
                  <DraggableTask key={item._id} task={item} />
                ))}
            </DroppableColumn>
          </div>

          {/* 5) DragOverlay - YEH SABSE IMPORTANT HAI! */}
          <DragOverlay>
            {activeTask ? (
              <div 
                className="bg-white p-4 rounded-lg border-2 border-slate-400 shadow-2xl cursor-grabbing rotate-2 scale-105"
                style={{ 
                  width: '320px' // Fixed width for consistent look
                }}
              >
                <h3 className="text-base font-semibold text-slate-900 leading-snug mb-2">
                  {activeTask.title}
                </h3>
                {activeTask.description && (
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                    {activeTask.description}
                  </p>
                )}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                    Task ID: {activeTask._id.slice(-6)}
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

// Droppable Column Component
const DroppableColumn = ({ id, title, count, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-[320px] max-w-[400px] flex flex-col bg-slate-100 rounded-xl transition-all duration-200 ${
        isOver ? 'ring-2 ring-slate-400 bg-slate-200' : ''
      }`}
    >
      {/* Column Header */}
      <div className="px-5 py-4 border-b border-slate-300">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            {title}
          </h2>
          <span className="px-2.5 py-0.5 text-xs font-bold text-slate-600 bg-slate-200 rounded-full">
            {count}
          </span>
        </div>
      </div>

      {/* Tasks Container */}
      <div className="flex-1 p-3 space-y-2.5 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}

// Draggable Task Component
const DraggableTask = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task._id,
  })

const user = userStore((state)=>state.user)
 const isCreator = task.creatorId?.toString() === user?._id?.toString()
 
  
  // ✅ FIX: .some() ke andar proper comparison
  const isAssignee = task.assignees.some(
    (assignee) => {
      const assigneeId = assignee._id 
        ? assignee._id.toString() 
        : assignee.toString()
      return assigneeId === user?._id?.toString()
    }
  )
  

const canAccess = isCreator || isAssignee

  const navigate =useNavigate()
  const singleTask=(e)=>{
       if (isDragging) {
      e.preventDefault()
      e.stopPropagation()
      return
    }
    if (!canAccess) {
      toast.error("You are not assigned to this task")
      return
    }
    navigate(`singleTask/${task._id}`)
  }
  // 6) Transform + z-index fix
  const style = {
    transform: transform 
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)` 
      : undefined,
    opacity: isDragging ? 0 : 1, // Original completely invisible during drag
    position: 'relative', // Important for z-index to work
    zIndex: isDragging ? 50 : 'auto', // Higher z-index during drag
    transition: 'opacity 200ms ease',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
     onClick={singleTask}
      className={`group bg-white p-4 rounded-lg border shadow-sm transition-all
    ${canAccess ? 'cursor-pointer hover:shadow-md' : 'opacity-60 cursor-not-allowed'}
  `}
>
      {/* Task Title */}
      <h3 className="text-base font-semibold text-slate-900 leading-snug mb-2">
        {task.title}
      </h3>

      {/* Task Description */}
      {task.description && (
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Task Footer */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
          Task ID: {task._id.slice(-6)}
        </span>
      </div>
    </div>
  )
}
