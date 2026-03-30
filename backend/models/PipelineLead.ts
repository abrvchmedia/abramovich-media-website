import mongoose, { Schema, Document } from "mongoose";

export type PipelineStage =
  | "lead"
  | "cold_sent"
  | "fu1_sent"
  | "fu2_sent"
  | "replied"
  | "call_booked"
  | "won"
  | "lost"
  | "paused";

export interface IPipelineLead extends Document {
  email: string;
  apexDomain: string;
  businessName: string;
  region: string;
  state: string;
  vertical: string;
  batchRunId: string;
  coldSentAt?: Date;
  fu1SentAt?: Date;
  fu2SentAt?: Date;
  stage: PipelineStage;
  originalFinding: string;
  notes: string;
  mcpSnapshotSlug?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PipelineLeadSchema = new Schema<IPipelineLead>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    apexDomain: { type: String, default: "", trim: true, index: true },
    businessName: { type: String, default: "" },
    region: { type: String, default: "" },
    state: { type: String, default: "" },
    vertical: { type: String, default: "" },
    batchRunId: { type: String, default: "" },
    coldSentAt: { type: Date },
    fu1SentAt: { type: Date },
    fu2SentAt: { type: Date },
    stage: {
      type: String,
      enum: [
        "lead",
        "cold_sent",
        "fu1_sent",
        "fu2_sent",
        "replied",
        "call_booked",
        "won",
        "lost",
        "paused",
      ],
      default: "cold_sent",
      index: true,
    },
    originalFinding: { type: String, default: "" },
    notes: { type: String, default: "" },
    mcpSnapshotSlug: { type: String, default: "" },
  },
  { timestamps: true }
);

PipelineLeadSchema.index({ email: 1 }, { unique: true });

export default mongoose.models.PipelineLead ||
  mongoose.model<IPipelineLead>("PipelineLead", PipelineLeadSchema);
