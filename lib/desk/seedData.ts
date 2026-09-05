import investors from "../../data/desk/investors.json";
import distributors from "../../data/desk/distributors.json";
import type { DeskBookId } from "@/lib/desk/kinds";

type SeedRow = Record<string, unknown> & {
  kind: DeskBookId;
  name: string;
};

const talent: SeedRow[] = [
  {
    kind: "talent",
    stage: "roster",
    subtype: "ACTOR",
    name: "Sample — replace with your client",
    organization: "Abramovich Media roster",
    city: "Los Angeles",
    unionStatus: "SAG-AFTRA",
    headshotUrl:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80",
    reelUrl: "",
    genres: ["Drama", "Commercial", "Comedy"],
    tags: ["on-camera", "hosting"],
    notes:
      "Placeholder roster card. Add your talent clients with headshot + reel URLs so you can submit them to auditions from this desk.",
    warmth: 70,
    source: "seed",
    sourceProvider: "manual",
    lastPrint: "Sample roster card",
  },
  {
    kind: "talent",
    stage: "submitted",
    subtype: "MODEL",
    name: "Commercial print / on-camera lead",
    organization: "Open talent slot",
    city: "Phoenix",
    unionStatus: "Non-union",
    headshotUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
    genres: ["Commercial", "Lifestyle"],
    notes:
      "Use this row as a template when a client is out on a commercial submission.",
    warmth: 55,
    source: "seed",
    sourceProvider: "manual",
    lastPrint: "Template · commercial submission",
  },
];

const production: SeedRow[] = [
  {
    kind: "production",
    stage: "found",
    subtype: "COMMERCIAL",
    name: "National lifestyle commercial — principals",
    organization: "Sample casting notice",
    city: "Los Angeles",
    title: "Principal talent / spokesperson",
    logline:
      "Brand-safe on-camera principals for a lifestyle spot. Union and non-union tracked separately.",
    applyUrl: "https://www.backstage.com",
    website: "https://www.backstage.com",
    genres: ["Commercial", "Lifestyle"],
    tags: ["paid", "usage"],
    notes:
      "Seed listing so the production book is not empty. Replace with live notices from Web crawl / Google.",
    warmth: 60,
    source: "seed",
    sourceProvider: "web",
    lastPrint: "Sample commercial notice",
  },
  {
    kind: "production",
    stage: "reviewing",
    subtype: "FILM",
    name: "Independent drama — supporting roles",
    organization: "Sample indie production",
    city: "Atlanta",
    title: "Supporting / featured",
    unionStatus: "SAG-AFTRA",
    applyUrl: "https://www.actorsaccess.com",
    website: "https://www.actorsaccess.com",
    genres: ["Drama", "Festival"],
    geos: ["US", "GA"],
    taxCredits: ["GA"],
    notes: "Example film/TV production work card. Attach a roster client and submit.",
    warmth: 64,
    source: "seed",
    sourceProvider: "web",
    lastPrint: "Sample film notice · GA",
  },
  {
    kind: "production",
    stage: "found",
    subtype: "TV",
    name: "Streaming series — guest star / co-star",
    organization: "Sample TV casting",
    city: "New York",
    title: "Guest star / co-star",
    unionStatus: "SAG-AFTRA",
    genres: ["Drama", "TV"],
    applyUrl: "https://www.castingnetworks.com",
    website: "https://www.castingnetworks.com",
    warmth: 58,
    source: "seed",
    sourceProvider: "web",
    lastPrint: "Sample TV notice",
  },
];

const brand: SeedRow[] = [
  {
    kind: "brand",
    stage: "found",
    subtype: "SPORTS",
    name: "Athletic lifestyle campaign",
    organization: "Sample athletic brand",
    city: "Los Angeles",
    title: "On-camera + social deliverables",
    logline:
      "Looking for on-camera talent and a branded short. Usage: social + paid digital.",
    genres: ["Sports", "Commercial"],
    tags: ["UGC", "paid partnership"],
    notes:
      "Brand-deal book starts empty of live listings — this is a structure sample. Run Discover to pull public campaign postings.",
    warmth: 50,
    source: "seed",
    sourceProvider: "manual",
    lastPrint: "Sample brand deal structure",
  },
  {
    kind: "brand",
    stage: "found",
    subtype: "BEAUTY",
    name: "Clean beauty ambassador brief",
    organization: "Sample beauty house",
    city: "New York",
    title: "Ambassador / stills + reel",
    logline: "90-day ambassador window. Stills, 15s reel, usage in paid social.",
    genres: ["Beauty", "Lifestyle"],
    tags: ["ambassador"],
    warmth: 48,
    source: "seed",
    sourceProvider: "manual",
    lastPrint: "Sample beauty brief",
  },
];

function withDefaults(row: SeedRow): SeedRow {
  const merged: SeedRow = {
    stage: "lead",
    subtype: "",
    organization: row.organization || row.name,
    ticker: "",
    email: "",
    phone: "",
    website: "",
    city: "",
    region: "",
    country: "US",
    title: "",
    logline: "",
    thesis: "",
    approach: "",
    notes: "",
    aum: "",
    headshotUrl: "",
    reelUrl: "",
    unionStatus: "",
    applyUrl: "",
    genres: [],
    tags: [],
    geos: [],
    markets: [],
    taxCredits: [],
    notable: [],
    warmth: 50,
    watchlisted: false,
    status: "ACTIVE",
    source: "seed",
    sourceProvider: "seed",
    sourceUrl: "",
    sourceQuery: "",
    sourceSnippet: "",
    photo: "",
    lastPrint: "",
    createdBy: "seed",
    ...row,
  };
  merged.status = normalizeDeskStatus(merged.status);
  return merged;
}

function normalizeDeskStatus(value: unknown): string {
  const raw = String(value || "ACTIVE").toUpperCase();
  if (["ACTIVE", "SELECTIVE", "CLOSED", "ARCHIVED"].includes(raw)) return raw;
  return "ACTIVE";
}

export function getDeskSeedRecords(): SeedRow[] {
  const investorRows = (investors as SeedRow[]).map((row) =>
    withDefaults({
      ...row,
      kind: "investor",
      stage: "research",
    })
  );
  const distributionRows = (distributors as SeedRow[]).map((row) =>
    withDefaults({
      ...row,
      kind: "distribution",
      stage: "lead",
    })
  );
  return [
    ...investorRows,
    ...distributionRows,
    ...talent.map(withDefaults),
    ...production.map(withDefaults),
    ...brand.map(withDefaults),
  ];
}
