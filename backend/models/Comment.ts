import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  postSlug: string;
  name: string;
  text: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    postSlug: { type: String, required: true, index: true },
    name: { type: String, required: true, maxlength: 100 },
    text: { type: String, required: true, maxlength: 2000 },
    rating: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true }
);

export default mongoose.models.Comment ||
  mongoose.model<IComment>("Comment", CommentSchema);
