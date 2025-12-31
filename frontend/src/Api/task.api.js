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

export const assignUserToTaskApi =async({taskId, userId})=>{
    const res =await axios.post(`${BaseUrl}/task/assignToTask/${taskId}`,
        {userId},
         {
            headers:{'Content-Type':"application/json"},
            withCredentials:true
        }

    )
    return res.data
}


export const createTask = async({workshopId, title, description})=>{
    const res = await axios.post(`${BaseUrl}/task/createTask/${workshopId}`,
        {title,description},
        {
             headers:{'Content-Type':"application/json"},
            withCredentials:true
        }
    )

    return res.data
}


// delteTask/:id


export const deleteTask = async(id)=>{
    const res = await axios.delete(`${BaseUrl}/task/delteTask/${id}`,
        {
         headers:{'Content-Type':"application/json"},
            withCredentials:true
        }
    )

    return res.data
}