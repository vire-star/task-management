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