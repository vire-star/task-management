import { createFileApi, getPrivateFileApi, getSpeceficFileApi } from '@/Api/file.api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useGetSpeceficFile=(id)=>{
    return useQuery({
        queryKey:['speceficFile', id],
        queryFn:()=>getSpeceficFileApi(id),
        enabled:!!id
    })
}
export const useGetPrivateFileHook=()=>{
    return useQuery({
        queryKey:['getPrivateFile'],
        queryFn:getPrivateFileApi
        
    })
}


export const useCreateFileHookk = ()=>{
    const queryclient = useQueryClient()
    return  useMutation({
        mutationFn:createFileApi,
        onSuccess:(data)=>{
            toast.success(data.message)
            queryclient.invalidateQueries(['getPrivateFile'])
        },
        onError:(err)=>{
            console.log(err)
        }
    })


}