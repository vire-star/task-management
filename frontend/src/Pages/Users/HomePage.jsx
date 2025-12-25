// Navbar.jsx
import React, { useState } from 'react'
import { 
  Search, 
  Bell, 
  Upload, 
  UserPlus, 
  Menu, 
  X,
  LayoutDashboard,
  CheckSquare,
  Users,
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { userStore } from '@/store/userStore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const navigate = useNavigate()
  const user = userStore((state) => state.user)

  const handleLogout = () => {
    // Logout logic here
    navigate('/login')
  }

  return (
    <nav className="w-full h-[12vh] bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Left Section - Logo & Search */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                TaskFlow
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Project Manager
              </p>
            </div>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 w-80 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent transition-all">
            <Search className="w-4 h-4 text-slate-400 mr-3" />
            <input
              type="text"
              placeholder="Search tasks, files, users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm text-slate-900 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Right Section - Actions & Profile */}
        <div className="flex items-center gap-4">
          {/* Upload File Button */}
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all">
                <Upload className="w-4 h-4" />
                <span className="text-sm">Upload</span>
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Files</DialogTitle>
                <DialogDescription>
                  Upload documents, images, or any files to your workspace
                </DialogDescription>
              </DialogHeader>
              <UploadFileForm onClose={() => setIsUploadDialogOpen(false)} />
            </DialogContent>
          </Dialog>

          {/* Invite User Button */}
          <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
            <DialogTrigger asChild>
              <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg">
                <UserPlus className="w-4 h-4" />
                <span className="text-sm">Invite</span>
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to collaborate on your projects
                </DialogDescription>
              </DialogHeader>
              <InviteUserForm onClose={() => setIsInviteDialogOpen(false)} />
            </DialogContent>
          </Dialog>

          {/* Notifications */}
          <button className="relative p-2 hover:bg-slate-100 rounded-xl transition-all">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 hover:bg-slate-50 rounded-xl p-2 transition-all">
                <div className="w-9 h-9 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <ChevronDown className="w-4 h-4 text-slate-600 hidden md:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-semibold text-slate-900">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/tasks')}>
                <CheckSquare className="w-4 h-4 mr-2" />
                My Tasks
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/team')}>
                <Users className="w-4 h-4 mr-2" />
                Team
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-slate-100 rounded-xl transition-all"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-600" />
            ) : (
              <Menu className="w-6 h-6 text-slate-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[12vh] left-0 right-0 bg-white border-b border-slate-200 shadow-lg">
          <div className="p-4 space-y-3">
            {/* Mobile Search */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
              <Search className="w-4 h-4 text-slate-400 mr-3" />
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 bg-transparent outline-none text-sm"
              />
            </div>

            {/* Mobile Actions */}
            <button 
              onClick={() => setIsUploadDialogOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all"
            >
              <Upload className="w-5 h-5" />
              Upload File
            </button>
            
            <button 
              onClick={() => setIsInviteDialogOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all"
            >
              <UserPlus className="w-5 h-5" />
              Invite User
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar

// Upload File Form Component
const UploadFileForm = ({ onClose }) => {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e) => {
    e.preventDefault()
    setUploading(true)
    // Upload logic here
    setTimeout(() => {
      setUploading(false)
      onClose()
    }, 2000)
  }

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-emerald-500 transition-all cursor-pointer">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-sm font-semibold text-slate-700">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-slate-500 mt-1">
            PDF, PNG, JPG, DOC (max 10MB)
          </p>
        </label>
        {file && (
          <p className="mt-4 text-sm text-emerald-600 font-semibold">
            Selected: {file.name}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!file || uploading}
          className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </form>
  )
}

// Invite User Form Component
const InviteUserForm = ({ onClose }) => {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('member')
  const [sending, setSending] = useState(false)

  const handleInvite = async (e) => {
    e.preventDefault()
    setSending(true)
    // Invite logic here
    setTimeout(() => {
      setSending(false)
      onClose()
    }, 2000)
  }

  return (
    <form onSubmit={handleInvite} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="colleague@company.com"
          required
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Role
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
          <option value="viewer">Viewer</option>
        </select>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={sending}
          className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? 'Sending...' : 'Send Invite'}
        </button>
      </div>
    </form>
  )
}
