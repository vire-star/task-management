import mongoose from "mongoose";

const invitationSchema = new mongoose.Schema({
  workshopId: { type: mongoose.Schema.Types.ObjectId, ref: "Workshop", required: true },
  email: { type: String, required: true, trim: true },
  role: { type: String, enum: ["admin", "member"], default: "member" },
  invitedBy: {                  
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },

  status: { type: String, enum: ["pending", "accepted", "expired"], default: "pending" },
}, { timestamps: true });

export const Invitation   = mongoose.model("Invitation", invitationSchema)