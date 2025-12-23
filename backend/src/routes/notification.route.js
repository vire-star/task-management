import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getNotification } from "../controller/notification.controller.js";


const notificationRoute = express.Router()

notificationRoute.get('/getNotification', authMiddleware, getNotification)


export default notificationRoute