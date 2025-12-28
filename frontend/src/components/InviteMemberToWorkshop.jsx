import { User2Icon } from 'lucide-react'
import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { useInviteMemberToWorkshopHook } from '@/hooks/workshopHook'
import { toast } from 'sonner'

const InviteMemberToWorkshop = ({ item }) => {
  const [email, setEmail] = useState('')
  
  const [isOpen, setIsOpen] = useState(false)
  
  const { mutate: inviteMember, isLoading } = useInviteMemberToWorkshopHook()

  const handleInvite = (e) => {
    e.preventDefault()
    e.stopPropagation()

    // ✅ Validation
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }

    // ✅ Send invitation
    inviteMember(
      {
        workshopId: item._id,
        email,
        role:"member"
      },
      {
        onSuccess: () => {
          setEmail('')  // Clear form
         
          setIsOpen(false)  // Close popover
        }
      }
    )
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(true)
        }}
        className="text-xs text-slate-800 font-bold rounded-md flex items-center justify-start gap-2 cursor-pointer hover:text-slate-600 transition-colors duration-200 px-2 py-1 hover:bg-slate-100"
      >
        <User2Icon size={16} />
        Invite Member
      </PopoverTrigger>
      
      <PopoverContent 
        align="start"
        onClick={(e) => e.stopPropagation()}
        className="w-80"
      >
        <form onSubmit={handleInvite} className="space-y-3">
          <div>
            <h4 className="font-bold text-slate-900 mb-1">
              Invite Team Member
            </h4>
            <p className="text-xs text-slate-500">
              Send an invitation to join <strong>{item.name}</strong>
            </p>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input 
              type="email" 
              placeholder="colleague@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
              required
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Role
            </label>
          
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsOpen(false)
              }}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send Invite'}
            </button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}

export default InviteMemberToWorkshop
