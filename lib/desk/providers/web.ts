import type { DeskBookId } from "@/lib/desk/kinds";
import {
  kindSearchSuffix,
  type DiscoveryHit,
  type DiscoveryProvider,
  type DiscoveryResult,
} from "./types";

const USER_AGENT =
  "Mozilla/5.0 (compatible; AbramovichMediaDesk/1.0; +https://www.abramovichmedia.com/desk)";

function decodeDuckHref(href: string): string {
  try {
    const url = new URL(href, "https://html.duckduckgo.com");
    const uddg = url.searchParams.get("uddg");
    if (uddg) return decodeURIComponent(uddg);
    if (href.startsWith("http")) return href;
    return url.toString();
  } catch {
    return href;
  }
}

function stripTags(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function isUsableUrl(url: string) {
  if (!url.startsWith("http")) return false;
  const blocked = [
    "duckduckgo.com",
    "bing.com",
    "microsoft.com",
    "google.com",
    "googleusercontent.com",
  ];
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return !blocked.some((b) => host === b || host.endsWith(`.${b}`));
  } catch {
    return false;
  }
}

function parseDuckHits(html: string): DiscoveryHit[] {
  const hits: DiscoveryHit[] = [];
  const seen = new Set<string>();
  const patterns = [
    /<a[^>]*class="[^"]*result__a[^"]*"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?(?:class="result__snippet"[^>]*>([\s\S]*?)<\/)?/gi,
    /<a[^>]*class="[^"]*result-link[^"]*"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi,
  ];
  for (const blockRe of patterns) {
    let match: RegExpExecArray | null;
    while ((match = blockRe.exec(html)) && hits.length < 12) {
      const url = decodeDuckHref(match[1]);
      if (!isUsableUrl(url) || seen.has(url)) continue;
      seen.add(url);
      hits.push({
        title: stripTags(match[2]).slice(0, 180) || url,
        url,
        snippet: stripTags(match[3] || "").slice(0, 280),
        sourceProvider: "web",
      });
    }
  }
  return hits;
}

function parseBingHits(html: string): DiscoveryHit[] {
  const hits: DiscoveryHit[] = [];
  const seen = new Set<string>();
  const blockRe =
    /<li class="b_algo"[\s\S]*?<h2[^>]*>\s*<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?(?:<p[^>]*>([\s\S]*?)<\/p>)?/gi;
  let match: RegExpExecArray | null;
  while ((match = blockRe.exec(html)) && hits.length < 12) {
    const url = match[1];
    if (!isUsableUrl(url) || seen.has(url)) continue;
    seen.add(url);
    hits.push({
      title: stripTags(match[2]).slice(0, 180) || url,
      url,
      snippet: stripTags(match[3] || "").slice(0, 280),
      sourceProvider: "web",
    });
  }
  return hits;
}

export async function searchDuckDuckGo(query: string): Promise<DiscoveryHit[]> {
  const body = new URLSearchParams({ q: query, kl: "us-en" });
  const res = await fetch("https://html.duckduckgo.com/html/", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "user-agent": USER_AGENT,
    },
    body,
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Web search failed (${res.status})`);
  }
  return parseDuckHits(await res.text());
}

export async function searchBing(query: string): Promise<DiscoveryHit[]> {
  const url = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: {
      "user-agent": USER_AGENT,
      accept: "text/html",
    },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Web search fallback failed (${res.status})`);
  }
  return parseBingHits(await res.text());
}

type WikiSearchResponse = {
  query?: {
    search?: { title: string; snippet?: string }[];
  };
};

export async function searchWikipedia(query: string): Promise<DiscoveryHit[]> {
  const url = new URL("https://en.wikipedia.org/w/api.php");
  url.searchParams.set("action", "query");
  url.searchParams.set("list", "search");
  url.searchParams.set("srsearch", query);
  url.searchParams.set("utf8", "1");
  url.searchParams.set("format", "json");
  url.searchParams.set("srlimit", "8");
  const res = await fetch(url.toString(), {
    headers: { "user-agent": USER_AGENT, accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Wikipedia search failed (${res.status})`);
  const json = (await res.json()) as WikiSearchResponse;
  return (json.query?.search || []).map((row) => ({
    title: row.title,
    url: `https://en.wikipedia.org/wiki/${encodeURIComponent(row.title.replace(/ /g, "_"))}`,
    snippet: stripTags(row.snippet || ""),
    sourceProvider: "web",
  }));
}

