import { Comment } from "../models/comment.model.js";
import { User } from "../models/user.model.js";
import { WorkshopMember } from "../models/workshopMember.model.js";
import { Notification } from "../models/notification.model.js";
import { Task } from "../models/task.model.js";

function extractMentions(text) {
  const regex = /@([a-zA-Z0-9_]+)/g;
  return [...text.matchAll(regex)].map(m => m[1]);
}

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const taskId  = req.params.id;
    const authorId = req.id;

    const task = await Task.findById(taskId);
    console.log(task)
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // 1️⃣ Extract usernames from comment
    const mentionedUsernames = extractMentions(text);

    let mentionedUsers = [];

    if (mentionedUsernames.length > 0) {
      // 2️⃣ Get workshop members
      const workshopMembers = await WorkshopMember.find({
        workshopId: task.workshopId,
       
      }).select("userId");

      const memberIds = workshopMembers.map(m => m.userId);

      // 3️⃣ Find mentioned users ONLY inside workshop
      mentionedUsers = await User.find({
       _id: { $in: memberIds },
  name: { 
    $in: mentionedUsernames.map(name => new RegExp(`^${name}$`, 'i'))
  },
      });
    }

    // 4️⃣ Create comment
    const comment = await Comment.create({
      workshopId: task.workshopId,
      taskId,
      authorId,
      text,
      mentionedUserIds: mentionedUsers.map(u => u._id),
    });

    // 5️⃣ Create notifications
    const notifications = mentionedUsers
      .filter(u => u._id.toString() !== authorId)
      .map(user => ({
        recipientId: user._id,
        actorId: authorId,
        type: "COMMENT_MENTION",
        workshopId: task.workshopId,
        commentId: comment._id,
        message: `${text}`,
      }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    return res.status(201).json({
      message: "Comment added",
      comment,
    });

  } catch (error) {
    console.log("error from addComment", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const totalAssigne = async (req, res) => {
  try {
    const taskId = req.params.id;

    const task = await Task.findById(taskId)
      .populate("assignees", "name username email")  // jo fields chahiye
      .populate("creatorId", "name username email"); // owner info

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // Ek combined list bana le (assignees + owner), duplicates hata ke
    const allUsersMap = new Map();

    // owner ko add karo
    if (task.creatorId) {
      allUsersMap.set(task.creatorId._id.toString(), {
        _id: task.creatorId._id,
        name: task.creatorId.name,
        username: task.creatorId.username,
        email: task.creatorId.email
      });
    }

    // assignees ko add karo
    task.assignees.forEach((user) => {
      allUsersMap.set(user._id.toString(), {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email
       
      });
    });

    const allUsers = Array.from(allUsersMap.values());

    return res.status(200).json({
     
      participants: allUsers, // frontend mention dropdown ke liye best
    });
  } catch (error) {
    console.log(`error from totalAssigne, ${error}`);
    return res.status(500).json({ message: "Server error" });
  }
};



export const getAllComment = async(req,res)=>{
  try {
    
    const taskId = req.params.id;

    const allComment = await Comment.find({
      taskId
    }).populate("authorId", "name  email")


    if(!allComment){
      return res.status(401).json({
        message:"Pleae provide valid task id"
      })
    }

    return res.status(201).json(allComment)
  } catch (error) {
    console.log(`error from get all comment , ${error}`)
  }
}