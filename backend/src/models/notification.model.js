import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema(
  {
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // jisko notify karna hai
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },     // jisne action kiya
    type: {
      type: String,
      enum: ["WORKSHOP_MEMBER_ADDED", "COMMENT_MENTION","WORKSHOP_LEFT","REMOVED_FROM_WORKSHOP","WORKSHOP_DELETED"],
      required: true,
    },
    workshopId: { type: mongoose.Schema.Types.ObjectId, ref: "Workshop" },
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
    message: { type: String, required: true }, // UI text jaise "You were added to Workshop X"
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export const Notification = mongoose.model("Notification", notificationSchema)