const DIRECTORIES: Record<DeskBookId, DiscoveryHit[]> = {
  talent: [
    {
      title: "Backstage — casting calls",
      url: "https://www.backstage.com/casting/",
      snippet: "Public casting notices for actors, models, and crew.",
      sourceProvider: "web",
    },
    {
      title: "Actors Access",
      url: "https://www.actorsaccess.com/",
      snippet: "Breakdowns and submissions for represented talent.",
      sourceProvider: "web",
    },
    {
      title: "Casting Networks",
      url: "https://www.castingnetworks.com/",
      snippet: "Commercial and theatrical casting platform.",
      sourceProvider: "web",
    },
  ],
  distribution: [
    {
      title: "American Film Market",
      url: "https://americanfilmmarket.com/",
      snippet: "Sales agents, buyers, and market directory.",
      sourceProvider: "web",
    },
    {
      title: "Marché du Film — Cannes",
      url: "https://www.marchedufilm.com/",
      snippet: "International sales and distribution market.",
      sourceProvider: "web",
    },
    {
      title: "FilmFreeway",
      url: "https://filmfreeway.com/",
      snippet: "Festival and market submissions.",
      sourceProvider: "web",
    },
  ],
  investor: [
    {
      title: "Variety — Film Finance",
      url: "https://variety.com/t/film-finance/",
      snippet: "Trade coverage of funds, slates, and financiers.",
      sourceProvider: "web",
    },
    {
      title: "American Film Market",
      url: "https://americanfilmmarket.com/",
      snippet: "Where gap, sales, and equity desks meet packages.",
      sourceProvider: "web",
    },
    {
      title: "Deadline — Finance",
      url: "https://deadline.com/category/film/finance/",
      snippet: "Deal reporting on media funds and buyers.",
      sourceProvider: "web",
    },
  ],
  production: [
    {
      title: "Backstage — production jobs",
      url: "https://www.backstage.com/casting/",
      snippet: "Casting and production work notices.",
      sourceProvider: "web",
    },
    {
      title: "ProductionHUB",
      url: "https://www.productionhub.com/jobs",
      snippet: "Crew and production job listings.",
      sourceProvider: "web",
    },
    {
      title: "Entertainment Careers",
      url: "https://www.entertainmentcareers.net/",
      snippet: "Film, TV, and commercial production openings.",
      sourceProvider: "web",
    },
  ],
  brand: [
    {
      title: "AspireIQ marketplace",
      url: "https://www.aspire.io/",
      snippet: "Creator and brand campaign marketplace.",
      sourceProvider: "web",
    },
    {
      title: "Influencer Marketing Hub",
      url: "https://influencermarketinghub.com/",
      snippet: "Brand partnership listings and briefs.",
      sourceProvider: "web",
    },
    {
      title: "Backstage — commercial casting",
      url: "https://www.backstage.com/casting/",
      snippet: "On-camera commercial and branded-content notices.",
      sourceProvider: "web",
    },
  ],
};

function directoryFallback(kind: DeskBookId, query: string): DiscoveryHit[] {
  const q = query.trim().toLowerCase();
  const rows = DIRECTORIES[kind] || [];
  if (!q) return rows;
  const matched = rows.filter((row) =>
    `${row.title} ${row.snippet}`.toLowerCase().includes(q)
  );
  return matched.length ? matched : rows;
}

export async function crawlPublicPage(url: string): Promise<{
  title: string;
  snippet: string;
  organization?: string;
}> {
  const res = await fetch(url, {
    headers: { "user-agent": USER_AGENT, accept: "text/html" },
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Crawl failed (${res.status})`);
  const html = (await res.text()).slice(0, 200_000);
  const title =
    html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/i)?.[1] ||
    html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ||
    url;
  const snippet =
    html.match(
      /<meta[^>]+(?:name|property)="(?:description|og:description)"[^>]+content="([^"]+)"/i
    )?.[1] || "";
  return {
    title: stripTags(title).slice(0, 180),
    snippet: stripTags(snippet).slice(0, 280),
  };
}

export const webProvider: DiscoveryProvider = {
  id: "web",
  configured: () => true,
  async search({ query, kind }): Promise<DiscoveryResult> {
    const q = `${query} ${kindSearchSuffix(kind)}`.trim();
    let hits: DiscoveryHit[] = [];
    let note = "Public web crawl. Social graph sources can be plugged in later.";
    try {
      hits = await searchDuckDuckGo(q);
    } catch {
      hits = [];
    }
    if (hits.length === 0) {
      try {
        hits = await searchBing(q);
        if (hits.length) {
          note = "DuckDuckGo returned no parseable hits from this host; used Bing public results.";
        }
      } catch {
        hits = [];
      }
    }
    if (hits.length === 0) {
      try {
        hits = await searchWikipedia(q);
        if (hits.length) {
          note =
            "Datacenter crawl of DuckDuckGo/Bing returned no parseable HTML. Showing Wikipedia / public-web index hits. Add GOOGLE_CSE_ID + GOOGLE_API_KEY for Google.";
        }
      } catch {
        hits = [];
      }
    }
    if (hits.length === 0) {
      hits = directoryFallback(kind, query);
      note =
        "Live HTML crawl was blocked from this host. Showing public industry directories you can save now. Add Google CSE keys for query search.";
    }
    return {
      provider: "web",
      configured: true,
      query: q,
      kind,
      hits,
      note,
    };
  },
};

export function buildDiscoverQuery(kind: DeskBookId, query: string) {
  return `${query} ${kindSearchSuffix(kind)}`.trim();
}
