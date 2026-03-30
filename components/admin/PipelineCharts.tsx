"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const ACCENT = "#F5E50A";
const CTA = "#16C784";
const SECONDARY = "#2563EB";
const MUTED = "#6B7280";
const GRID = "rgba(55, 65, 81, 0.5)";
const LABEL = "#9CA3AF";

const STAGE_ORDER = [
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

type Stage = (typeof STAGE_ORDER)[number];

interface Stats {
  total: number;
  byStage: Record<string, number>;
}

interface ChartData {
  byBatch: { name: string; fullName: string; count: number }[];
  activityByDay: { day: string; count: number }[];
}

interface Props {
  stats: Stats | null;
  chartData: ChartData | null;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name: string; color?: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-[#0a1528] px-3 py-2 text-xs shadow-xl">
      <p className="text-text-muted mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="font-medium text-white tabular-nums">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

export function PipelineCharts({ stats, chartData }: Props) {
  const stageBars = useMemo(() => {
    if (!stats) return [];
    return STAGE_ORDER.map((stage) => ({
      stage: stage.replace(/_/g, " "),
      key: stage,
      count: stats.byStage[stage] ?? 0,
    }));
  }, [stats]);

  const funnel = useMemo(() => {
    if (!stats) return [];
    const keys: Stage[] = [
      "cold_sent",
      "fu1_sent",
      "fu2_sent",
      "replied",
    ];
    return keys.map((k) => ({
      name: k.replace(/_/g, " "),
      value: stats.byStage[k] ?? 0,
    }));
  }, [stats]);

  const pieData = useMemo(() => {
    if (!stats) return [];
    return STAGE_ORDER.map((s) => ({
      name: s.replace(/_/g, " "),
      value: stats.byStage[s] ?? 0,
    })).filter((d) => d.value > 0);
  }, [stats]);

  const pieColors = [ACCENT, CTA, SECONDARY, "#8B5CF6", "#EC4899", "#F97316", MUTED];

  const activity = chartData?.activityByDay ?? [];
  const batches = chartData?.byBatch ?? [];

  const activityLine = useMemo(
    () =>
      activity.map((row) => ({
        ...row,
        label: row.day.slice(5),
      })),
    [activity]
  );

  if (!stats || stats.total === 0) {
    return (
      <div className="mb-8 rounded-2xl border border-white/5 bg-navy-light/50 p-8 text-center">
        <p className="text-sm text-text-muted max-w-md mx-auto leading-relaxed">
          Nothing in MongoDB yet — charts need imported leads. Use Pipeline →{" "}
          <span className="text-white/90">Import</span> (run log, FU2 manifest, or{" "}
          <code className="text-accent text-[11px]">pipeline_bulk_import_scottsdale_51.json</code>
          ).
        </p>
      </div>
    );
  }

  return (
    <div className="mb-8 space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-gradient-to-b from-navy-light to-[#0d1629] p-5 shadow-card">
          <div className="mb-4 flex items-baseline justify-between gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-white">
              Pipeline by stage
            </h2>
            <span className="text-xs text-text-muted">All leads</span>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stageBars}
                margin={{ top: 8, right: 8, left: -8, bottom: 48 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
                <XAxis
                  dataKey="stage"
                  tick={{ fill: LABEL, fontSize: 10 }}
                  interval={0}
                  angle={-35}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fill: LABEL, fontSize: 11 }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={36}>
                  {stageBars.map((_, i) => (
                    <Cell
                      key={i}
                      fill={i % 3 === 0 ? ACCENT : i % 3 === 1 ? CTA : SECONDARY}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-gradient-to-b from-navy-light to-[#0d1629] p-5 shadow-card">
          <div className="mb-4 flex items-baseline justify-between gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-white">
              Core funnel
            </h2>
            <span className="text-xs text-text-muted">cold → reply</span>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={funnel} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
                <XAxis dataKey="name" tick={{ fill: LABEL, fontSize: 11 }} />
                <YAxis tick={{ fill: LABEL, fontSize: 11 }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={ACCENT}
                  strokeWidth={2.5}
                  dot={{ fill: CTA, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: ACCENT }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-gradient-to-b from-navy-light to-[#0d1629] p-5 shadow-card">
          <div className="mb-4 flex items-baseline justify-between gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-white">
              Activity
            </h2>
            <span className="text-xs text-text-muted">Updates per day (UTC, 14d)</span>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityLine} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="pipeActivity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CTA} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={CTA} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
                <XAxis dataKey="label" tick={{ fill: LABEL, fontSize: 10 }} />
                <YAxis tick={{ fill: LABEL, fontSize: 11 }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Updates"
                  stroke={CTA}
                  strokeWidth={2}
                  fill="url(#pipeActivity)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-gradient-to-b from-navy-light to-[#0d1629] p-5 shadow-card">
          <div className="mb-4 flex items-baseline justify-between gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-white">
              Stage mix
            </h2>
            <span className="text-xs text-text-muted">Non-zero only</span>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={88}
                  paddingAngle={2}
                  stroke="none"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={pieColors[i % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 11 }}
                  formatter={(value) => (
                    <span className="text-text-muted">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {batches.length > 0 && (
        <div className="rounded-2xl border border-white/5 bg-gradient-to-b from-navy-light to-[#0d1629] p-5 shadow-card">
          <div className="mb-4 flex items-baseline justify-between gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-white">
              By batch / cohort
            </h2>
            <span className="text-xs text-text-muted">Top runs</span>
          </div>
          <div
            className="w-full min-h-[200px]"
            style={{ height: Math.min(420, 80 + batches.length * 32) }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={batches}
                margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={GRID} horizontal={false} />
                <XAxis type="number" tick={{ fill: LABEL, fontSize: 11 }} allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={140}
                  tick={{ fill: LABEL, fontSize: 10 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.[0]) return null;
                    const p = payload[0].payload as { fullName: string; count: number };
                    return (
                      <div className="rounded-lg border border-white/10 bg-[#0a1528] px-3 py-2 text-xs shadow-xl max-w-md">
                        <p className="text-text-muted mb-1 break-all">{p.fullName}</p>
                        <p className="font-medium text-white">{p.count} leads</p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} fill={SECONDARY} maxBarSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
