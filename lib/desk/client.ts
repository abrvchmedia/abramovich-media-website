export type DeskRecordDTO = {
  _id: string;
  kind: string;
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
  deadline: string | null;
  applyUrl: string;
  genres: string[];
  tags: string[];
  geos: string[];
  markets: string[];
  taxCredits: string[];
  notable: string[];
  warmth: number;
  watchlisted: boolean;
  status: string;
  source: string;
  sourceProvider: string;
  sourceUrl: string;
  sourceQuery: string;
  sourceSnippet: string;
  photo: string;
  lastPrint: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type DeskStats = {
  total: number;
  watchlisted: number;
  byKind: Record<string, number>;
  byStage: Record<string, Record<string, number>>;
  tape: {
    t: string;
    kind: string;
    name: string;
    subtype: string;
    city: string;
    text: string;
    warmth: number;
  }[];
};

export type DiscoverHit = {
  title: string;
  url: string;
  snippet: string;
  sourceProvider: string;
};

export type DiscoverResult = {
  provider: string;
  configured: boolean;
  query: string;
  kind: string;
  hits: DiscoverHit[];
  note?: string;
};

async function deskFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  const body = await res.json().catch(() => ({ error: "Request failed" }));
  if (!res.ok) {
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return body as T;
}

export const deskApi = {
  login: (email: string, password: string) =>
    deskFetch("/api/desk/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  signup: (data: {
    name: string;
    email: string;
    password: string;
    inviteCode?: string;
  }) =>
    deskFetch("/api/desk/signup", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  logout: () => deskFetch("/api/desk/logout", { method: "POST" }),
  me: () => deskFetch<{ user: { id: string; email: string; role: string } }>(
    "/api/desk/me"
  ),
  records: (params?: Record<string, string>) => {
    const q = new URLSearchParams(params || {});
    const qs = q.toString();
    return deskFetch<{ items: DeskRecordDTO[] }>(
      `/api/desk/records${qs ? `?${qs}` : ""}`
    );
  },
  create: (data: Record<string, unknown>) =>
    deskFetch<DeskRecordDTO>("/api/desk/records", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Record<string, unknown>) =>
    deskFetch<DeskRecordDTO>(`/api/desk/records/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  remove: (id: string) =>
    deskFetch(`/api/desk/records/${id}`, { method: "DELETE" }),
  stats: () => deskFetch<DeskStats>("/api/desk/stats"),
  discover: (data: { kind: string; provider: string; query: string }) =>
    deskFetch<DiscoverResult>("/api/desk/discover", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
