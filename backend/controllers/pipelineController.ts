import dbConnect from "@/backend/utils/dbConnect";
import PipelineLead, { PipelineStage } from "@/backend/models/PipelineLead";
import PipelineMcpSnapshot from "@/backend/models/PipelineMcpSnapshot";
import { slugify } from "@/backend/utils/slugify";

function normalizeEmail(e: string) {
  return e.trim().toLowerCase();
}

export async function getPipelineStats() {
  await dbConnect();
  const byStage = await PipelineLead.aggregate([
    { $group: { _id: "$stage", count: { $sum: 1 } } },
  ]);
  const total = await PipelineLead.countDocuments();
  const map: Record<string, number> = {};
  for (const row of byStage) {
    map[row._id as string] = row.count as number;
  }
  return { total, byStage: map };
}

/** Full-pipeline aggregates for admin charts (not limited by list pagination). */
export async function getPipelineChartAggregates(days = 14) {
  await dbConnect();
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - days);
  since.setUTCHours(0, 0, 0, 0);

  const [byBatch, activityRaw] = await Promise.all([
    PipelineLead.aggregate([
      {
        $group: {
          _id: { $ifNull: ["$batchRunId", ""] },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 14 },
    ]),
    PipelineLead.aggregate([
      { $match: { updatedAt: { $gte: since } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const activityMap = new Map<string, number>();
  for (const row of activityRaw) {
    activityMap.set(String(row._id), row.count as number);
  }
  const activityByDay: { day: string; count: number }[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setUTCDate(since.getUTCDate() + i);
    const key = d.toISOString().slice(0, 10);
    activityByDay.push({ day: key, count: activityMap.get(key) ?? 0 });
  }

  return {
    byBatch: byBatch.map((r) => ({
      name: String(r._id || "(empty)").slice(0, 40),
      fullName: String(r._id || "(empty)"),
      count: r.count as number,
    })),
    activityByDay,
  };
}

export async function listLeads(options: {
  search?: string;
  stage?: string;
  limit?: number;
  skip?: number;
}) {
  await dbConnect();
  const { search, stage, limit = 200, skip = 0 } = options;
  const filter: Record<string, unknown> = {};
  if (stage && stage !== "all") filter.stage = stage;
  if (search) {
    const q = search.trim();
    filter.$or = [
      { email: { $regex: q, $options: "i" } },
      { apexDomain: { $regex: q, $options: "i" } },
      { businessName: { $regex: q, $options: "i" } },
      { region: { $regex: q, $options: "i" } },
    ];
  }
  const [items, total] = await Promise.all([
    PipelineLead.find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(Math.min(limit, 500))
      .lean(),
    PipelineLead.countDocuments(filter),
  ]);
  return { items, total };
}

export async function createLead(data: Record<string, unknown>) {
  await dbConnect();
  if (!data.email || typeof data.email !== "string") {
    throw new Error("email is required");
  }
  const email = normalizeEmail(data.email);
  return PipelineLead.create({
    email,
    apexDomain: String(data.apexDomain || ""),
    businessName: String(data.businessName || ""),
    region: String(data.region || ""),
    state: String(data.state || ""),
    vertical: String(data.vertical || ""),
    batchRunId: String(data.batchRunId || ""),
    stage: (data.stage as PipelineStage) || "cold_sent",
    originalFinding: String(data.originalFinding || ""),
    notes: String(data.notes || ""),
  });
}

export async function updateLead(
  id: string,
  data: Partial<{
    stage: PipelineStage;
    notes: string;
    businessName: string;
    apexDomain: string;
    coldSentAt: string | Date | null;
    fu1SentAt: string | Date | null;
    fu2SentAt: string | Date | null;
  }>
) {
  await dbConnect();
  const patch: Record<string, unknown> = { ...data };
  if (patch.coldSentAt === "") patch.coldSentAt = undefined;
  if (patch.fu1SentAt === "") patch.fu1SentAt = undefined;
  if (patch.fu2SentAt === "") patch.fu2SentAt = undefined;
  const updated = await PipelineLead.findByIdAndUpdate(id, patch, {
    new: true,
    runValidators: true,
  }).lean();
  if (!updated) throw new Error("Lead not found");
  return updated;
}

export async function deleteLead(id: string) {
  await dbConnect();
  const r = await PipelineLead.findByIdAndDelete(id);
  if (!r) throw new Error("Lead not found");
  return { ok: true };
}

type RunLogRecipient = {
  email?: string;
  business?: string;
  original_finding?: string;
};

function extractRecipientsFromRunLog(obj: Record<string, unknown>): {
  batchRunId: string;
  region: string;
  state: string;
  vertical: string;
  recipients: RunLogRecipient[];
} {
  const region = String(obj.run_region || "");
  const state = String(obj.run_state || "");
  const keywords = obj.run_niche_keywords;
  const kw0 =
    Array.isArray(keywords) && typeof keywords[0] === "string"
      ? keywords[0]
      : "";
  const vertical = String(obj.run_industry || kw0 || "");
  const batchRunId = String(
    obj.run_id ||
      obj.run_slug ||
      [region, state, vertical].filter(Boolean).join("-").slice(0, 120) ||
      "imported-run-log"
  );

  const recipients: RunLogRecipient[] = [];
  const fu = obj.followup_wave_log as Record<string, unknown> | undefined;
  if (fu?.FU1 && typeof fu.FU1 === "object") {
    const fu1 = fu.FU1 as { recipients?: RunLogRecipient[] };
    if (Array.isArray(fu1.recipients)) recipients.push(...fu1.recipients);
  }

  return { batchRunId, region, state, vertical, recipients };
}

export async function importLeadsFromRunLog(
  raw: Record<string, unknown>,
  snapshotTitle?: string,
  batchRunIdOverride?: string
) {
  await dbConnect();
  const extracted = extractRecipientsFromRunLog(raw);
  const batchRunId = batchRunIdOverride?.trim() || extracted.batchRunId;
  const { region, state, vertical, recipients } = extracted;

  let upserted = 0;
  for (const r of recipients) {
    const email = r.email?.trim();
    if (!email || !email.includes("@")) continue;
    const finding = r.original_finding || "";
    const business = r.business || "";
    await PipelineLead.findOneAndUpdate(
      { email: normalizeEmail(email) },
      {
        $set: {
          email: normalizeEmail(email),
          businessName: business,
          region,
          state,
          vertical,
          batchRunId,
          originalFinding: finding,
          stage: "fu1_sent",
          fu1SentAt: new Date(),
        },
        $setOnInsert: { coldSentAt: new Date() },
      },
      { upsert: true, new: true }
    );
    upserted++;
  }

  if (snapshotTitle) {
    const base = slugify(snapshotTitle);
    let slug = base;
    let n = 0;
    while (await PipelineMcpSnapshot.findOne({ slug }).lean()) {
      n++;
      slug = `${base}-${n}`;
    }
    await PipelineMcpSnapshot.create({
      title: snapshotTitle,
      slug,
      source: "run_log",
      rawJson: raw,
      notes: `Imported ${upserted} leads from run log`,
    });
  }

  return { upserted, batchRunId, region, state, vertical };
}

export async function bulkImportLeads(
  rows: Array<{
    email: string;
    apexDomain?: string;
    businessName?: string;
    region?: string;
    state?: string;
    vertical?: string;
    batchRunId?: string;
    stage?: PipelineStage;
    originalFinding?: string;
    notes?: string;
  }>
) {
  await dbConnect();
  let upserted = 0;
  for (const row of rows) {
    if (!row.email?.includes("@")) continue;
    const email = normalizeEmail(row.email);
    await PipelineLead.findOneAndUpdate(
      { email },
      {
        $set: {
          email,
          apexDomain: row.apexDomain || "",
          businessName: row.businessName || "",
          region: row.region || "",
          state: row.state || "",
          vertical: row.vertical || "",
          batchRunId: row.batchRunId || "",
          stage: row.stage || "cold_sent",
          originalFinding: row.originalFinding || "",
          notes: row.notes || "",
        },
      },
      { upsert: true, new: true }
    );
    upserted++;
  }
  return { upserted };
}

export async function listSnapshots() {
  await dbConnect();
  return PipelineMcpSnapshot.find().sort({ createdAt: -1 }).limit(50).lean();
}

export async function getSnapshotBySlug(slug: string) {
  await dbConnect();
  return PipelineMcpSnapshot.findOne({ slug }).lean();
}

export async function createSnapshot(data: {
  title: string;
  slug?: string;
  source?: "run_log" | "combined_export" | "manual";
  rawJson: unknown;
  notes?: string;
}) {
  await dbConnect();
  let base = data.slug || slugify(data.title);
  if (!base) base = `snapshot-${Date.now()}`;
  let slug = base;
  let n = 0;
  while (await PipelineMcpSnapshot.findOne({ slug }).lean()) {
    n++;
    slug = `${base}-${n}`;
  }
  return PipelineMcpSnapshot.create({
    title: data.title,
    slug,
    source: data.source || "manual",
    rawJson: data.rawJson,
    notes: data.notes || "",
  });
}
