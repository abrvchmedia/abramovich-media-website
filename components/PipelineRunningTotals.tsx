import {
  getPipelineStats,
  getPipelineChartAggregates,
} from "@/backend/controllers/pipelineController";

const DISPLAY_STAGES = [
  { key: "cold_sent", label: "Cold sent" },
  { key: "fu1_sent", label: "FU1 sent" },
  { key: "fu2_sent", label: "FU2 sent" },
  { key: "replied", label: "Replied" },
] as const;

/**
 * Same aggregates as /admin/pipeline. Always renders so the block is never missing;
 * on DB failure shows zeros + a short notice.
 */
export default async function PipelineRunningTotals() {
  let stats: Awaited<ReturnType<typeof getPipelineStats>> | null = null;
  let chartData: Awaited<ReturnType<typeof getPipelineChartAggregates>> | null =
    null;
  let loadError = false;

  try {
    [stats, chartData] = await Promise.all([
      getPipelineStats(),
      getPipelineChartAggregates(14),
    ]);
  } catch {
    loadError = true;
    stats = { total: 0, byStage: {} };
    chartData = { byBatch: [], activityByDay: [] };
  }

  const { total, byStage } = stats;
  const activity = chartData?.activityByDay ?? [];
  const recentUpdates = activity.reduce((a, b) => a + b.count, 0);

  return (
    <section
      id="mcp-offer-running-totals"
      className="section-wrap border-y border-white/10 bg-[#070d18] scroll-mt-24"
      aria-labelledby="mcp-offer-heading"
    >
      <div className="container-brand">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <span className="eyebrow text-accent/90 block mb-3">
              MCP · Lead gen
            </span>
            <h2
              id="mcp-offer-heading"
              className="section-heading text-white text-2xl sm:text-3xl"
            >
              MCP Offer Running Totals
            </h2>
            <p className="text-sm text-text-muted mt-2 max-w-xl">
              Same pipeline counts as{" "}
              <span className="text-white/80">/admin/pipeline</span> — no PII,
              refreshed each page load.
            </p>
            {loadError && (
              <p className="text-sm text-amber-400/90 mt-3">
                Live totals could not load (database or env). Counts below show
                zero until the deployment can reach MongoDB.
              </p>
            )}
          </div>
          {!loadError && recentUpdates > 0 && (
            <p className="text-xs text-text-muted tabular-nums">
              Last 14 days:{" "}
              <span className="text-cta font-medium">{recentUpdates}</span>{" "}
              record updates
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="bg-navy-light border border-accent/20 rounded-xl p-5 lg:col-span-1 col-span-2 ring-1 ring-white/5">
            <p className="text-xs text-text-muted uppercase tracking-wide">
              Total
            </p>
            <p className="text-3xl font-bold text-accent mt-1 tabular-nums">
              {total}
            </p>
            <p className="text-[11px] text-text-muted mt-2">Leads in pipeline</p>
          </div>
          {DISPLAY_STAGES.map(({ key, label }) => (
            <div
              key={key}
              className="bg-navy-light border border-white/5 rounded-xl p-5"
            >
              <p className="text-xs text-text-muted uppercase tracking-wide truncate">
                {label}
              </p>
              <p className="text-3xl font-bold text-cta mt-1 tabular-nums">
                {byStage[key] ?? 0}
              </p>
            </div>
          ))}
        </div>

        {chartData && chartData.byBatch.length > 0 && !loadError && (
          <div className="mt-8 pt-8 border-t border-white/5">
            <p className="text-xs text-text-muted uppercase tracking-wide mb-3">
              By batch / run
            </p>
            <div className="flex flex-wrap gap-2">
              {chartData.byBatch.slice(0, 8).map((b) => (
                <span
                  key={b.fullName}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-navy-light px-3 py-1.5 text-xs text-text-muted"
                >
                  <span className="max-w-[200px] truncate" title={b.fullName}>
                    {b.name}
                  </span>
                  <span className="text-white font-semibold tabular-nums">
                    {b.count}
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
