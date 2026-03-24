import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  content: unknown;
  tags: string[];
  status: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    content: { type: Schema.Types.Mixed, default: "" },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
  },
  { timestamps: true }
);

export default mongoose.models.Post ||
  mongoose.model<IPost>("Post", PostSchema);
