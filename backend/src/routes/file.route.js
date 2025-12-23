import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createFile, deleteFile, getPrivateFile, speceficFile } from "../controller/file.controller.js";
import { upload } from "../config/imagekit.js";
import { fileMiddleware } from "../middleware/file.middleware.js";


const fileRoute = express.Router()


fileRoute.post('/createFile', authMiddleware, upload.single("url"), createFile)
fileRoute.delete('/deleteFile/:id', authMiddleware, fileMiddleware, deleteFile)
fileRoute.get('/getPrivateFile', authMiddleware, getPrivateFile )
fileRoute.get('/speceficFile/:id', authMiddleware, speceficFile )

export default fileRoute