import mongoose from "mongoose"
import { ENV } from "./env.js"

export const connectDB = async()=>{
    try {
        await mongoose.connect(ENV.MONGO_URI)
        console.log('db')
    } catch (error) {
        console.log(error)
    }
}