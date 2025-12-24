import { getPrivateFileApi, getSpeceficFileApi } from '@/Api/file.api'
import { useQuery } from '@tanstack/react-query'

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