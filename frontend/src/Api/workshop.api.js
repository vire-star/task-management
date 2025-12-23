import axios from "axios"
import { BaseUrl } from "./BaseUrl"

export const getAllWorkShopApi = async()=>{
    const res = await axios.get(`${BaseUrl}/workshop/getAllWorkshop`,
        {
            headers:{'Content-Type':"Application/json"},
            withCredentials:true
        }
    )

    return res.data
}
export const acceptInvitationApi = async(id)=>{
    const res = await axios.post(`${BaseUrl}/workshop/acceptInvitation/${id}`,
        {},
        {
            headers:{'Content-Type':"Application/json"},
            withCredentials:true
        }
    )

    return res.data
}
export const leaveWorkshopApi = async(id)=>{
    const res = await axios.delete(`${BaseUrl}/workshop/leaveWorkshop/${id}`,
       
        {
            headers:{'Content-Type':"application/json"},
            withCredentials:true
        }
    )

    return res.data
}
