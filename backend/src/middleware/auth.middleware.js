import jwt from 'jsonwebtoken'
import { ENV } from '../config/env.js'

export const authMiddleware = async(req ,res ,next)=>{
  try {
    const Token = req.cookies.token

    if(!Token){
      return res.status(401).json({
        message:"Token not found"
      })
    }

    const decode = await jwt.verify(Token, ENV.JWT_SECRET)

    if(!decode){
      return res.status(401).json({
        message:"Please login first"
      })
    }

    req.id = decode.userId
    next()
  } catch (error) {
    console.log(error, "from authMiddlware controller")
  }
}