import { useAddCommentHook, useGetAllAssigneHook, useGetAllCommentHook } from '@/hooks/comment.hook'
import { useGetSpeceficFile } from '@/hooks/file.hook'
import { useGetSingleTaskHook } from '@/hooks/task.hook'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'


const SingleTask = () => {
  const { id } = useParams()
  const commentsEndRef = useRef(null)

  
 
  const [commentText, setCommentText] = useState('')

  const [showMentions, setShowMentions] = useState(false)
const [mentionQuery, setMentionQuery] = useState('')
const [mentionedUsers, setMentionedUsers] = useState([])

  const { data } = useGetSingleTaskHook(id)
 const { reset, handleSubmit } = useForm({
 
})
  
  const {data:speceficFile} = useGetSpeceficFile(id)
  
  const {data:allComment} = useGetAllCommentHook(id)

  const {mutate} = useAddCommentHook(id)

  const scrollToBottom = () => {
  commentsEndRef.current?.scrollIntoView({
    behavior: 'smooth'
  })
}

const handleCommentChange = (e) => {
  const value = e.target.value

  // Last @ detect karo
  const lastAt = value.lastIndexOf('@')

  if (lastAt !== -1) {
    const query = value.slice(lastAt + 1)

    // space ya newline aaye toh mention band
    if (query.includes(' ') || query.includes('\n')) {
      setShowMentions(false)
      return
    }

    setMentionQuery(query)
    setShowMentions(true)
  } else {
    setShowMentions(false)
  }
}


const handleMentionSelect = (user) => {
  const lastAt = commentText.lastIndexOf('@')

  const newText =
    commentText.slice(0, lastAt) + `@${user.name} `


  setCommentText(newText)
  setMentionedUsers(prev => [...prev, user._id])
  setShowMentions(false)
}




useEffect(() => {
  if (allComment?.length > 0) {
    scrollToBottom()
  }
}, [allComment?.length])  // Length change pe scroll

 const addCommentHandler = () => {
  mutate({
    id,
    payload: {
      text: commentText,
      mentionedUserIds: mentionedUsers
    }
  })

  reset()
  setCommentText('')
  setMentionedUsers([])
  setShowMentions(false)
}

  
  const {data:totalAssigne} = useGetAllAssigneHook(id)
  // console.log(totalAssigne) 


  

  // Status badge color helper
  const getStatusStyle = (status) => {
    const styles = {
      'todo': 'bg-slate-100 text-slate-700 border-slate-300',
      'in-progress': 'bg-blue-50 text-blue-700 border-blue-200',
      'done': 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
    return styles[status] || styles['todo']
  }

  return (
    <div className="h-screen w-full flex flex-col bg-slate-50">
      {/* Header Section */}
      <div className="w-full bg-white border-b border-slate-200 px-8 py-6">
        <div className="flex items-start gap-6">
          
          {/* Task Details Card */}
          <div className="flex-1 space-y-4">
            {/* Title */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                Task Title
              </label>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">
                {data?.title || 'Loading...'}
              </h1>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                Description
              </label>
              <p className="text-base text-slate-700 leading-relaxed">
                {data?.description || 'No description available'}
              </p>
            </div>

            {/* Status Badge */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
                Status
              </label>
              <span 
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusStyle(data?.status)}`}
              >
                {data?.status?.replace('-', ' ') || 'N/A'}
              </span>
            </div>
          </div>

          {/* Assignees Card */}
          <div className="w-72 bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Total Assignees
            </span>
            <div className="text-7xl font-bold text-slate-900 mb-2">
              {data?.assignees?.length || 0}
            </div>
            <span className="text-sm text-slate-600 font-medium">
              {data?.assignees?.length === 1 ? 'Person' : 'People'} assigned
            </span>
          </div>

        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex overflow-y-auto">
        
        {/* Files Section */}
        <div className="flex-1 flex flex-col bg-white border-r border-slate-200">
          {/* Section Header */}
          <div className="px-8 py-5 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Attachments
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Files and documents related to this task
            </p>
          </div>
          
          {/* Content Area */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <div  className="flex flex-wrap gap-4">
  {speceficFile && speceficFile.length > 0 ? (
    speceficFile.map((item, index) => (
      <div
        key={index}
        className="w-40 h-48 border border-slate-200 rounded-lg bg-slate-50 flex flex-col overflow-hidden shadow-sm"
      >
        {/* Thumbnail area (just PDF icon style) */}
        <div className="flex-1 bg-slate-100 flex items-center justify-center">
          <span className="text-4xl">📄</span>
        </div>

        {/* Meta + actions */}
        <div className="px-3 py-2 border-t border-slate-200">
          <p className="text-xs font-semibold text-slate-800 truncate">
            {item.name || "Attachment"}
          </p>
          <button
            onClick={() => window.open(item.url, "_blank")}
            className="mt-1 w-full text-[11px] font-medium text-purple-600 hover:text-purple-700"
          >
            Open PDF
          </button>
        </div>
      </div>
    ))
  ) : (
    <div className="text-center">
      <div className="text-6xl mb-4">📎</div>
      <p className="text-sm font-medium text-slate-500">
        No files attached yet
      </p>
      <button className="mt-4 px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
        Upload File
      </button>
    </div>
  )}
  
</  div>

          </div>
        </div>

        {/* Comments Section */}
        <div  className="w-[400px] flex flex-col bg-slate-900">
          {/* Section Header */}
          <div className="px-6 py-5 border-b border-slate-700">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Comments
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Discussion and updates
            </p>
          </div>
          
          {/* Comments Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
  {allComment && allComment.length > 0 ? (
    allComment.map((item, index) => (
      <div key={item._id || index} className="group">
        {/* Comment Card */}
        <div className="flex gap-4 hover:bg-slate-800/50 p-4 rounded-xl transition-all duration-200">
          {/* Avatar */}
         

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Author + Time */}
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-sm font-semibold text-white truncate">
                {item.authorId?.name || "Unknown User"}
              </span>
              <span className="text-xs text-slate-400">
                {new Date(item.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
              {item.mentionedUserIds?.length > 0 && (
                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded-full font-medium">
                  {item.mentionedUserIds.length} mention{item.mentionedUserIds.length > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Comment Text */}
            <p className="text-sm text-zinc-200 leading-relaxed break-words whitespace-pre-wrap">
              {item.text}
            </p>
          </div>
        </div>
      </div>
    ))
  ) : (
    <div className="flex flex-col items-center justify-center h-full text-center py-12">
      <div className="text-6xl mb-6 opacity-40">💬</div>
      <p className="text-lg font-semibold text-slate-300 mb-1">
        No comments yet
      </p>
      <p className="text-sm text-slate-500 max-w-md">
        Be the first to start the conversation about this task.
      </p>
    </div>
  )}
  <div ref={commentsEndRef} />
</div>

          {/* Comment Input */}
          {/* Comment Input */}
<div className="p-4 border-t border-slate-700 relative">
  <form onSubmit={handleSubmit(addCommentHandler)}>
    <textarea
      value={commentText}
      onChange={(e) => {
        setCommentText(e.target.value)
        handleCommentChange(e)
      }}
      placeholder="Add a comment... @ to mention"
      className="w-full px-4 py-3 bg-slate-800 text-white placeholder-slate-500 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-slate-600"
      rows={3}
    />

    {/* ✅ FIXED: participants check + filter */}
    {showMentions && totalAssigne?.participants?.length > 0 && (
      <div className="absolute bottom-20 left-4 w-72 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
        {totalAssigne.participants
          .filter(user =>
            (user.name).toLowerCase().includes(mentionQuery.toLowerCase())
          )
          .map(user => (
            <div
              key={user._id}
              onClick={() => handleMentionSelect(user)}
              className="px-4 py-2 text-sm text-white hover:bg-slate-700 cursor-pointer transition-colors"
            >
              @{user.username || user.name}
            </div>
          ))}
      </div>
    )}

    <button 
      type='submit' 
      disabled={!commentText.trim()}
      className="mt-2 w-full px-4 py-2 text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed rounded-lg transition-colors"
    >
      Post Comment
    </button>
  </form>
</div>

        </div>

      </div>
    </div>
  )
}

export default SingleTask
