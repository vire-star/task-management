import mongoose from "mongoose"

const commentSchema = new mongoose.Schema(
  {
    workshopId: { type: mongoose.Schema.Types.ObjectId, ref: "Workshop", required: true },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true }, // agar task-specific comments
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true }, // full comment text with @vishu etc.
    mentionedUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
)

export const Comment = mongoose.model("Comment", commentSchema)
