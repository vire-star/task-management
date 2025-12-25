import axios from "axios"
import { BaseUrl } from "./BaseUrl"

export const getTaskApi = async(id)=>{
    const res = await axios.get(`${BaseUrl}/task/getAllTask/${id}`,
        {
            headers:{'Content-Type':"Application/json"},
            withCredentials:true
        }
    )

    return res.data
}


export const updateStatusApi= async({taskId, status})=>{
    const res = await axios.post(`${BaseUrl}/task/changeTaskStatus/${taskId}`,
        {status},
        {
            headers:{'Content-Type':"Application/json"},
            withCredentials:true
        }

    )

    return res.data
}
export const getSingleTaskApi= async(id)=>{
    const res = await axios.get(`${BaseUrl}/task/getSingleTask/${id}`,
       
        {
            headers:{'Content-Type':"Application/json"},
            withCredentials:true
        }

    )

    return res.data
}
export const getTasksAssignedToUser= async(id)=>{
    const res = await axios.get(`${BaseUrl}/task/getUserAssignedTask/${id}`,
       
        {
            headers:{'Content-Type':"application/json"},
            withCredentials:true
        }

    )

    return res.data
}

// getUserAssignedTask