import mongoose, { Schema, Document } from "mongoose";

export interface IDeskUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "member" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

const DeskUserSchema = new Schema<IDeskUser>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: { type: String, enum: ["member", "admin"], default: "member" },
  },
  { timestamps: true }
);

export default mongoose.models.DeskUser ||
  mongoose.model<IDeskUser>("DeskUser", DeskUserSchema);
