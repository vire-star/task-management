import { imagekit } from "../config/imagekit.js";
import { File } from "../models/file.model.js";
// import imagekit from "../config/imagekit.js";
import mongoose from "mongoose";
import { Task } from "../models/task.model.js";
import { Workshop } from "../models/workshop.model.js";

export const createFile = async (req, res) => {
  try {
    const userId = req.id;
    const { visibility, workshopId, taskId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Please provide a file" });
    }

    // 🟢 Validate visibility
    if (!["private", "workshop"].includes(visibility)) {
      return res.status(400).json({ message: "Invalid visibility type" });
    }

    // 🟢 Workshop validation
    if (visibility === "workshop") {
      if (!workshopId || !taskId) {
        return res.status(400).json({
          message: "workshopId and taskId are required for workshop files",
        });
      }


    const task = await Task.findOne({
  _id: taskId,
  workshopId: workshopId,
});

      const workshop = await Workshop.findById(workshopId)
     
      if (
        !task || !workshop 
      ) {
        return res.status(400).json({ message: "Invalid workshop or task id" });
      }


     

    }


    
    // 🟢 Upload to ImageKit
    const uploadRes = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
      folder:
        visibility === "private"
          ? `/users/${userId}`
          : `/workshops/${workshopId}/tasks/${taskId}`,
    });

    // 🟢 Save metadata to DB
    const fileDoc = await File.create({
      name: req.file.originalname,
      url: uploadRes.url,
      
      visibility,
      ownerId: userId,
      workshopId: visibility === "workshop" ? workshopId : null,
      taskId: visibility === "workshop" ? taskId : null,
    });

    return res.status(201).json({
      message: "File uploaded successfully",
      file: fileDoc,
    });
  } catch (error) {
    console.error("error from createFile:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


export const deleteFile = async (req, res) => {
  try {
    const fileId = req.params.id;

    // ✅ Step 1: MongoDB se file details nikalo
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found"
      });
    }

    // ✅ Step 2: ImageKit se file delete
    await imagekit.deleteFile({
      fileId: file.imagekitFileId,  // ImageKit file ID from DB
    });

    // ✅ Step 3: MongoDB record delete
    await File.findByIdAndDelete(fileId);

    res.status(200).json({
      success: true,
      message: "File deleted successfully from ImageKit & Database",
      deletedFile: {
        id: file._id,
        name: file.name,
        imagekitFileId: file.imagekitFileId
      }
    });

  } catch (error) {
    console.error("Delete file error:", error);

    // ✅ Error handling - partial cleanup
    if (error.message.includes('FILE_NOT_FOUND')) {
      // ImageKit file already deleted, just remove DB record
      await File.findByIdAndDelete(req.params.id);
      return res.status(200).json({ 
        success: true, 
        message: "DB record cleaned up (ImageKit file already deleted)" 
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete file",
      error: error.message
    });
  }
};


export const getPrivateFile = async(req,res)=>{
    try {
        const userId = req.id;
        

        const file  = await File.find({
            ownerId:userId,
            visibility: "private"
        }).populate('workshopId')

        if(!file){
            return res.status(401).json({
                message:"Invalid User Id"
            })
        }


        return res.status(201).json(file)
    } catch (error) {
        console.log(`error from get private file, ${error}`)
    }
}



export const speceficFile = async(req,res)=>{
    try {
        const userId = req.id;
        const taskId= req.params.id

        const file  = await File.find({
           taskId
        }).populate('workshopId')

        if(!file){
            return res.status(401).json({
                message:"Invalid User Id"
            })
        }


        return res.status(201).json(file)
    } catch (error) {
        console.log(`error from get private file, ${error}`)
    }
}


