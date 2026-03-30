"use client";

import { useCallback, useEffect, useState } from "react";
import { admin } from "@/lib/api";
import { PipelineCharts } from "@/components/admin/PipelineCharts";
import { PipelineTodayPlaybook } from "@/components/admin/PipelineTodayPlaybook";

const STAGES = [
  "lead",
  "cold_sent",
  "fu1_sent",
  "fu2_sent",
  "replied",
  "call_booked",
  "won",
  "lost",
  "paused",
] as const;

type Stage = (typeof STAGES)[number];

interface LeadRow {
  _id: string;
  email: string;
  apexDomain: string;
  businessName: string;
  region: string;
  state: string;
  vertical: string;
  batchRunId: string;
  stage: Stage;
  originalFinding: string;
  notes: string;
  mcpSnapshotSlug?: string;
  coldSentAt?: string;
  fu1SentAt?: string;
  fu2SentAt?: string;
  updatedAt: string;
}

interface Stats {
  total: number;
  byStage: Record<string, number>;
}

interface ChartData {
  byBatch: { name: string; fullName: string; count: number }[];
  activityByDay: { day: string; count: number }[];
}

interface Snapshot {
  _id: string;
  title: string;
  slug: string;
  source: string;
  createdAt: string;
  notes: string;
}

export default function AdminPipelinePage() {
  const [tab, setTab] = useState<"leads" | "snapshots" | "import">("leads");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [items, setItems] = useState<LeadRow[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [importText, setImportText] = useState("");
  const [importTitle, setImportTitle] = useState("");
  const [importBatchId, setImportBatchId] = useState("");
  const [importBusy, setImportBusy] = useState(false);
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [expandedJson, setExpandedJson] = useState<unknown>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search.trim()) params.search = search.trim();
      if (stageFilter !== "all") params.stage = stageFilter;
      const r = (await admin.getPipeline(params)) as {
        stats: Stats;
        chartData?: ChartData;
        items: LeadRow[];
        total: number;
      };
      setStats(r.stats);
      setChartData(r.chartData ?? null);
      setItems(r.items);
      setTotal(r.total);
    } finally {
      setLoading(false);
    }
  }, [search, stageFilter]);

  const loadSnapshots = useCallback(async () => {
    const s = (await admin.getPipelineSnapshots()) as Snapshot[];
    setSnapshots(s);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const q = setInterval(() => {
      load();
    }, 30000);
    return () => clearInterval(q);
  }, [load]);

  useEffect(() => {
    if (tab === "snapshots") loadSnapshots();
  }, [tab, loadSnapshots]);

  async function handleStageChange(id: string, stage: Stage) {
    await admin.updatePipelineLead(id, { stage });
    load();
  }

  async function handleNotesBlur(id: string, notes: string) {
    await admin.updatePipelineLead(id, { notes });
  }

  async function runImportRunLog() {
    setImportBusy(true);
    setImportMsg(null);
    try {
      const raw = JSON.parse(importText) as Record<string, unknown>;
      const r = (await admin.importPipelineRunLog({
        raw,
        title: importTitle || undefined,
        batchRunId: importBatchId || undefined,
      })) as { upserted: number };
      setImportMsg(`Imported / updated ${r.upserted} leads from FU1 recipients.`);
      setImportText("");
      load();
      loadSnapshots();
    } catch (e: unknown) {
      setImportMsg(
        e instanceof Error ? e.message : "Invalid JSON or import failed"
      );
    } finally {
      setImportBusy(false);
    }
  }

  async function runImportManifest() {
    setImportBusy(true);
    setImportMsg(null);
    try {
      const parsed = JSON.parse(importText) as {
        drafts?: Array<{ to: string; apex: string; cohort?: string }>;
      };
      if (!parsed.drafts?.length) {
        throw new Error('Expected { "drafts": [ { "to", "apex", ... } ] }');
      }
      const rows = parsed.drafts.map((d) => ({
        email: d.to,
        apexDomain: d.apex,
        batchRunId: d.cohort || "fu-manifest",
        region: "Scottsdale",
        state: "AZ",
        stage: "fu1_sent" as Stage,
        vertical: "Med Spa / Aesthetics",
        notes: "Imported from FU2 on-deck manifest (FU1 done; FU2 draft not sent).",
      }));
      const r = (await admin.importPipelineRows(rows)) as { upserted: number };
      setImportMsg(
        `Upserted ${r.upserted} rows. Stages set to fu1_sent (draft ≠ sent).`
      );
      setImportText("");
      load();
    } catch (e: unknown) {
      setImportMsg(
        e instanceof Error ? e.message : "Invalid JSON or import failed"
      );
    } finally {
      setImportBusy(false);
    }
  }

  async function runImportBulkRows() {
    setImportBusy(true);
    setImportMsg(null);
    try {
      const parsed = JSON.parse(importText) as {
        rows?: Array<Record<string, unknown>>;
      };
      if (!Array.isArray(parsed.rows) || parsed.rows.length === 0) {
        throw new Error('Expected { "rows": [ { "email", ... }, ... ] }');
      }
      const r = (await admin.importPipelineRows(
        parsed.rows
      )) as { upserted: number };
      setImportMsg(`Imported / updated ${r.upserted} leads from rows[].`);
      setImportText("");
      load();
    } catch (e: unknown) {
      setImportMsg(
        e instanceof Error ? e.message : "Invalid JSON or import failed"
      );
    } finally {
      setImportBusy(false);
    }
  }

  async function saveRawSnapshot() {
    setImportBusy(true);
    setImportMsg(null);
    try {
      const rawJson = JSON.parse(importText) as unknown;
      await admin.createPipelineSnapshot({
        title: importTitle || `Snapshot ${new Date().toISOString().slice(0, 10)}`,
        rawJson,
        notes: importBatchId || "",
        source: "run_log",
      });
      setImportMsg("Snapshot saved (no lead rows changed).");
      setImportText("");
      loadSnapshots();
    } catch (e: unknown) {
      setImportMsg(
        e instanceof Error ? e.message : "Invalid JSON or save failed"
      );
    } finally {
      setImportBusy(false);
    }
  }

  async function openSnapshot(slug: string) {
    if (expandedSlug === slug) {
      setExpandedSlug(null);
      setExpandedJson(null);
      return;
    }
    const res = await fetch(`/api/admin/pipeline/snapshots/${slug}`);
    const data = await res.json();
    setExpandedSlug(slug);
    setExpandedJson(data.rawJson);
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Pipeline</h1>
          <p className="text-sm text-text-muted mt-1">
            MCP run logs + outreach stages. Refreshes every 30s.
          </p>
        </div>
        <button
          type="button"
          onClick={() => load()}
          className="self-start bg-white/10 text-white font-medium px-4 py-2 rounded-lg text-sm hover:bg-white/15"
        >
          Refresh now
        </button>
      </div>

      {stats && (
        <PipelineTodayPlaybook
          totalLeads={stats.total}
          fu1Sent={stats.byStage.fu1_sent ?? 0}
          fu2Sent={stats.byStage.fu2_sent ?? 0}
        />
      )}

      {stats && stats.total === 0 && (
        <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/95">
          <p className="font-medium text-amber-200 mb-1">Pipeline is empty in this database</p>
          <p className="text-amber-100/80 leading-relaxed">
            Gmail / MCP / Desktop JSON are not synced here automatically. Data lives in{" "}
            <strong className="text-white">MongoDB</strong> only after you import. Open the{" "}
            <strong className="text-white">Import</strong> tab and paste your{" "}
            <code className="text-accent">ondeck_fu2_scottsdale_med_spa_manifest.json</code>{" "}
            (or <code className="text-accent">pipeline_bulk_import_scottsdale_51.json</code> from{" "}
            <code className="text-accent">run_exports/</code>) and run the matching button.
          </p>
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          <div className="bg-navy-light border border-white/5 rounded-xl p-4">
            <p className="text-xs text-text-muted uppercase">Total</p>
            <p className="text-2xl font-bold text-accent mt-1">{stats.total}</p>
          </div>
          {["cold_sent", "fu1_sent", "fu2_sent", "replied"].map((s) => (
            <div
              key={s}
              className="bg-navy-light border border-white/5 rounded-xl p-4"
            >
              <p className="text-xs text-text-muted uppercase">{s}</p>
              <p className="text-2xl font-bold text-cta mt-1">
                {stats.byStage[s] ?? 0}
              </p>
            </div>
          ))}
        </div>
      )}

      <PipelineCharts stats={stats} chartData={chartData} />

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-white/10 pb-2">
        {(
          [
            ["leads", "Leads"],
            ["snapshots", "MCP snapshots"],
            ["import", "Import"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === id
                ? "bg-accent/15 text-accent"
                : "text-text-muted hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "leads" && (
        <>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="search"
              placeholder="Search email, domain, business, region…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && load()}
              className="flex-1 bg-navy-light border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-text-muted"
            />
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="bg-navy-light border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white"
            >
              <option value="all">All stages</option>
              {STAGES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="text-text-muted py-12">Loading…</div>
          ) : (
            <>
              <p className="text-xs text-text-muted mb-3">
                Showing {items.length} of {total}
              </p>
              <div className="overflow-x-auto rounded-xl border border-white/5">
                <table className="w-full text-sm text-left">
                  <thead className="bg-navy-light border-b border-white/5">
                    <tr>
                      <th className="p-3 text-text-muted font-medium">Email</th>
                      <th className="p-3 text-text-muted font-medium">Domain</th>
                      <th className="p-3 text-text-muted font-medium">Region</th>
                      <th className="p-3 text-text-muted font-medium">Stage</th>
                      <th className="p-3 text-text-muted font-medium">Batch</th>
                      <th className="p-3 text-text-muted font-medium">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((row) => (
                      <tr
                        key={row._id}
                        className="border-b border-white/5 hover:bg-white/[0.02]"
                      >
                        <td className="p-3 text-white max-w-[200px] truncate">
                          {row.email}
                        </td>
                        <td className="p-3 text-text-muted max-w-[140px] truncate">
                          {row.apexDomain}
                        </td>
                        <td className="p-3 text-text-muted whitespace-nowrap">
                          {row.region}
                          {row.state ? `, ${row.state}` : ""}
                        </td>
                        <td className="p-3">
                          <select
                            value={row.stage}
                            onChange={(e) =>
                              handleStageChange(
                                row._id,
                                e.target.value as Stage
                              )
                            }
                            className="bg-[#0a1528] border border-white/10 rounded px-2 py-1 text-xs text-white"
                          >
                            {STAGES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-3 text-text-muted text-xs max-w-[120px] truncate">
                          {row.batchRunId}
                        </td>
                        <td className="p-3 min-w-[200px]">
                          <textarea
                            defaultValue={row.notes}
                            placeholder="Notes…"
                            rows={2}
                            onBlur={(e) =>
                              handleNotesBlur(row._id, e.target.value)
                            }
                            className="w-full bg-[#0a1528] border border-white/10 rounded px-2 py-1 text-xs text-white resize-y min-h-[40px]"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {items.length === 0 && (
                <p className="text-text-muted py-8 text-center">
                  No leads yet. Use the Import tab to paste a run log JSON or
                  manifest.
                </p>
              )}
            </>
          )}
        </>
      )}

      {tab === "snapshots" && (
        <div className="space-y-4">
          <p className="text-sm text-text-muted">
            Raw MCP run_log JSON blobs for reference. Click to expand.
          </p>
          {snapshots.length === 0 ? (
            <p className="text-text-muted">No snapshots saved yet.</p>
          ) : (
            <ul className="space-y-2">
              {snapshots.map((s) => (
                <li
                  key={s._id}
                  className="bg-navy-light border border-white/5 rounded-xl p-4"
                >
                  <button
                    type="button"
                    onClick={() => openSnapshot(s.slug)}
                    className="text-left w-full"
                  >
                    <span className="font-medium text-white">{s.title}</span>
                    <span className="text-xs text-text-muted ml-2">
                      {s.slug} · {new Date(s.createdAt).toLocaleString()}
                    </span>
                  </button>
                  {expandedSlug === s.slug && expandedJson !== null && (
                    <pre className="mt-3 p-3 bg-black/40 rounded-lg text-xs text-text-muted overflow-x-auto max-h-[400px]">
                      {JSON.stringify(expandedJson, null, 2)}
                    </pre>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === "import" && (
        <div className="space-y-6 max-w-3xl">
          <div>
            <label className="block text-xs text-text-muted mb-2">
              Title (optional)
            </label>
            <input
              value={importTitle}
              onChange={(e) => setImportTitle(e.target.value)}
              className="w-full bg-navy-light border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
              placeholder="e.g. Scottsdale med spa 2026-03-24"
            />
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-2">
              Batch run ID (optional override)
            </label>
            <input
              value={importBatchId}
              onChange={(e) => setImportBatchId(e.target.value)}
              className="w-full bg-navy-light border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
              placeholder="e.g. 2026-03-24_scottsdale_med_spa"
            />
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-2">
              Paste JSON (run log, FU1 manifest, or any object)
            </label>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              rows={12}
              className="w-full font-mono text-xs bg-navy-light border border-white/10 rounded-lg px-4 py-3 text-white"
              placeholder='{ "run_region": "Scottsdale", ... }'
            />
          </div>
          {importMsg && (
            <p className="text-sm text-accent">{importMsg}</p>
          )}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={importBusy}
              onClick={runImportRunLog}
              className="bg-accent text-navy font-semibold px-4 py-2.5 rounded-lg text-sm hover:bg-accent/90 disabled:opacity-50"
            >
              Import leads from run log (FU1 recipients)
            </button>
            <button
              type="button"
              disabled={importBusy}
              onClick={runImportManifest}
              className="bg-white/10 text-white font-medium px-4 py-2.5 rounded-lg text-sm hover:bg-white/15 disabled:opacity-50"
            >
              Import from FU2 manifest (drafts[])
            </button>
            <button
              type="button"
              disabled={importBusy}
              onClick={runImportBulkRows}
              className="bg-white/10 text-white font-medium px-4 py-2.5 rounded-lg text-sm hover:bg-white/15 disabled:opacity-50"
            >
              Import bulk {"{ rows }"} (pre-built file)
            </button>
            <button
              type="button"
              disabled={importBusy}
              onClick={saveRawSnapshot}
              className="bg-white/10 text-white font-medium px-4 py-2.5 rounded-lg text-sm hover:bg-white/15 disabled:opacity-50"
            >
              Save snapshot only
            </button>
          </div>
          <p className="text-xs text-text-muted leading-relaxed">
            Copy JSON from <code className="text-accent">run_logs/*.json</code>{" "}
            on your machine, or paste an on-deck manifest with a{" "}
            <code className="text-accent">drafts</code> array. Pre-built{" "}
            <code className="text-accent">pipeline_bulk_import_scottsdale_51.json</code>{" "}
            (Desktop → Commonplace → run_exports) uses {" "}
            <code className="text-accent">{"{ \"rows\": [ ... ] }"}</code> — use the bulk
            button. Imports are idempotent by email.
          </p>
        </div>
      )}
    </div>
  );
}
