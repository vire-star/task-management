import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Bell, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react'
import { useGetNotification } from '@/hooks/notification.hook'

const Notification = () => {
  const { data: notifications = [], isLoading, error } = useGetNotification()
  
  
  // Type badge colors (pure Tailwind)
  const getTypeBadge = (type) => {
    switch(type?.toLowerCase()) {
      case 'success': 
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1"/> Success
          </span>
        )
      case 'error': 
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1"/> Error
          </span>
        )
      case 'warning': 
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertCircle className="w-3 h-3 mr-1"/> Warning
          </span>
        )
      default: 
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
            Info
          </span>
        )
    }
  }

  return (
    <Dialog>
      <DialogTrigger className="text-xs font-medium text-slate-400 uppercase flex items-center justify-start gap-2 cursor-pointer hover:text-slate-200 transition-colors p-1 rounded-sm hover:bg-slate-800/50">
        <div className="relative">
          <Bell size={15}/>
          {notifications?.length > 0 && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"/>
          )}
        </div>
        Notifications
      </DialogTrigger>
      
      <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader className="border-b border-slate-200 pb-4 mb-4">
          <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-500"/>
            Notifications
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            {notifications?.length} new updates
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-3 px-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-sm text-slate-500 flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-400 rounded-full animate-spin"/>
                Loading...
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-sm text-slate-500">
              Failed to load notifications
            </div>
          ) : notifications?.notifications?.length === 0 ? (
            <div className="text-center py-12 text-sm text-slate-500">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50"/>
              No notifications yet
            </div>
          ) : (
            notifications?.notifications?.map((item, index) => (
              <div 
                key={item.id || index}
                className="group p-4 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl hover:shadow-lg hover:border-slate-300 hover:bg-white transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              >
                <div className="flex gap-3">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0">
                    {item.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500"/>}
                    {item.type === 'error' && <XCircle className="w-5 h-5 text-red-500"/>}
                    {item.type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-500"/>}
                    {item.type === 'info' && <Bell className="w-5 h-5 text-blue-500"/>}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-medium text-sm text-slate-900 truncate group-hover:text-slate-700 flex-1 min-w-0">
                        {item.message}
                      </p>
                      {getTypeBadge(item.type)}
                    </div>
                    
                    {item.time && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="w-3 h-3"/>
                        <span>{item.time}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <div className="pt-4 mt-auto border-t border-slate-200">
            <button className="w-full text-xs text-slate-500 hover:text-slate-700 font-medium py-2 transition-colors hover:bg-slate-50 rounded-lg">
              Mark all as read
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default Notification
