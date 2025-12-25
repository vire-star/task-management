// import { transporter } from "../config/email.js";
import { Invitation } from "../models/invitationSchema.model.js";
import { User } from "../models/user.model.js";
import { Workshop } from "../models/workshop.model.js";
import {Notification} from '../models/notification.model.js'
import crypto from 'crypto'
import { WorkshopMember } from "../models/workshopMember.model.js";
import { Task } from "../models/task.model.js";
import { transporter } from "../config/email.js";
import { ENV } from "../config/env.js";

export const createWorkshop=async(req ,res )=>{
    try {
        const {name, description} = req.body;
        const userId = req.id

        if(!name || !description){
            return res.status(401).json({
                message:"Please provide all the details"
            })
        }

        if(!userId){
            return res.status(401).json({
                message:"Please login first"
            })
        }

        const user = await User.findById(userId)
        if(!user){
            return res.status(401).json({
                message:"User not found"
            })
        }

       const workshop =  await Workshop.create({
        name, 
        description,
        ownerId:userId
       })

       return res.status(201).json({
        message:"Workshop create successfully",
        workshop
       })
    } catch (error) {
        console.log(`error from create workshop ,${error}`)
    }
}


// workshop.controller.js

// ✅ 1. Get workshops YOU CREATED (owner)
export const getMyCreatedWorkshops = async (req, res) => {
  try {
    const userId = req.id

    const workshops = await Workshop.find({ ownerId: userId })
      .sort({ createdAt: -1 })
      .lean()

    // Get member count for each workshop
    const workshopsWithCount = await Promise.all(
      workshops.map(async (workshop) => {
        const memberCount = await WorkshopMember.countDocuments({
          workshopId: workshop._id
        })
        return {
          ...workshop,
          memberCount,
          role: 'owner'  // You're the owner
        }
      })
    )

    res.status(200).json({
      success: true,
      workshops: workshopsWithCount
    })
  } catch (error) {
    console.error('Get created workshops error:', error)
    res.status(500).json({ error: error.message })
  }
}

// ✅ 2. Get workshops WHERE YOU'RE INVITED (member)
export const getInvitedWorkshops = async (req, res) => {
  try {
    const userId = req.id

    // Find all workshops where user is a member
    const memberships = await WorkshopMember.find({ userId })
      .populate({
        path: 'workshopId',
        populate: {
          path: 'ownerId',
          select: 'name email avatarUrl'
        }
      })
      .sort({ createdAt: -1 })
      .lean()

    // Filter out workshops where user is owner
    const invitedWorkshops = memberships
      .filter(membership => 
        membership.workshopId?.ownerId?._id.toString() !== userId.toString()
      )
      .map(membership => ({
        ...membership.workshopId,
        role: membership.role,
        joinedAt: membership.createdAt
      }))

    res.status(200).json({
      success: true,
      workshops: invitedWorkshops
    })
  } catch (error) {
    console.error('Get invited workshops error:', error)
    res.status(500).json({ error: error.message })
  }
}

