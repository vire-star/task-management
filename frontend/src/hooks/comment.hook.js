import { addCommentApi, getAllCommentApi, getTotalAssigneApi } from '@/Api/comment.api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'


export const useGetAllCommentHook = (id)=>{
    return useQuery({
        queryKey:['getAllComment', id],
        queryFn:()=>getAllCommentApi(id),
        enabled:!!id
    })
}


export const useGetAllAssigneHook = (id)=>{
    return useQuery({
        queryKey:['getTotalAssigne', id],
        queryFn:()=>getTotalAssigneApi(id),
        enabled:!!id
    })
}


export const useAddCommentHook = ()=>{
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:addCommentApi,
        onSuccess:(data)=>{
            toast.success(data.message)
            queryClient.invalidateQueries(['getAllComment'])
        },
        onError:(err)=>{
            console.log(err)
        }

    })
}