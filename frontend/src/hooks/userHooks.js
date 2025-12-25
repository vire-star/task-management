
import { getUserApi, loginApi, logoutApi, registerApi } from "@/Api/user.api"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"


export const useRegisterHook = ()=>{
    const navigate = useNavigate()
    return useMutation({
        mutationFn:registerApi,
        onSuccess:(data)=>{
            toast.success(data.message)
            navigate('/workshops')
        },
        onError:(err)=>{
            toast.error(err.response.data.message)
        }
    })
}
export const useLoginHook = ()=>{
    const navigate = useNavigate()
    return useMutation({
        mutationFn:loginApi,
        onSuccess:(data)=>{
            toast.success(data.message)
            navigate('/workshops')
        },
        onError:(err)=>{
             toast.error(err.response.data.message)
        }
    })
}

export const useLogoutHook = ()=>{
    const navigate = useNavigate()
    return useMutation({
        mutationFn:logoutApi,
        onSuccess:(data)=>{
            toast.success(data.message)
            navigate ('/')
        },
        onError:(err)=>{
            toast.error(err.response.data.message)
        }
    })
}


export const useGetUserHook = ()=>{
    return useQuery({
        queryFn:getUserApi,
        queryKey:['getUser'],
        retry:false
    })
}