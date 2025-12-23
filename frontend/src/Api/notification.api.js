import axios from "axios"
import { BaseUrl } from "./BaseUrl"

export const getNotificationApi = async()=>{
    const res = await axios.get(`${BaseUrl}/notification/getNotification`,
        {
            headers:{'Content-Type':"Application/json"},
            withCredentials:true
        }
    )
    return res.data
}