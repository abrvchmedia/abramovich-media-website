export const DESK_BOOKS = [
  {
    id: "talent",
    label: "Talent search",
    short: "Talent",
    subtitle: "Roster, headshots, auditions",
  },
  {
    id: "distribution",
    label: "Distribution search",
    short: "Distribution",
    subtitle: "Sales agents, buyers, territories",
  },
  {
    id: "investor",
    label: "Investor / PE financier",
    short: "Investors",
    subtitle: "Equity, family offices, gap, debt",
  },
  {
    id: "production",
    label: "Commercial + film / TV",
    short: "Production",
    subtitle: "Jobs, castings, production work",
  },
  {
    id: "brand",
    label: "Brand deals",
    short: "Brand deals",
    subtitle: "Commercial partnerships & campaigns",
  },
] as const;

export type DeskBookId = (typeof DESK_BOOKS)[number]["id"];

export const DESK_KINDS = DESK_BOOKS.map((b) => b.id);

export const SUBTYPES: Record<DeskBookId, { value: string; label: string }[]> = {
  talent: [
    { value: "ACTOR", label: "Actor" },
    { value: "MODEL", label: "Model" },
    { value: "HOST", label: "Host / presenter" },
    { value: "INFLUENCER", label: "Influencer" },
    { value: "DIRECTOR", label: "Director" },
    { value: "CREW", label: "Crew" },
  ],
  distribution: [
    { value: "SALES", label: "Sales agent" },
    { value: "STUDIO", label: "Studio / buyer" },
    { value: "STREAMER", label: "Streamer" },
    { value: "TERRITORY", label: "Territory distributor" },
    { value: "FESTIVAL", label: "Festival / market" },
  ],
  investor: [
    { value: "PE", label: "Private equity" },
    { value: "FAMILY", label: "Family office" },
    { value: "FUND", label: "Film fund" },
    { value: "GAP", label: "Gap / mezz" },
    { value: "SALES", label: "Sales / MG" },
    { value: "STUDIO", label: "Studio / buyer" },
    { value: "DEBT", label: "Senior debt" },
    { value: "BOND", label: "Completion bond" },
  ],
  production: [
    { value: "COMMERCIAL", label: "Commercial" },
    { value: "FILM", label: "Film" },
    { value: "TV", label: "Television" },
    { value: "NEW_MEDIA", label: "New media / digital" },
    { value: "THEATER", label: "Theater" },
  ],
  brand: [
    { value: "FASHION", label: "Fashion" },
    { value: "BEAUTY", label: "Beauty" },
    { value: "AUTO", label: "Auto" },
    { value: "CPG", label: "CPG / CPG retail" },
    { value: "TECH", label: "Tech" },
    { value: "SPORTS", label: "Sports" },
    { value: "LUXURY", label: "Luxury" },
    { value: "OTHER", label: "Other" },
  ],
};

export const STAGES: Record<DeskBookId, { value: string; label: string }[]> = {
  talent: [
    { value: "roster", label: "Roster" },
    { value: "submitted", label: "Submitted" },
    { value: "audition", label: "Audition" },
    { value: "callback", label: "Callback" },
    { value: "booked", label: "Booked" },
    { value: "passed", label: "Passed" },
  ],
  distribution: [
    { value: "lead", label: "Lead" },
    { value: "outreach", label: "Outreach" },
    { value: "intro", label: "Intro" },
    { value: "packaging", label: "Packaging" },
    { value: "closed", label: "Closed" },
    { value: "passed", label: "Passed" },
  ],
  investor: [
    { value: "lead", label: "Lead" },
    { value: "research", label: "Research" },
    { value: "outreach", label: "Outreach" },
    { value: "intro", label: "Intro" },
    { value: "term_sheet", label: "Term sheet" },
    { value: "closed", label: "Closed" },
    { value: "passed", label: "Passed" },
  ],
  production: [
    { value: "found", label: "Found" },
    { value: "reviewing", label: "Reviewing" },
    { value: "submitted", label: "Submitted" },
    { value: "interviewing", label: "Interviewing" },
    { value: "booked", label: "Booked" },
    { value: "passed", label: "Passed" },
  ],
  brand: [
    { value: "found", label: "Found" },
    { value: "pitched", label: "Pitched" },
    { value: "negotiating", label: "Negotiating" },
    { value: "booked", label: "Booked" },
    { value: "passed", label: "Passed" },
  ],
};

export const DISCOVERY_PROVIDERS = [
  {
    id: "web",
    label: "Web crawl",
    ready: true,
    hint: "Public search + page crawl (current method)",
  },
  {
    id: "google",
    label: "Google",
    ready: true,
    hint: "Custom Search when keys are set; otherwise web fallback",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    ready: false,
    hint: "Reserved — connect a LinkedIn source later",
  },
  {
    id: "facebook",
    label: "Facebook",
    ready: false,
    hint: "Reserved — connect a Facebook source later",
  },
  {
    id: "instagram",
    label: "Instagram",
    ready: false,
    hint: "Reserved — connect an Instagram source later",
  },
] as const;

export type DiscoveryProviderId = (typeof DISCOVERY_PROVIDERS)[number]["id"];

export function isDeskBook(value: string): value is DeskBookId {
  return (DESK_KINDS as string[]).includes(value);
}

export function defaultStage(kind: DeskBookId): string {
  return STAGES[kind][0].value;
}

export function subtypeLabel(kind: DeskBookId, value: string): string {
  return SUBTYPES[kind].find((s) => s.value === value)?.label || value;
}

export function stageLabel(kind: DeskBookId, value: string): string {
  return STAGES[kind].find((s) => s.value === value)?.label || value;
}

export const BOOK_SEARCH_HINT: Record<DeskBookId, string> = {
  talent: "SCAN  /  name, city, union, skill",
  distribution: "SCAN  /  sales agent, buyer, territory, market",
  investor: "SCAN  /  name, ticker, genre, city",
  production: "SCAN  /  role, commercial, film, TV, city",
  brand: "SCAN  /  brand, campaign, category, deliverable",
};

export const DISCOVER_QUERY_HINT: Record<DeskBookId, string> = {
  talent: "SAG-AFTRA actor Los Angeles commercial",
  distribution: "independent film sales agent AFM",
  investor: "film private equity financier media fund",
  production: "paid commercial casting call Los Angeles",
  brand: "brand ambassador campaign paid partnership",
};
