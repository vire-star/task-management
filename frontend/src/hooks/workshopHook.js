import { acceptInvitationApi, createWorkshopApi, deleteWorkshop, getInvitedWorkshopApi, getMyWorkShopApi, getTotalMemberInWorkshopApi, inviteMemberToWorkshopApi, leaveWorkshopApi, removeUserfromWorkshopApi } from '@/Api/workshop.api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
export const useGetMyWorkshopHook = ()=>{
    return useQuery({
        queryFn:getMyWorkShopApi,
        queryKey:['getMyWorkshop'],
         refetchOnMount: true,

    })
}
export const useGetInvitedWorkshopHook = ()=>{
    return useQuery({
        queryFn:getInvitedWorkshopApi,
        queryKey:['getInvitedWorkshop'],
         refetchOnMount: true,

    })
}


export const useAcceptInvitation=()=>{
    const navigate = useNavigate()
    return useMutation({
        mutationFn:acceptInvitationApi,
        onSuccess:(data)=>{
            toast.success(data.message)
            navigate('/')


        },
        onError:(err)=>{
            console.log(err)
        }

    })
}


export const useLeaveWorkshopHook =()=>{
    return useMutation({
        mutationFn:(id)=>leaveWorkshopApi(id),
        onSuccess:(data)=>{
            toast.success(data.message)
        },

        onError:(err)=>{
            toast.error(err.response?.data?.message)
        }

    })
}



export const useGetTotalMemberInWorkshopHook=(id)=>{
    return useQuery({
        queryKey:['getTotalMemberWorkshop',id],
        queryFn:()=>getTotalMemberInWorkshopApi(id),
        enabled:!!id
    })
}



export const useDeleteWorkshop = ()=>{
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:deleteWorkshop,
        onSuccess:(data)=>{
            queryClient.invalidateQueries(['getMyWorkshop'])
            toast.success(data.message),
            console.log(data)
        },
        onError:(err)=>{
            console.log(err)
        }
    })
}

export const useRemoveUserFromWorkshopHook=()=>{
    return useMutation({
        mutationFn:removeUserfromWorkshopApi,
        onSuccess:(data)=>{
            console.log(data)
        },
        onError:(err)=>{
            console.log(err)
        }
    })
}




export const useInviteMemberToWorkshopHook = () => {
//   const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: inviteMemberToWorkshopApi,
    
    onSuccess: (data) => {
      console.log('Invitation sent:', data)
      
      // ✅ Invalidate queries to refetch updated data
    //   queryClient.invalidateQueries(['myWorkshops'])
    //   queryClient.invalidateQueries(['workshopMembers'])
      
      toast.success(data.message || 'Invitation sent successfully')
    },
    
    onError: (error) => {
      console.error('Invitation error:', error)
      const errorMsg = error?.response?.data?.message || 'Failed to send invitation'
      toast.error(errorMsg)
    }
  })
}






export const useCreateWorkshopHook=()=>{
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:createWorkshopApi,
        onSuccess:(data)=>{
            console.log(data)
            toast.success(data.message)
            queryClient.invalidateQueries(['getMyWorkshop'])
        },
        onError:(err)=>{
            toast.error(err.response.data.message)
        }
    })
}