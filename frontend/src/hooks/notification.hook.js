import { getNotificationApi } from '@/Api/notification.api'
import { useQuery } from '@tanstack/react-query'

export const useGetNotification = ()=>{
    return useQuery({
        queryKey:['getNotification'],
        queryFn:getNotificationApi
    })
}