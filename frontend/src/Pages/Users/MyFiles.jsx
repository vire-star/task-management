import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useCreateFileHookk, useGetPrivateFileHook } from '@/hooks/file.hook'
import { 
  Trash2, 
  MoreVertical, 
  FileText, 
  Download, 
  ExternalLink,
  File,
  Search,
  Filter
} from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const MyFiles = () => {
    const {mutate, isPending} = useCreateFileHookk()
    const [openDialog, setOpenDialog] = useState(false)
  const { data, isLoading } = useGetPrivateFileHook()
  const [deletePopoverId, setDeletePopoverId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const {register, handleSubmit} = useForm()
  const handleDeleteFile = (fileId, fileName) => {
    // Your delete mutation here
    toast.success(`${fileName} deleted successfully`)
    setDeletePopoverId(null)
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size'
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const getFileIcon = (fileName) => {
    const ext = fileName?.split('.').pop()?.toLowerCase()
    if (['pdf'].includes(ext)) return '📄'
    if (['doc', 'docx'].includes(ext)) return '📝'
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return '🖼️'
    if (['zip', 'rar'].includes(ext)) return '📦'
    return '📁'
  }
const filteredFiles = useMemo(() => {
  if (!searchQuery) return data;

  const query = searchQuery.toLowerCase();

  return data?.filter(file => {
    const name = file.name?.toLowerCase() || "";
    const ext = name.split(".").pop();
    const sizeMB = file.size / (1024 * 1024);

    return (
      name.includes(query) ||
      ext?.includes(query) ||
      (query === "large" && sizeMB > 5) ||
      (query === "small" && sizeMB < 1)
    );
  });
}, [data, searchQuery]);


  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading files...</p>
        </div>
      </div>
    )
  }



  
  const fileHandler=(data)=>{
    const formdata = new FormData()

   if (data.url && data.url[0]) {
      formdata.append('url', data.url[0]);
    }

    formdata.append("visibility", "private")

    mutate(formdata,
      {
        onSuccess:()=>{
          setOpenDialog(false)
        }
      }
    )
  }
  
  return (
    <div className="h-screen w-full bg-slate-50 p-9 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">My Files</h1>
              <p className="text-slate-600 mt-1">
                {data?.length || 0} files stored
              </p>
            </div>

            

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
  <DialogTrigger asChild>
    <button
      className="
        px-6 py-2.5 
        bg-slate-900 hover:bg-slate-800 
        text-white text-sm font-semibold
        rounded-lg 
        transition-all 
        shadow-sm 
        flex items-center gap-2
      "
    >
      <span>Add File</span>
      <span className="text-lg leading-none">+</span>
    </button>
  </DialogTrigger>

  <DialogContent className="sm:max-w-md">
    <DialogHeader className="space-y-1">
      <DialogTitle className="text-xl font-semibold text-slate-900">
        Add New File
      </DialogTitle>
      <DialogDescription className="text-sm text-slate-600">
        Upload a file to your workspace
      </DialogDescription>
    </DialogHeader>

    {/* Body */}
    <form
      onSubmit={handleSubmit(fileHandler)}
      className="mt-6 space-y-5"
    >
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">
          File
        </label>

        <input
          type="file"
          {...register("url")}
          className="
            block w-full text-sm text-slate-600
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-slate-100 file:text-slate-700
            hover:file:bg-slate-200
            border border-slate-200 rounded-md
            cursor-pointer
          "
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="
            px-5 py-2
            text-sm font-semibold
            text-white
            bg-slate-900 hover:bg-slate-800
            disabled:opacity-60 disabled:cursor-not-allowed
            rounded-md
            transition-all
          "
        >
          {isPending ? "Uploading..." : "Upload File"}
        </button>
      </div>
    </form>
  </DialogContent>
</Dialog>


          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Files Grid */}
        {filteredFiles?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredFiles.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all group"
              >
                {/* File Preview */}
                <div className="aspect-square bg-slate-50 flex items-center justify-center relative">
                  <span className="text-6xl">{getFileIcon(item.name)}</span>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => window.open(item.url, '_blank')}
                      className="w-10 h-10 bg-white hover:bg-slate-100 rounded-lg flex items-center justify-center transition-all"
                      title="Open file"
                    >
                      <ExternalLink className="w-4 h-4 text-slate-900" />
                    </button>
                    <button
                      onClick={() => {
                        const link = document.createElement('a')
                        link.href = item.url
                        link.download = item.name
                        link.click()
                      }}
                      className="w-10 h-10 bg-white hover:bg-slate-100 rounded-lg flex items-center justify-center transition-all"
                      title="Download file"
                    >
                      <Download className="w-4 h-4 text-slate-900" />
                    </button>
                  </div>
                </div>

                {/* File Info */}
                <div className="p-3 border-t border-slate-200">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate" title={item.name}>
                        {item.name || 'Untitled'}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {formatFileSize(item.size)}
                      </p>
                    </div>

                    {/* Actions Menu */}
                    <Popover
                      open={deletePopoverId === item._id}
                      onOpenChange={(open) => setDeletePopoverId(open ? item._id : null)}
                    >
                      <PopoverTrigger
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 hover:bg-slate-100 rounded-lg transition-all"
                      >
                        <MoreVertical className="w-4 h-4 text-slate-600" />
                      </PopoverTrigger>

                      <PopoverContent 
                        align="end" 
                        className="w-48 p-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => window.open(item.url, '_blank')}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-all text-left"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Open File
                        </button>
                        <button
                          onClick={() => {
                            const link = document.createElement('a')
                            link.href = item.url
                            link.download = item.name
                            link.click()
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-all text-left"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                        <div className="h-px bg-slate-200 my-1" />
                        <button
                          onClick={() => handleDeleteFile(item._id, item.name)}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all text-left"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Quick Actions */}
                  <button
                    onClick={() => window.open(item.url, '_blank')}
                    className="w-full mt-2 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all"
                  >
                    View File
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-16 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <File className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {searchQuery ? 'No files found' : 'No files yet'}
            </h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              {searchQuery 
                ? `No files match "${searchQuery}". Try a different search.`
                : 'Upload your first file to get started. Supported formats: PDF, DOC, images, and more.'
              }
            </p>
            {!searchQuery && (
              <button className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-all shadow-sm">
                Upload File
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyFiles
