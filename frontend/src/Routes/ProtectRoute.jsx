import { useGetUserHook } from "@/hooks/userHooks"
import { userStore } from "@/store/userStore"
import { Navigate } from "react-router-dom"

export const ProtectRoute  =({children})=>{

    const setUser = userStore((state)=>state.setUser)
    const {data,isLoading,  isError } = useGetUserHook()

    if(data){
        setUser(data)
    }

    if(isLoading){
        return <div className="h-screen w-screen flex items-center justify-center">
            <h1 className="text-2xl font-extrabold">...Loading</h1>
        </div>
    }

    if(isError){
        console.log(isError)
    }

    if(!data){
        return <Navigate to={'/login'} replace/>

    }

    return children
}