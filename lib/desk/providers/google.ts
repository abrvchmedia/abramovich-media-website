import { kindSearchSuffix, type DiscoveryProvider, type DiscoveryResult } from "./types";
import { searchDuckDuckGo } from "./web";

const GOOGLE_ENDPOINT = "https://www.googleapis.com/customsearch/v1";

export const googleProvider: DiscoveryProvider = {
  id: "google",
  configured: () =>
    Boolean(process.env.GOOGLE_CSE_ID && process.env.GOOGLE_API_KEY),
  async search({ query, kind }): Promise<DiscoveryResult> {
    const q = `${query} ${kindSearchSuffix(kind)}`.trim();
    const cx = process.env.GOOGLE_CSE_ID;
    const key = process.env.GOOGLE_API_KEY;

    if (!cx || !key) {
      const hits = await searchDuckDuckGo(q);
      return {
        provider: "google",
        configured: false,
        query: q,
        kind,
        hits: hits.map((h) => ({ ...h, sourceProvider: "google" })),
        note: "GOOGLE_CSE_ID / GOOGLE_API_KEY not set — using public web crawl. Add Programmable Search keys on Vercel to switch to Google.",
      };
    }

    const url = new URL(GOOGLE_ENDPOINT);
    url.searchParams.set("key", key);
    url.searchParams.set("cx", cx);
    url.searchParams.set("q", q);
    url.searchParams.set("num", "10");

    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Google search failed (${res.status})`);
    }
    const json = (await res.json()) as {
      items?: { title: string; link: string; snippet?: string }[];
    };
    return {
      provider: "google",
      configured: true,
      query: q,
      kind,
      hits: (json.items || []).map((item) => ({
        title: item.title,
        url: item.link,
        snippet: item.snippet || "",
        sourceProvider: "google",
      })),
    };
  },
};