// ✅ BONUS: Combined endpoint (optional)
export const getAllWorkshopsWithType = async (req, res) => {
  try {
    const userId = req.id

    // Get created workshops
    const createdWorkshops = await Workshop.find({ ownerId: userId })
      .lean()

    // Get invited workshops
    const memberships = await WorkshopMember.find({ userId })
      .populate('workshopId')
      .lean()

    const invitedWorkshops = memberships
      .filter(m => m.workshopId?.ownerId.toString() !== userId.toString())
      .map(m => ({
        ...m.workshopId,
        role: m.role,
        joinedAt: m.createdAt
      }))

    res.status(200).json({
      success: true,
      created: createdWorkshops.map(w => ({ ...w, role: 'owner' })),
      invited: invitedWorkshops
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}







export const getAllWorkshop = async (req, res) => {
  try {
    const userId = req.id;

    // 1️⃣ Workshops where user is OWNER
    const ownedWorkshops = await Workshop.find({ ownerId: userId });

    // 2️⃣ Workshops where user is MEMBER
    const memberEntries = await WorkshopMember
      .find({ userId })
      .populate("workshopId");

    const memberWorkshops = memberEntries.map(m => m.workshopId);

    // 3️⃣ Merge & remove duplicates
    const allWorkshops = [
      ...ownedWorkshops,
      ...memberWorkshops
    ];

    return res.status(200).json({
      workshops: allWorkshops
    });

  } catch (error) {
    console.log(`error from getAllWorkshop: ${error}`);
    return res.status(500).json({ message: "Server error" });
  }
};


export const getSingleWorkshop = async(req,res)=>{
    try {
        const workshopId = req.params.id;


        if(!workshopId){
            return res.status(401).json({
                message:"Please provide workshop id "
            })
        }

        const singleWorkshop  = await Workshop.findById(workshopId)

        if(!singleWorkshop){
            return res.status(401).json({
                message:"Workshop not found"
            })
        }

        return res.status(201).json(singleWorkshop)
    } catch (error) {
        console.log(`error from getWorkshop ,${error}`)
    }
}


export const addMemberToWorkshop = async (req, res) => {
  try {
    const { email, role } = req.body;
    const workshopId = req.params.id;
    const currentUserId = req.id;

    const user = await User.findById(currentUserId);
    const workshop = await Workshop.findById(workshopId);
    
    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    const isOwner = workshop.ownerId.toString() === currentUserId;
    
    if (!isOwner) {
      return res.status(403).json({ message: "Only owner can add members" });
    }

    // ✅ FIX 1: Workshop-specific existing member check
    const userExists = await User.findOne({ email });
    if (userExists) {
      const alreadyMember = await WorkshopMember.findOne({
        workshopId,           // ✅ SPECIFIC WORKSHOP
        userId: userExists._id,
      });
      if (alreadyMember) {
        return res.status(400).json({ message: "User is already a member of this workshop" });
      }
    }

    // ✅ FIX 2: Workshop + User + Status specific invitation check
    const existingInvitation = await Invitation.findOne({
      workshopId,           // ✅ WORKSHOP SPECIFIC!
      email,
      invitedBy: currentUserId,
      status: "pending",
      expiresAt: { $gt: new Date() },
    });

    if (existingInvitation) {
      return res.status(400).json({ 
        message: "Invitation already sent to this user for this workshop",
        invitationId: existingInvitation._id
      });
    }

    // ✅ Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invitation = await Invitation.create({
      workshopId,
      email,
      role,
      token,
      expiresAt,
      invitedBy: currentUserId,
    });

    const inviterUser = await User.findById(currentUserId);

    // ✅ Email logic (same as yours)
    if (userExists) {
      const acceptLink = `${ENV.CLIENT_URL}/accept-invite/${token}`;
      await transporter.sendMail({
        from:process.env.EMAIL_USER,
        to: email,
        subject: `Invitation to join ${workshop.name}`,
        html: `
          <h2>Workshop Invitation</h2>
          <p>Hi,</p>
          <p><strong>${inviterUser.name}</strong> invited you to join <strong>${workshop.name}</strong> as a ${role}.</p>
          <a href="${acceptLink}" style="display:inline-block;padding:10px 20px;background:#007bff;color:#fff;text-decoration:none;border-radius:5px;">Accept Invitation</a>
          <p>Or copy: ${acceptLink}</p>
          <p>Expires in 7 days.</p>
        `,
      });
    } else {
      const registerLink = `${process.env.CLIENT_URL}/register?invite=${token}`;
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: `You're invited to ${workshop.name}`,
        html: `
          <h2>Workshop Invitation</h2>
          <p>Hi,</p>
          <p><strong>${inviterUser.name}</strong> invited you to <strong>${workshop.name}</strong>.</p>
          <p>Create account to join:</p>
          <a href="${registerLink}" style="display:inline-block;padding:10px 20px;background:#28a745;color:#fff;text-decoration:none;border-radius:5px;">Create Account & Join</a>
          <p>Or copy: ${registerLink}</p>
          <p>Expires in 7 days.</p>
        `,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Invitation sent successfully",
      invitation: {
        id: invitation._id,
        email,
        workshop: workshop.name,
        role,
        expiresAt: invitation.expiresAt
      },
      userExists
    });

  } catch (error) {
    console.error("Add member error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};



export const acceptInvitation = async (req, res) => {
  try {
    const token  = req.params.id;
    const userId = req.id; // from auth middleware

    const invitation = await Invitation.findOne({
      token,
      status: "pending",
      expiresAt: { $gt: new Date() },
    });

    if (!invitation) {
      return res.status(400).json({ message: "Invalid or expired invitation" });
    }

    // Verify email matches
    const user = await User.findById(userId);
    if (user.email !== invitation.email) {
      return res.status(403).json({ message: "This invitation was sent to a different email" });
    }

    // Check if already a member
    const existingMember = await WorkshopMember.findOne({
      workshopId: invitation.workshopId,
      userId,
    });

    if (existingMember) {
      return res.status(400).json({ message: "You are already a member of this workshop" });
    }

    // Add member
    await WorkshopMember.create({
      workshopId: invitation.workshopId,
      userId,
      role: invitation.role,
      status: "member",
    });

    // Mark invitation as accepted
    invitation.status = "accepted";
    await invitation.save();

    const workshopName = await Workshop.findById(invitation.workshopId)

    if(!workshopName){
      return res.status(401).json({
        message:"Workshop not found"
      })
    }
    // Create notification
    await Notification.create({
      recipientId: userId,
      actorId: invitation.invitedBy,
      type: "WORKSHOP_MEMBER_ADDED",
      workshopId: invitation.workshopId,
      message: `You joined ${workshopName.name} workshop`,
    });

    return res.status(200).json({
      message: "Successfully joined workshop",
      workshopId: invitation.workshopId,
    });
  } catch (error) {
    console.log(`error from accept invitation, ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const getTotalMemberInWorkShop=async(req,res)=>{
    try {
        const workshopId = req.params.id
        const userId= req.id

    const allMember = await WorkshopMember.find({workshopId}).populate("userId","name")

    if(!allMember){
        return res.status(401).json({
            message:"Workshop not found"
        })
    }
    

    return res.status(201).json({
        allMember,
        
    })
    } catch (error) {
        console.log(`error from get total member in workshop ${error}`)
    }
}


export const leaveWorkshop = async (req, res) => {
  try {
    const workshopId = req.params.id;
    const userId = req.id;

    const user = await User.findById(userId)

    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    // Owner cannot leave
    if (workshop.ownerId.toString() === userId) {
      return res.status(400).json({
        message: "Owner cannot leave workshop.",
      });
    }

    const member = await WorkshopMember.findOne({
      workshopId,
      userId,
    });

    if (!member) {
      return res.status(400).json({ message: "You are not a member" });
    }

    // 🔹 Remove user from assigned tasks
    await Task.updateMany(
      { workshopId },
      { $pull: { assignees: userId } }
    );

    // 🔹 Handle tasks created by user
    // OPTION A: Delete tasks created by this user
    await Task.deleteMany({
      workshopId,
      creatorId: userId,
    });

    // OPTION B (Better): Reassign to owner
    // await Task.updateMany(
    //   { workshopId, creatorId: userId },
    //   { creatorId: workshop.ownerId }
    // );

    // Remove member
    await WorkshopMember.deleteOne({ workshopId, userId });

    await Notification.create({
      recipientId: workshop.ownerId,
      actorId: userId,
      type: "WORKSHOP_LEFT",
      workshopId,
      message: `${user.name}  left the workshop`,
    });

    return res.status(200).json({
      message: "Successfully left workshop",
    });
  } catch (error) {
    console.log("leave workshop error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



export const deleteWorkshop = async (req, res) => {
  try {
    const workshopId = req.params.id;
    const userId = req.id;

     const user = await User.findById(userId)

    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    if (workshop.ownerId.toString() !== userId) {
      return res.status(403).json({ message: "Only owner can delete workshop" });
    }

    // 🔹 Find all members
    const members = await WorkshopMember.find({ workshopId });

    // 🔹 Notify members
    const notifications = members.map((m) => ({
      recipientId: m.userId,
      actorId: userId,
      type: "WORKSHOP_DELETED",
      workshopId,
      message: `Workshop "${workshop.name}" has been deleted`,
    }));

    if (notifications.length) {
      await Notification.insertMany(notifications);
    }

    // 🔹 Delete all related data
    await Promise.all([
      Task.deleteMany({ workshopId }),
      WorkshopMember.deleteMany({ workshopId }),
      Invitation.deleteMany({ workshopId }),
      Notification.deleteMany({ workshopId }),
    ]);

    await Workshop.findByIdAndDelete(workshopId);

    return res.status(200).json({
      message: "Workshop deleted successfully",
    });
  } catch (error) {
    console.log("delete workshop error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
