import { Notification } from "../models/notification.model.js"

export const getNotification = async(req ,res)=>{
    try {
        const userId = req.id 

        const notification = await Notification.find({recipientId:userId}).sort({ createdAt: -1 })

        if(!notification){
            return res.status(201).json({
                message:"There is no notification"
            })
        }

        return res.status(201).json(notification)
    } catch (error) {
        console.log(`error from getNotification`)
    }
}