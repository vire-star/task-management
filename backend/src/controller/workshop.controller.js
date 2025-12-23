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


export const addMemberToWorkshop=async(req,res)=>{
    try {
        const { email, role  } = req.body; // email of user to add
    const workshopId  = req.params.id; // workshop ID from URL
    const currentUserId = req.id; // logged-in user (from auth middleware)


    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }


     const isOwner = workshop.ownerId.toString() === currentUserId;
    // const isAdmin = await WorkshopMember.findOne({
    //   workshopId,
    //   userId: currentUserId,
    //   role: "admin",
    // });

    console.log(isOwner)
     if (!isOwner ) {
      return res.status(403).json({ message: "Only owner/admin can add members" });
    }

      const userExists = await User.findOne({ email });
    if (userExists) {
      const alreadyMember = await WorkshopMember.findOne({
        workshopId,
        userId: userExists._id,
      });

      if (alreadyMember) {
        return res.status(400).json({ message: "User is already a member" });
      }
    }


     const existingInvitation = await Invitation.findOne({
      email,
      workshopId,
      status: "pending",
      expiresAt: { $gt: new Date() },
    });

    if (existingInvitation) {
      return res.status(400).json({ message: "Invitation already sent to this email" });
    }


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

    if (userExists) {
      // User exists → direct accept link
      const acceptLink = `${ENV.CLIENT_URL}/accept-invite/${token}`;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Invitation to join ${workshop.name}`,
        html: `
          <h2>Workshop Invitation</h2>
          <p>Hi,</p>
          <p><strong>${inviterUser.name}</strong> invited you to join the workshop <strong>${workshop.name}</strong> as a ${role}.</p>
          <a href="${acceptLink}" style="display:inline-block;padding:10px 20px;background:#007bff;color:#fff;text-decoration:none;border-radius:5px;">Accept Invitation</a>
          <p>Or copy this link: ${acceptLink}</p>
          <p>This invitation expires in 7 days.</p>
        `,
      });
    } else {
      // User doesn't exist → registration link with token
      const registerLink = `${process.env.CLIENT_URL}/register?invite=${token}`;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: `You're invited to join ${workshop.name}`,
        html: `
          <h2>Workshop Invitation</h2>
          <p>Hi,</p>
          <p><strong>${inviterUser.name}</strong> invited you to join the workshop <strong>${workshop.name}</strong>.</p>
          <p>To join, please create your account first:</p>
          <a href="${registerLink}" style="display:inline-block;padding:10px 20px;background:#28a745;color:#fff;text-decoration:none;border-radius:5px;">Create Account & Join</a>
          <p>Or copy this link: ${registerLink}</p>
          <p>This invitation expires in 7 days.</p>
        `,
      });
    }

    return res.status(201).json({
      message: "Invitation sent successfully",
      userExists,
    });
    } catch (error) {
        console.log(`error from add member to workshop, ${error}`)
    }
}



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

    // Create notification
    await Notification.create({
      recipientId: userId,
      actorId: invitation.invitedBy,
      type: "WORKSHOP_MEMBER_ADDED",
      workshopId: invitation.workshopId,
      message: `You joined the workshop`,
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

    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    // Owner cannot leave
    if (workshop.ownerId.toString() === userId) {
      return res.status(400).json({
        message: "Owner cannot leave workshop. Delete or transfer ownership.",
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
      message: `A member left the workshop`,
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
