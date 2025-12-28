import { getNotificationApi, readAllNotificationApi, readSingleNotifiation } from '@/Api/notification.api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useGetNotification = ()=>{
    return useQuery({
        queryKey:['getNotification'],
        queryFn:getNotificationApi
    })
}


export const useReadSingleNotification=()=>{
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:readSingleNotifiation,
        onSuccess:(data)=>{
            console.log(data)
            toast.success(data.message)
            queryClient.invalidateQueries(['getNotification'])
        },
        onError:(err)=>{
            console.log(err)
        }
    })
}


export const useReadAllNotification= ()=>{
     const queryClient = useQueryClient()
    return useMutation({
        mutationFn:readAllNotificationApi,
        onSuccess:(data)=>{
            toast.success(data.message)
            queryClient.invalidateQueries(['getNotification'])
            // console.log(data)
        },
        onError:(err)=>{
            console.log(err)
        }
    })
}