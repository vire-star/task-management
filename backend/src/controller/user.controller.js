import { User } from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { ENV } from "../config/env.js";
import { imagekit } from "../config/imagekit.js";
import { Invitation } from "../models/invitationSchema.model.js";
import { WorkshopMember } from "../models/workshopMember.model.js";
import { Notification } from "../models/notification.model.js";
export const registerUser = async(req, res) => {
  try {
    const { name, email, password, inviteToken } = req.body;

    console.log('📥 Register payload:', { name, email, inviteToken }) // ✅ Debug

    if (!name || !email || !password) {
      return res.status(401).json({
        message: "Please provide all the details"
      })
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(401).json({
        message: "User already exist please try with another email"
      })
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({
      name, 
      email,
      password: hashPassword
    })

    const token = await jwt.sign({ userId: newUser._id }, ENV.JWT_SECRET)

    let workshopId = null

    // ✅ Auto-accept invitation if token provided
    if (inviteToken) {
      console.log('🔍 Checking invitation for token:', inviteToken) // ✅ Debug

      const invitation = await Invitation.findOne({
        token: inviteToken,
        email,
        status: "pending",
        expiresAt: { $gt: new Date() },
      })

      console.log('📧 Invitation found:', invitation ? 'YES' : 'NO') // ✅ Debug

      if (invitation) {
        console.log('✅ Adding user to workshop:', invitation.workshopId) // ✅ Debug

        // Add user to workshop
        await WorkshopMember.create({
          workshopId: invitation.workshopId,
          userId: newUser._id,
          role: invitation.role,
          status: "active",
        })

        // Mark invitation as accepted
        invitation.status = "accepted"
        await invitation.save()

        // Create notification
        await Notification.create({
          recipientId: newUser._id,
          actorId: invitation.invitedBy,
          type: "WORKSHOP_MEMBER_ADDED",
          workshopId: invitation.workshopId,
          message: `You joined the workshop`
        })

        workshopId = invitation.workshopId
        console.log('🎉 Workshop joined successfully:', workshopId) // ✅ Debug
      }
    }

    // ✅ Consistent response structure
    return res.status(200)
      .cookie("token", token, { 
        maxAge: 1 * 24 * 60 * 60 * 1000, 
        httpOnly: true, 
        secure: true, 
        sameSite: "none"
      })
      .json({
        message: workshopId 
          ? `Welcome ${newUser.name}! Workshop joined successfully` 
          : `Welcome ${newUser.name}`,
        success: true,
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email
        },
        workshopId // ✅ Always include (null if no invite)
      })

  } catch (error) {
    console.log('❌ Error in register controller:', error)
    return res.status(500).json({
      message: "Internal server error",
      success: false
    })
  }
}


export const Login = async(req, res)=>{
    try {
        const {email, password}= req.body;

        if(!email || !password){
            return res.status(401).json({
                message:"Please provide all the details"
            })
        }

        const user = await User.findOne({email})
        if(!user){
            return res.status(401).json({
                message:"User not found, please use different credentials"
            })
        }


        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if(!isPasswordCorrect){
             return res.status(401).json({
                message:"User not found, please use different credentials"
            })
        }


        const token = await jwt.sign({userId : user._id},ENV.JWT_SECRET)


           return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true, sameSite: "none",  }).json({
            message: `Welcome  ${user.name}`,
            
            success: true
        })
    } catch (error) {
        console.log(error, "from login controller")
    }
}





export const getUser = async(req,res)=>{
    try {
        const userId = req.id;

        const user = await User.findById(userId)

        if(!user){
            return res.status(401).json({
                message:"User not found"
            })
        }

        return res.status(201).json(user)
    } catch (error) {
        console.log(`error from getUser, ${error}`)
    }
}



export const logout = async(req,res)=>{
    try {
        return res.status(201).cookie("token","").json({
            message:"User logged out successfully"
        })
    } catch (error) {
        console.log(`error from logout, ${error}`)
    }
}


export const updateProfile = async(req,res)=>{
    try {
        
        const userId = req.id
        const {name} = req.body
        const updateData = {}

        if(name){
            updateData.name = name
        }

        if(req.file){
             const uploadResponse = await imagekit.upload({
      file: req.file.buffer, // Buffer from multer
      fileName: req.file.originalname,
      folder: '/user', // Optional: organize in folders
     
    });

    updateData.avatarUrl = uploadResponse.url
        }

        


        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            {new:true}
        )

        if(!user){
            return res.status(401).json({
                message:"User not found"
            })
        }


        return res.status(201).json({
            message:"Profile udpated successfylly",
            user
        })


    } catch (error) {
        console.log(error,"from update profile")
    }
}