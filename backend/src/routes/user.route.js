import express from "express";
import { getUser, Login, logout, registerUser, updateProfile } from "../controller/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { upload } from "../config/imagekit.js";


const userRoute = express.Router()

userRoute.post('/register', registerUser)
userRoute.post('/login', Login)
userRoute.get('/getUser',authMiddleware, getUser)
userRoute.post('/logout',authMiddleware, logout)
userRoute.post('/updateProfile', authMiddleware, upload.single('avatarUrl'), updateProfile)


export default userRoute