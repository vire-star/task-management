import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {  getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "../controller/notification.controller.js";


const notificationRoute = express.Router()

notificationRoute.get('/getNotification', authMiddleware, getNotifications)
notificationRoute.put('/read/:id', authMiddleware, markNotificationAsRead);

// ✅ Mark ALL read (Main feature!)
notificationRoute.put('/read-all', authMiddleware, markAllNotificationsAsRead);



export default notificationRoute