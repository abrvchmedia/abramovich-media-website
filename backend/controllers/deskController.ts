import dbConnect from "@/backend/utils/dbConnect";
import DeskRecord, { IDeskRecord } from "@/backend/models/DeskRecord";
import {
  defaultStage,
  isDeskBook,
  type DeskBookId,
} from "@/lib/desk/kinds";
import { getDeskSeedRecords } from "@/lib/desk/seedData";

const ALLOWED_UPDATES = [
  "kind",
  "stage",
  "subtype",
  "name",
  "organization",
  "ticker",
  "email",
  "phone",
  "website",
  "city",
  "region",
  "country",
  "title",
  "logline",
  "thesis",
  "approach",
  "notes",
  "aum",
  "ticketMin",
  "ticketMax",
  "budgetLow",
  "budgetHigh",
  "raiseTarget",
  "headshotUrl",
  "reelUrl",
  "unionStatus",
  "deadline",
  "applyUrl",
  "genres",
  "tags",
  "geos",
  "markets",
  "taxCredits",
  "notable",
  "warmth",
  "watchlisted",
  "status",
  "source",
  "sourceProvider",
  "sourceUrl",
  "sourceQuery",
  "sourceSnippet",
  "photo",
  "lastPrint",
] as const;

export async function ensureDeskSeed() {
  await dbConnect();
  const count = await DeskRecord.countDocuments();
  if (count > 0) return { seeded: false, count };

  const rows = getDeskSeedRecords();
  if (rows.length === 0) return { seeded: false, count: 0 };
  await DeskRecord.insertMany(rows);
  return { seeded: true, count: rows.length };
}

