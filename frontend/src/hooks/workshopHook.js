import { acceptInvitationApi, getAllWorkShopApi } from '@/Api/workshop.api'
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