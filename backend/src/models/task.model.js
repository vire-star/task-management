import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    workshopId: { type: mongoose.Schema.Types.ObjectId, ref: "Workshop", default: null },
    dueDate: { type: Date },
    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
)


export const Task = mongoose.model("Task", taskSchema)