function serialize(doc: IDeskRecord) {
  return {
    _id: String(doc._id),
    kind: doc.kind,
    stage: doc.stage,
    subtype: doc.subtype,
    name: doc.name,
    organization: doc.organization,
    ticker: doc.ticker,
    email: doc.email,
    phone: doc.phone,
    website: doc.website,
    city: doc.city,
    region: doc.region,
    country: doc.country,
    title: doc.title,
    logline: doc.logline,
    thesis: doc.thesis,
    approach: doc.approach,
    notes: doc.notes,
    aum: doc.aum,
    ticketMin: doc.ticketMin,
    ticketMax: doc.ticketMax,
    budgetLow: doc.budgetLow,
    budgetHigh: doc.budgetHigh,
    raiseTarget: doc.raiseTarget,
    headshotUrl: doc.headshotUrl,
    reelUrl: doc.reelUrl,
    unionStatus: doc.unionStatus,
    deadline: doc.deadline ? doc.deadline.toISOString() : null,
    applyUrl: doc.applyUrl,
    genres: doc.genres || [],
    tags: doc.tags || [],
    geos: doc.geos || [],
    markets: doc.markets || [],
    taxCredits: doc.taxCredits || [],
    notable: doc.notable || [],
    warmth: doc.warmth,
    watchlisted: doc.watchlisted,
    status: doc.status,
    source: doc.source,
    sourceProvider: doc.sourceProvider,
    sourceUrl: doc.sourceUrl,
    sourceQuery: doc.sourceQuery,
    sourceSnippet: doc.sourceSnippet,
    photo: doc.photo,
    lastPrint: doc.lastPrint,
    createdBy: doc.createdBy,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function listDeskRecords(options: {
  kind?: string;
  search?: string;
  stage?: string;
  subtype?: string;
  watchlisted?: boolean;
  limit?: number;
}) {
  await ensureDeskSeed();

  const filter: Record<string, unknown> = { status: "ACTIVE" };
  if (options.kind && isDeskBook(options.kind)) filter.kind = options.kind;
  if (options.stage && options.stage !== "all") filter.stage = options.stage;
  if (options.subtype && options.subtype !== "all") {
    filter.subtype = options.subtype;
  }
  if (options.watchlisted) filter.watchlisted = true;

  const search = options.search?.trim();
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [
      { name: rx },
      { organization: rx },
      { ticker: rx },
      { city: rx },
      { thesis: rx },
      { notes: rx },
      { email: rx },
      { title: rx },
      { genres: rx },
      { tags: rx },
    ];
  }

  const limit = Math.min(Math.max(options.limit || 200, 1), 400);
  const items = await DeskRecord.find(filter)
    .sort({ watchlisted: -1, warmth: -1, updatedAt: -1 })
    .limit(limit);

  return items.map(serialize);
}

export async function getDeskStats() {
  await ensureDeskSeed();

  const [byKind, byStage, watchlisted, total] = await Promise.all([
    DeskRecord.aggregate([
      { $match: { status: "ACTIVE" } },
      { $group: { _id: "$kind", count: { $sum: 1 } } },
    ]),
    DeskRecord.aggregate([
      { $match: { status: "ACTIVE" } },
      { $group: { _id: { kind: "$kind", stage: "$stage" }, count: { $sum: 1 } } },
    ]),
    DeskRecord.countDocuments({ status: "ACTIVE", watchlisted: true }),
    DeskRecord.countDocuments({ status: "ACTIVE" }),
  ]);

  const kinds: Record<string, number> = {};
  for (const row of byKind) kinds[row._id] = row.count;

  const stages: Record<string, Record<string, number>> = {};
  for (const row of byStage) {
    const kind = row._id.kind as string;
    const stage = row._id.stage as string;
    stages[kind] ||= {};
    stages[kind][stage] = row.count;
  }

  const recent = await DeskRecord.find({ status: "ACTIVE" })
    .sort({ updatedAt: -1 })
    .limit(12)
    .select("name kind subtype city lastPrint updatedAt warmth");

  return {
    total,
    watchlisted,
    byKind: kinds,
    byStage: stages,
    tape: recent.map((r) => ({
      t: r.updatedAt.toISOString(),
      kind: r.kind,
      name: r.name,
      subtype: r.subtype,
      city: r.city,
      text: r.lastPrint || `${r.kind} · ${r.name}`,
      warmth: r.warmth,
    })),
  };
}

export async function createDeskRecord(
  data: Record<string, unknown>,
  createdBy: string
) {
  await dbConnect();
  const kind = String(data.kind || "");
  if (!isDeskBook(kind)) throw new Error("Invalid desk book");
  const name = String(data.name || "").trim();
  if (!name) throw new Error("Name is required");

  const doc = await DeskRecord.create({
    ...pickUpdates(data),
    kind,
    name,
    stage: String(data.stage || defaultStage(kind as DeskBookId)),
    createdBy,
    lastPrint:
      String(data.lastPrint || "") ||
      `Saved ${kind} · ${new Date().toISOString().slice(0, 10)}`,
  });
  return serialize(doc);
}

export async function updateDeskRecord(
  id: string,
  data: Record<string, unknown>
) {
  await dbConnect();
  const updates = pickUpdates(data);
  const doc = await DeskRecord.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
  if (!doc) throw new Error("Record not found");
  return serialize(doc);
}

export async function deleteDeskRecord(id: string) {
  await dbConnect();
  const doc = await DeskRecord.findByIdAndUpdate(
    id,
    { status: "ARCHIVED" },
    { new: true }
  );
  if (!doc) throw new Error("Record not found");
  return { ok: true };
}

function pickUpdates(data: Record<string, unknown>) {
  const updates: Record<string, unknown> = {};
  for (const key of ALLOWED_UPDATES) {
    if (data[key] !== undefined) updates[key] = data[key];
  }
  if (typeof updates.kind === "string" && !isDeskBook(updates.kind)) {
    delete updates.kind;
  }
  if (typeof updates.deadline === "string") {
    updates.deadline = updates.deadline
      ? new Date(updates.deadline as string)
      : undefined;
  }
  return updates;
}
