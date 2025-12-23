import { Task } from "../models/task.model.js";
import { Workshop } from "../models/workshop.model.js";
import { WorkshopMember } from "../models/workshopMember.model.js";

export const createTask=async(req , res)=>{
    try {
        const  workshopId = req.params.id;
        const creatorId = req.id;
        const {title,description} = req.body;

        if(!title || !description){
            return res.status(401).json({
                message:"Please provide all the details"
            })
        }
        
        const workshop = await Workshop.findById(workshopId)

        if(!workshop){
            return res.status(401).json({
                message:"Workshop not found"
            })
        }

        const task = await Task.create({
            title,
            description,
            workshopId,
            creatorId
        })

        return res.status(201).json({
            message:"Task created"
        })
    } catch (error) {
        console.log(`error from create task, ${error}`)
    }
}


export const getAllTask = async(req,res)=>{
    try {
        const workshopId = req.params.id

        const task = await Task.find({ workshopId:workshopId})

        if(!task){
            return res.status(401).json({
                message:"Task not found"
            })
        }

        return res.status(201).json(task)

    } catch (error) {
        console.log(`error from getAllTask, ${error}`)
    }
}


export const getSingleTask = async(req,res)=>{
    try {
        const userId = req.id;
        const taskId = req.params.id;

        const task = await Task.findById(taskId).populate('assignees')

        

        if(!task){
            return res.status(401).json({
                message:"Task not found"
            })
        }

         const isCreator = task.creatorId.toString() === userId;

   const isAssignee = task.assignees.some(
            (assignee) => assignee._id.toString() === userId
        );

    if (!isCreator && !isAssignee) {
      return res.status(403).json({
        message: "You are not allowed to access this task",
      });
    }


        return res.status(201).json(task)
    } catch (error) {
        console.log(`error from get single task, ${error}`)
    }
    
}

export const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;

        const task = await Task.findByIdAndDelete(taskId);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        return res.status(200).json({
            message: "Task deleted successfully"
        });

    } catch (error) {
        console.log(`error from delete task, ${error}`);
        return res.status(500).json({
            message: "Server error"
        });
    }
};



export const changeStatus = async(req, res)=>{
    try {
        const taskId = req.params.id;
        const {status} = req.body;

        const creatorId = req.id

        
        const allowedStatus = ["todo", "in-progress", "done"];

if (!allowedStatus.includes(status)) {
  return res.status(400).json({
    message: "Invalid status value",
  });
}
        const task = await Task.findByIdAndUpdate(taskId,{
            status
        })

        console.log(task)
        if(!task){
            return res.status(401).json({
                message:"Task not found"
            })
        }
        

        return res.status(201).json({
            message:"Task status changed"
        })
    } catch (error) {
        console.log(`error from change status, ${error}`)
    }
}


export const assignUserToTask = async (req, res) => {
  try {
    const taskId  = req.params.id;
  const { userId } = req.body;
  const currentUserId = req.id;

  const task = await Task.findById(taskId);
  if (!task) return res.status(404).json({ message: "Task not found" });

  // check user is workshop member
  const isMember = await WorkshopMember.findOne({
    workshopId: task.workshopId,
    userId,
  });

  if (!isMember) {
    return res.status(403).json({
      message: "User is not part of this workshop",
    });
  }

  // already assigned?
  if (task.assignees.includes(userId)) {
     task.assignees.pull(userId);
  await task.save();

    return res.status(201).json({ message: "User Removed From Task" });
  }

  task.assignees.push(userId);
  await task.save();

  return res.status(200).json({ message: "User assigned to task" });
  } catch (error) {
    console.log(`error from assign to task, ${error}`)
  }
};



