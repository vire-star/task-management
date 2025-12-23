import axios from "axios"
import { BaseUrl } from "./BaseUrl.js"

export const registerApi = async(payload)=>{
    const res = await axios.post(`${BaseUrl}/register`,
        payload,
        {
            headers:{'Content-Type':'Application/json'},
            withCredentials:true
        }
    )
    return res.data
}
export const loginApi = async(payload)=>{
    const res = await axios.post(`${BaseUrl}/login`,
        payload,
        {
            headers:{'Content-Type':'Application/json'},
            withCredentials:true
        }
    )
    return res.data
}
export const logoutApi = async()=>{
    const res = await axios.post(`${BaseUrl}/logout`,
        {},
        {
            headers:{'Content-Type':'Application/json'},
            withCredentials:true
        }
    )
    return res.data
}
export const getUserApi = async()=>{
    const res = await axios.get(`${BaseUrl}/getUser`,
        
        {
            headers:{'Content-Type':'Application/json'},
            withCredentials:true
        }
    )
    return res.data
}