import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { addComment, getAllComment, totalAssigne } from "../controller/comment.controller.js";


const commentRoute =express.Router()


commentRoute.post('/addComment/:id', authMiddleware, addComment)
commentRoute.get('/getAllComment/:id', authMiddleware, getAllComment)
commentRoute.get('/getTaskAssigne/:id', authMiddleware, totalAssigne)


export default commentRoute