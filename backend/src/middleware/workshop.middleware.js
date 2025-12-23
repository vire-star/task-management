


import { Workshop } from "../models/workshop.model.js";
import { Task } from "../models/task.model.js";

/**
 * Works for BOTH:
 * - workshop routes (/workshop/:id)
 * - task routes (/task/:id)
 */


export const onlyWorkshopOwner = async (req, res, next) => {
  try {
    const userId = req.id;
    let workshopId;

    // 🟢 Case 1: Workshop route
    if (req.params.workshopId || req.params.id) {
      workshopId = req.params.workshopId || req.params.id;
    }

    // 🟢 Case 2: Task route → resolve workshop from task
    if (req.baseUrl.includes("task")) {
      const task = await Task.findById(req.params.id);
    //   console.log(task)
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      workshopId = task.workshopId;
      req.task = task;
    }

    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    console.log(userId)
    if (workshop.ownerId.toString() !== userId) {
      return res.status(403).json({
        message: "Only workshop owner can perform this action",
      });
    }

    req.workshop = workshop;
    next();
  } catch (error) {
    console.log("error from onlyWorkshopOwner", error);
    return res.status(500).json({ message: "Server error" });
  }
};
// 693ef1d2a94dc7674c7ba6b2
// 693ef1d2a94dc7674c7ba6b2



export const onlyWorkshopOwnerForTaskCreate = async (req, res, next) => {
  try {
    const userId = req.id;
    const workshopId  = req.params.id;
    // console.log(userId)

    if (!workshopId) {
      return res.status(400).json({ message: "workshopId is required" });
    }

    if (!workshopId) {
      return res.status(400).json({ message: "Invalid workshopId" });
    }

    const workshop = await Workshop.findById(workshopId);
    

    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    if (workshop.ownerId.toString() !== userId) {
      return res.status(401).json({
        message: "Only workshop owner can create tasks",
      });
    }

    req.workshop = workshop;
    next();
  } catch (error) {
    console.error("onlyWorkshopOwnerForTaskCreate", error);
    res.status(500).json({ message: "Server error" });
  }
};
