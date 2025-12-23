import mongoose from "mongoose"

const workshopMemberSchema = new mongoose.Schema(
  {
    workshopId: { type: mongoose.Schema.Types.ObjectId, ref: "Workshop", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: {
      type: String,
      enum: [ "admin", "member"],
      required: true,
    },
  },
  { timestamps: true }
)
workshopMemberSchema.index({ workshopId: 1, userId: 1 }, { unique: true })


export const WorkshopMember = mongoose.model("WorkshopMember", workshopMemberSchema)