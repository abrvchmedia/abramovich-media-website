import { NextRequest, NextResponse } from "next/server";
import {
  getPipelineStats,
  getPipelineChartAggregates,
  listLeads,
  createLead,
} from "@/backend/controllers/pipelineController";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const stage = searchParams.get("stage") || undefined;
    const limit = Number(searchParams.get("limit") || 200);
    const skip = Number(searchParams.get("skip") || 0);
    const [stats, chartData, { items, total }] = await Promise.all([
      getPipelineStats(),
      getPipelineChartAggregates(14),
      listLeads({ search, stage, limit, skip }),
    ]);
    return NextResponse.json({ stats, chartData, items, total });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load pipeline";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const lead = await createLead(data);
    return NextResponse.json(lead, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create lead";
    const status = message.includes("duplicate") || message.includes("E11000") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
