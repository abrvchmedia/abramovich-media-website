import mongoose, { Schema, Document } from "mongoose";
import type { DeskBookId } from "@/lib/desk/kinds";

export type DeskSourceProvider =
  | "manual"
  | "seed"
  | "web"
  | "google"
  | "linkedin"
  | "facebook"
  | "instagram";

export interface IDeskRecord extends Document {
  kind: DeskBookId;
  stage: string;
  subtype: string;
  name: string;
  organization: string;
  ticker: string;
  email: string;
  phone: string;
  website: string;
  city: string;
  region: string;
  country: string;
  title: string;
  logline: string;
  thesis: string;
  approach: string;
  notes: string;
  aum: string;
  ticketMin?: number;
  ticketMax?: number;
  budgetLow?: number;
  budgetHigh?: number;
  raiseTarget?: number;
  headshotUrl: string;
  reelUrl: string;
  unionStatus: string;
  deadline?: Date;
  applyUrl: string;
  genres: string[];
  tags: string[];
  geos: string[];
  markets: string[];
  taxCredits: string[];
  notable: string[];
  warmth: number;
  watchlisted: boolean;
  status: "ACTIVE" | "SELECTIVE" | "CLOSED" | "ARCHIVED";
  source: string;
  sourceProvider: DeskSourceProvider;
  sourceUrl: string;
  sourceQuery: string;
  sourceSnippet: string;
  photo: string;
  lastPrint: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const DeskRecordSchema = new Schema<IDeskRecord>(
  {
    kind: {
      type: String,
      required: true,
      enum: ["talent", "distribution", "investor", "production", "brand"],
      index: true,
    },
    stage: { type: String, default: "lead", index: true },
    subtype: { type: String, default: "", index: true },
    name: { type: String, required: true, trim: true, index: true },
    organization: { type: String, default: "", trim: true },
    ticker: { type: String, default: "", trim: true, uppercase: true },
    email: { type: String, default: "", lowercase: true, trim: true },
    phone: { type: String, default: "", trim: true },
    website: { type: String, default: "", trim: true },
    city: { type: String, default: "", trim: true },
    region: { type: String, default: "", trim: true },
    country: { type: String, default: "", trim: true },
    title: { type: String, default: "" },
    logline: { type: String, default: "" },
    thesis: { type: String, default: "" },
    approach: { type: String, default: "" },
    notes: { type: String, default: "" },
    aum: { type: String, default: "" },
    ticketMin: { type: Number },
    ticketMax: { type: Number },
    budgetLow: { type: Number },
    budgetHigh: { type: Number },
    raiseTarget: { type: Number },
    headshotUrl: { type: String, default: "" },
    reelUrl: { type: String, default: "" },
    unionStatus: { type: String, default: "" },
    deadline: { type: Date },
    applyUrl: { type: String, default: "" },
    genres: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    geos: { type: [String], default: [] },
    markets: { type: [String], default: [] },
    taxCredits: { type: [String], default: [] },
    notable: { type: [String], default: [] },
    warmth: { type: Number, default: 50, min: 0, max: 100 },
    watchlisted: { type: Boolean, default: false, index: true },
    status: {
      type: String,
      enum: ["ACTIVE", "SELECTIVE", "CLOSED", "ARCHIVED"],
      default: "ACTIVE",
      index: true,
    },
    source: { type: String, default: "manual" },
    sourceProvider: {
      type: String,
      enum: [
        "manual",
        "seed",
        "web",
        "google",
        "linkedin",
        "facebook",
        "instagram",
      ],
      default: "manual",
    },
    sourceUrl: { type: String, default: "" },
    sourceQuery: { type: String, default: "" },
    sourceSnippet: { type: String, default: "" },
    photo: { type: String, default: "" },
    lastPrint: { type: String, default: "" },
    createdBy: { type: String, default: "" },
  },
  { timestamps: true }
);

DeskRecordSchema.index({
  name: "text",
  organization: "text",
  thesis: "text",
  notes: "text",
  city: "text",
  ticker: "text",
});
DeskRecordSchema.index({ kind: 1, website: 1, name: 1 });

export default mongoose.models.DeskRecord ||
  mongoose.model<IDeskRecord>("DeskRecord", DeskRecordSchema);
