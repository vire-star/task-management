import axios from "axios"
import { BaseUrl } from "./BaseUrl"

export const getAllCommentApi = async(id)=>{
    const res = await axios.get(`${BaseUrl}/comment/getAllComment/${id}`,
        {
            headers:{'Content-Type':"Application/json"},
            withCredentials:true
        }
    )

    return res.data
}


export const getTotalAssigneApi = async(id)=>{
    const res = await axios.get(`${BaseUrl}/comment/getTaskAssigne/${id}`,
         {
            headers:{'Content-Type':"Application/json"},
            withCredentials:true
        }
    )

    return res.data
}

export const addCommentApi = async({payload,id})=>{
    const res = await axios.post(`${BaseUrl}/comment/addComment/${id}`,
        payload,
        {
             headers:{'Content-Type':"Application/json"},
            withCredentials:true
        }
    )

    return res.data
}