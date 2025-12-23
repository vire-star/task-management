import { acceptInvitationApi, getAllWorkShopApi, leaveWorkshopApi } from '@/Api/workshop.api'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
export const useGetAllWorkshopHook = ()=>{
    return useQuery({
        queryFn:getAllWorkShopApi,
        queryKey:['getAllWorkshop'],
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

