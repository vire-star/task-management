import { Task } from "../models/task.model.js";

export const resolveWorkshopFromTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;

    const task = await Task.findById(taskId);
    // console.log(task)
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    req.params.workshopId = task.workshopId;
    req.task = task;

    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
