import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  avatarUrl:{
    type:String
  },
  createdAt: { type: Date, default: Date.now },
});


export const User = mongoose.model("User", UserSchema)