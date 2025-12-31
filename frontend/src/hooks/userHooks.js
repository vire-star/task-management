
import { getUserApi, loginApi, logoutApi, registerApi, updateProfile } from "@/Api/user.api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
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


export const useUpdateProfileHook = ()=>{
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:updateProfile,
        onSuccess:(data)=>{
            queryClient.invalidateQueries(['getUser'])
            toast.success(data.message)
        },
        onError:(err)=>{
            console.log(err)
        }

    })
}