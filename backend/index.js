import express from "express";
import { connectDB } from "./src/config/db.js";
import cookieParser from "cookie-parser";

import { ENV } from "./src/config/env.js";
import userRoute from "./src/routes/user.route.js";
import workShopRoute from "./src/routes/workshop.route.js";
import taskRoute from "./src/routes/task.route.js";
import notificationRoute from "./src/routes/notification.route.js";
import commentRoute from "./src/routes/comment.route.js";

import cors from 'cors'
import fileRoute from "./src/routes/file.route.js";

const app = express()

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use('/api',userRoute)
app.use('/api/workshop', workShopRoute)
app.use('/api/task', taskRoute)
app.use('/api/notification', notificationRoute)
app.use('/api/comment', commentRoute)
app.use('/api/file', fileRoute)


app.listen(ENV.PORT,()=>{
    connectDB()
    console.log(`server started ${ENV.PORT} `)
})