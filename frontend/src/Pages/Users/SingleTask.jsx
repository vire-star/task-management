import { useAddCommentHook, useGetAllAssigneHook, useGetAllCommentHook } from '@/hooks/comment.hook'
import { useCreateFileHookk, useGetSpeceficFile } from '@/hooks/file.hook'
import { useGetSingleTaskHook } from '@/hooks/task.hook'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { X, MessageSquare, Paperclip } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { workshopStore } from '@/store/workshopStore'

const SingleTask = () => {
  const { id } = useParams()
  const [openDialog, setopenDialog] = useState(false)
  const commentsEndRef = useRef(null)
  const [commentText, setCommentText] = useState('')
  console.log(commentText)
  const [showMentions, setShowMentions] = useState(false)
  const [mentionQuery, setMentionQuery] = useState('')
  const [mentionedUsers, setMentionedUsers] = useState([])
  
  // ✅ Mobile state management
  const [showComments, setShowComments] = useState(false)
  const [showFiles, setShowFiles] = useState(false)

  const { data } = useGetSingleTaskHook(id)
  const { reset, handleSubmit, register } = useForm()
  const { data: speceficFile } = useGetSpeceficFile(id)
  const { data: allComment } = useGetAllCommentHook(id)
  console.log(allComment)
  const { mutate } = useAddCommentHook(id)
  const { data: totalAssigne } = useGetAllAssigneHook(id)

  const { mutate: createfile, isPending } = useCreateFileHookk()
  
  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    })
  }

  const workshop = workshopStore((state) => state.workshop)
  
  const handleCommentChange = (e) => {
    const value = e.target.value
    const lastAt = value.lastIndexOf('@')

    if (lastAt !== -1) {
      const query = value.slice(lastAt + 1)
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
    const newText = commentText.slice(0, lastAt) + `@${user.name} `
    setCommentText(newText)
    setMentionedUsers(prev => [...prev, user._id])
    setShowMentions(false)
  }

  useEffect(() => {
    if (allComment?.length > 0) {
      scrollToBottom()
    }
  }, [allComment?.length])

  const addCommentHandler = (e) => {
    e.preventDefault()
    mutate({
      id,
      payload: {
        text: commentText,
        mentionedUserIds: mentionedUsers
      }
    })
    console.log( id,
       {
        text: commentText,
        mentionedUserIds: mentionedUsers
      })
    // reset()
    setCommentText('')
    setMentionedUsers([])
    setShowMentions(false)
  }

  const getStatusStyle = (status) => {
    const styles = {
      'todo': 'bg-slate-100 text-slate-700 border-slate-300',
      'in-progress': 'bg-blue-50 text-blue-700 border-blue-200',
      'done': 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
    return styles[status] || styles['todo']
  }

  const fileHandler = (data) => {
    const formdata = new FormData()
    if (data.url && data.url[0]) {
      formdata.append('url', data.url[0])
    }

    formdata.append("visibility", "workshop")
    formdata.append("workshopId", workshop._id)
    formdata.append("taskId", id)
    createfile(formdata, {
      onSuccess: () => {
        setopenDialog(false)
        reset()
      }
    })
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-50">
      {/* ✅ Responsive Header Section */}
      <div className="w-full bg-white border-b border-slate-200 px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 lg:py-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-3 sm:gap-4 lg:gap-6">
          
          {/* Task Details Card */}
          <div className="flex-1 space-y-2 sm:space-y-3 lg:space-y-4">
            {/* Title */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 sm:mb-1.5 block">
                Task Title
              </label>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight leading-tight break-words">
                {data?.title || 'Loading...'}
              </h1>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 sm:mb-1.5 block">
                Description
              </label>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed break-words">
                {data?.description || 'No description available'}
              </p>
            </div>

            {/* Status Badge */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 sm:mb-1.5 block">
                Status
              </label>
              <span 
                className={`inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusStyle(data?.status)}`}
              >
                {data?.status?.replace('-', ' ') || 'N/A'}
              </span>
            </div>
          </div>

          {/* Assignees Card */}
          <div className="w-full lg:w-64 xl:w-72 bg-slate-50 border border-slate-200 rounded-lg lg:rounded-xl p-3 sm:p-4 lg:p-6 flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-3 sm:gap-4">
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 lg:mb-3">
                Assignees
              </span>
              <div className="text-3xl sm:text-4xl lg:text-7xl font-bold text-slate-900">
                {data?.assignees?.length || 0}
              </div>
            </div>
            <span className="text-xs sm:text-sm text-slate-600 font-medium lg:mt-2">
              {data?.assignees?.length === 1 ? 'Person' : 'People'} assigned
            </span>
          </div>
        </div>

        {/* ✅ Mobile Action Buttons */}
        <div className="flex lg:hidden gap-2 mt-3 sm:mt-4">
          <button
            onClick={() => {
              setShowFiles(!showFiles)
              setShowComments(false)
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm transition-colors ${
              showFiles 
                ? 'bg-slate-800 text-white' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Paperclip className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Files</span> ({speceficFile?.length || 0})
          </button>
          <button
            onClick={() => {
              setShowComments(!showComments)
              setShowFiles(false)
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm transition-colors ${
              showComments 
                ? 'bg-slate-800 text-white' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Comments</span> ({allComment?.length || 0})
          </button>
        </div>
      </div>

      {/* ✅ Responsive Content Section */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Files Section */}
        <div className={`
          ${showFiles || !showComments ? 'flex' : 'hidden'} 
          lg:flex flex-1 flex-col bg-white lg:border-r border-slate-200
        `}>
          {/* Section Header */}
          <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">
                Attachments
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5 truncate">
                Files and documents
              </p>
            </div>
            {/* Mobile close button */}
            <button
              onClick={() => setShowFiles(false)}
              className="lg:hidden p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg flex-shrink-0"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
            </button>
          </div>
          
          {/* Content Area */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 lg:py-6">
            {/* Upload Button */}
            <div className="mb-4 sm:mb-6">
              <button 
                onClick={(e) => {
                  e.preventDefault()
                  setopenDialog(true)
                }} 
                className="w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
                Upload New File
              </button>
            </div>

            {/* Files Grid */}
            {speceficFile && speceficFile.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                {speceficFile.map((item, index) => (
                  <div
                    key={index}
                    className="group relative bg-white border border-slate-200 rounded-lg lg:rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:border-slate-300"
                  >
                    {/* File Icon/Preview */}
                    <div className="aspect-square bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-3 sm:p-4 lg:p-6 relative overflow-hidden">
                      <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-slate-400 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-16 sm:h-16 bg-slate-300 rounded-full blur-xl"></div>
                      </div>
                      
                      <div className="relative z-10">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 text-slate-400 group-hover:text-slate-600 transition-colors" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={1.5} 
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" 
                          />
                        </svg>
                      </div>

                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                        <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-slate-800 text-white text-[10px] sm:text-xs font-bold rounded uppercase">
                          PDF
                        </span>
                      </div>
                    </div>

                    {/* File Info */}
                    <div className="p-2 sm:p-3 lg:p-4 border-t border-slate-100">
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate mb-1 sm:mb-2" title={item.name}>
                        {item.name || "Untitled"}
                      </p>
                      
                      <div className="flex items-center justify-between gap-1 sm:gap-2">
                        <span className="text-[10px] sm:text-xs text-slate-500 truncate">
                          {new Date(item.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>

                        <button
                          onClick={() => window.open(item.url, "_blank")}
                          className="p-1 sm:p-2 text-slate-600 hover:text-white hover:bg-slate-800 rounded-md lg:rounded-lg transition-all duration-200 flex-shrink-0"
                          title="Open file"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-3 w-3 sm:h-4 sm:w-4" 
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                          >
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-8 w-8 sm:h-10 sm:w-10 text-slate-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                    />
                  </svg>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-1">
                  No files yet
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mb-4 sm:mb-6 max-w-sm">
                  Upload your first file to get started
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className={`
          ${showComments ? 'flex' : 'hidden'} 
          lg:flex w-full lg:w-[350px] xl:w-[400px] flex-col bg-slate-900
        `}>
          {/* Section Header */}
          <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 lg:py-5 border-b border-slate-700 flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
                Comments
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5 truncate">
                Discussion
              </p>
            </div>
            <button
              onClick={() => setShowComments(false)}
              className="lg:hidden p-1.5 sm:p-2 hover:bg-slate-800 rounded-lg flex-shrink-0"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
            </button>
          </div>
          
          {/* Comments Area */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 lg:py-6 space-y-2 sm:space-y-3 lg:space-y-4">
            {allComment && allComment.length > 0 ? (
              allComment.map((item, index) => (
                <div key={item._id || index} className="group">
                  <div className="flex gap-2 sm:gap-3 lg:gap-4 hover:bg-slate-800/50 p-2 sm:p-3 lg:p-4 rounded-lg lg:rounded-xl transition-all duration-200">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1.5">
                        <span className="text-xs sm:text-sm font-semibold text-white truncate">
                          {item.authorId?.name || "Unknown"}
                        </span>
                        <span className="text-[10px] sm:text-xs text-slate-400">
                          {new Date(item.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        {item.mentionedUserIds?.length > 0 && (
                          <span className="px-1.5 sm:px-2 py-0.5 bg-blue-500/20 text-blue-300 text-[10px] sm:text-xs rounded-full font-medium">
                            {item.mentionedUserIds.length}
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed break-words whitespace-pre-wrap">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-8 sm:py-12 px-4">
                <div className="text-3xl sm:text-4xl lg:text-6xl mb-3 sm:mb-4 lg:mb-6 opacity-40">💬</div>
                <p className="text-sm sm:text-base lg:text-lg font-semibold text-slate-300 mb-1">
                  No comments yet
                </p>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md">
                  Start the conversation
                </p>
              </div>
            )}
            <div ref={commentsEndRef} />
          </div>

          {/* Comment Input */}
          <div className="p-2 sm:p-3 lg:p-4 border-t border-slate-700 relative">
            <form onSubmit={addCommentHandler}>
              <textarea
                value={commentText}
                onChange={(e) => {
                  setCommentText(e.target.value)
                  handleCommentChange(e)
                }}
                
                placeholder="Add a comment... @ to mention"
                className="w-full px-2.5 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 bg-slate-800 text-white placeholder-slate-500 rounded-lg text-xs sm:text-sm resize-none focus:outline-none focus:ring-2 focus:ring-slate-600"
                rows={3}
              />

              {/* Mentions Dropdown */}
              {showMentions && totalAssigne?.participants?.length > 0 && (
                <div className="absolute bottom-14 sm:bottom-16 lg:bottom-20 left-2 sm:left-3 lg:left-4 right-2 sm:right-3 lg:right-4 lg:w-72 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 max-h-40 sm:max-h-48 overflow-y-auto">
                  {totalAssigne.participants
                    .filter(user =>
                      (user.name).toLowerCase().includes(mentionQuery.toLowerCase())
                    )
                    .map(user => (
                      <div
                        key={user._id}
                        onClick={() => handleMentionSelect(user)}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-white hover:bg-slate-700 cursor-pointer transition-colors"
                      >
                        @{user.username || user.name}
                      </div>
                    ))}
                </div>
              )}

              <button 
                type='submit' 
                disabled={!commentText.trim()}
                className="mt-2 w-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                Post Comment
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Upload Dialog */}
      <Dialog open={openDialog} onOpenChange={setopenDialog}>
        <DialogContent className="sm:max-w-lg mx-4 sm:mx-0">
          <DialogHeader className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 rounded-full mx-auto">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 sm:h-6 sm:w-6 text-slate-700" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                />
              </svg>
            </div>
            
            <DialogTitle className="text-lg sm:text-xl font-bold text-slate-900 text-center">
              Upload File
            </DialogTitle>
            
            <DialogDescription className="text-xs sm:text-sm text-slate-600 text-center px-2">
              Add a new document or file to this task
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(fileHandler)}
            className="mt-4 sm:mt-6 space-y-4 sm:space-y-6"
          >
            <div className="space-y-1.5 sm:space-y-2">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                Choose File <span className="text-red-500">*</span>
              </label>
              
              <div className="relative">
                <input
                  type="file"
                  {...register("url", { required: true })}
                  className="
                    block w-full text-xs sm:text-sm text-slate-600
                    file:mr-3 sm:file:mr-4 file:py-2 sm:file:py-3 file:px-3 sm:file:px-4
                    file:rounded-lg file:border-0
                    file:text-xs sm:file:text-sm file:font-semibold
                    file:bg-slate-800 file:text-white
                    hover:file:bg-slate-700
                    file:cursor-pointer
                    border-2 border-dashed border-slate-300 rounded-lg
                    cursor-pointer
                    hover:border-slate-400
                    transition-all duration-200
                    p-1.5 sm:p-2
                  "
                />
              </div>

              <p className="text-[10px] sm:text-xs text-slate-500 flex items-center gap-1">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-3 w-3 sm:h-3.5 sm:w-3.5" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                    clipRule="evenodd" 
                  />
                </svg>
                <span className="hidden xs:inline">Supported: PDF, DOC, DOCX, Images (Max 10MB)</span>
                <span className="xs:hidden">Max 10MB</span>
              </p>
            </div>

            <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setopenDialog(false)}
                className="
                  flex-1 px-3 sm:px-4 py-2 sm:py-2.5
                  text-xs sm:text-sm font-semibold
                  text-slate-700 bg-slate-100
                  hover:bg-slate-200
                  rounded-lg
                  transition-all duration-200
                "
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={isPending}
                className="
                  flex-1 px-3 sm:px-4 py-2 sm:py-2.5
                  text-xs sm:text-sm font-semibold
                  text-white
                  bg-slate-800 hover:bg-slate-700
                  disabled:opacity-50 disabled:cursor-not-allowed
                  rounded-lg
                  transition-all duration-200
                  shadow-sm hover:shadow-md
                  flex items-center justify-center gap-1.5 sm:gap-2
                "
              >
                {isPending ? (
                  <>
                    <svg 
                      className="animate-spin h-3.5 w-3.5 sm:h-4 sm:w-4" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                    >
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                      />
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span className="hidden xs:inline">Uploading...</span>
                  </>
                ) : (
                  <>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-3.5 w-3.5 sm:h-4 sm:w-4" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                    Upload
                  </>
                )}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SingleTask
