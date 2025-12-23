import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    fileType: {
      type: String,
      
    },

    visibility: {
      type: String,
      enum: ["private", "workshop"],
      required: true,
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    workshopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workshop",
      default: null,
    },

    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },
  },
  { timestamps: true }
);

export const File = mongoose.model("File", fileSchema);
