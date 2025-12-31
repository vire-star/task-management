import axios from "axios"
import { BaseUrl } from "./BaseUrl"

export const getSpeceficFileApi = async(id)=>{
    const res = await axios.get(`${BaseUrl}/file/speceficFile/${id}`,
        {
            headers:{'Content-Type':"Application/json"},
            withCredentials:true
        }
    )

    return res.data
}
export const getPrivateFileApi = async()=>{
    const res = await axios.get(`${BaseUrl}/file/getPrivateFile`,
        {
            headers:{'Content-Type':"Application/json"},
            withCredentials:true
        }
    )

    return res.data
}

// { visibility, workshopId, taskId }
export const createFileApi = async(payload)=>{
    const res = await axios.post(`${BaseUrl}/file/createFile`,
        payload,
        {
            'Content-Type': 'multipart/form-data' ,
            withCredentials:true
        }
    )

    return res.data
}