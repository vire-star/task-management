import axios from "axios"
import { BaseUrl } from "./BaseUrl"

export const getMyWorkShopApi = async()=>{
    const res = await axios.get(`${BaseUrl}/workshop/getMyWorkshop`,
        {
            headers:{'Content-Type':"Application/json"},
            withCredentials:true
        }
    )

    return res.data
}

export const getInvitedWorkshopApi = async()=>{
    const res = await axios.get(`${BaseUrl}/workshop/getInvitedWorkshop`,
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

export const getTotalMemberInWorkshopApi = async(id)=>{
    const res = await axios.get(`${BaseUrl}/workshop/getTotalMember/${id}`,
       
        {
            headers:{'Content-Type':"application/json"},
            withCredentials:true
        }
    )

    return res.data
}



export const deleteWorkshop=async(id)=>{
    const res = await axios.delete(`${BaseUrl}/workshop/deleteWorkshop/${id}`,
       
        {
             headers:{'Content-Type':"application/json"},
            withCredentials:true
        }
    )

    return res.data
}


export const removeUserfromWorkshopApi = async ({ workshopId, deleteUserId }) => {
  // ✅ Destructure karke workshopId URL mein aur deleteUserId body mein
  const res = await axios.post(
    `${BaseUrl}/workshop/removeUserFromWorkshop/${workshopId}`,  // ✅ URL param
    { deleteUserId },  // ✅ Body payload
    {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    }
  )
  return res.data
}


// inviteMember
export const inviteMemberToWorkshopApi = async ({ workshopId, email, role }) => {
  const res = await axios.post(
    `${BaseUrl}/workshop/inviteMember/${workshopId}`,
    { 
      email,   // ✅ Required by backend
      role     // ✅ Required by backend
    },
    {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    }
  )
  return res.data
}


// getInvitedWorkshop

