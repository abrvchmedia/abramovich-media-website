import mongoose, { Schema, Document } from "mongoose";

export interface IBlock {
  id: string;
  type: "text" | "image" | "hero" | "cta" | "grid";
  content: Record<string, unknown>;
  order: number;
}

export interface IPage extends Document {
  title: string;
  slug: string;
  status: "draft" | "published";
  seoTitle: string;
  seoDescription: string;
  blocks: IBlock[];
  createdAt: Date;
  updatedAt: Date;
}

const BlockSchema = new Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      enum: ["text", "image", "hero", "cta", "grid"],
      required: true,
    },
    content: { type: Schema.Types.Mixed, default: {} },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const PageSchema = new Schema<IPage>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    blocks: [BlockSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Page ||
  mongoose.model<IPage>("Page", PageSchema);
