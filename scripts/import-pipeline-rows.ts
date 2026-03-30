/**
 * One-shot: upsert pipeline leads from JSON { rows: [...] } or a bare array.
 * Usage:
 *   npx tsx scripts/import-pipeline-rows.ts path/to/pipeline_bulk_import.json
 * Loads .env.local from project root for MONGODB_URI.
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import { config } from "dotenv";

config({ path: resolve(process.cwd(), ".env.local") });

import type { PipelineStage } from "../backend/models/PipelineLead";

type Row = {
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
};

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error(
      "Usage: npx tsx scripts/import-pipeline-rows.ts <path-to-json>"
    );
    process.exit(1);
  }
  if (!process.env.MONGODB_URI) {
    console.error("Missing MONGODB_URI (check .env.local)");
    process.exit(1);
  }

  const raw = JSON.parse(readFileSync(file, "utf8")) as
    | { rows?: Row[] }
    | Row[];
  const rows = Array.isArray(raw) ? raw : raw.rows;
  if (!Array.isArray(rows) || rows.length === 0) {
    console.error("JSON must be { rows: [...] } or a [...] array");
    process.exit(1);
  }

  const { bulkImportLeads } = await import(
    "../backend/controllers/pipelineController"
  );
  const { upserted } = await bulkImportLeads(
    rows as Parameters<typeof bulkImportLeads>[0]
  );
  console.log(`OK — upserted ${upserted} leads`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
