import mongoose, { Schema, Document } from "mongoose";

export interface IPipelineMcpSnapshot extends Document {
  title: string;
  slug: string;
  source: "run_log" | "combined_export" | "manual";
  rawJson: unknown;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const PipelineMcpSnapshotSchema = new Schema<IPipelineMcpSnapshot>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    source: {
      type: String,
      enum: ["run_log", "combined_export", "manual"],
      default: "run_log",
    },
    rawJson: { type: Schema.Types.Mixed, required: true },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.PipelineMcpSnapshot ||
  mongoose.model<IPipelineMcpSnapshot>(
    "PipelineMcpSnapshot",
    PipelineMcpSnapshotSchema
  );
