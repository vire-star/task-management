import jwt from "jsonwebtoken"
import { ENV } from "../config/env.js"

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.token

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized: Token missing",
      })
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET)

    req.id = decoded.userId
    next()

  } catch (error) {
    console.error("Auth middleware error:", error.message)

    return res.status(401).json({
      message: "Unauthorized: Invalid or expired token",
    })
  }
}
