import axios from "axios"
import { BaseUrl } from "./BaseUrl"

export const getNotificationApi = async()=>{
    const res = await axios.get(`${BaseUrl}/notification/getNotification`,
        {
            headers:{'Content-Type':"application/json"},
            withCredentials:true
        }
    )
    return res.data
}


export const readSingleNotifiation = async(id)=>{
    const res = await axios.put(`${BaseUrl}/notification/read/${id}`,
        {},
        {
            headers:{'Content-Type':'applicatioin/json'},
            withCredentials:true
        }
    )
    return res.data
}



export const readAllNotificationApi = async()=>{
    const res = await axios.put(`${BaseUrl}/notification/read-all`,
        {},
        {
             headers:{'Content-Type':'applicatioin/json'},
            withCredentials:true

        }
    )

    return res.data
}