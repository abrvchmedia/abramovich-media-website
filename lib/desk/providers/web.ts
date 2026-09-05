import type { DeskBookId } from "@/lib/desk/kinds";
import {
  kindSearchSuffix,
  type DiscoveryHit,
  type DiscoveryProvider,
  type DiscoveryResult,
} from "./types";

const USER_AGENT =
  "AbramovichMediaDesk/1.0 (+https://www.abramovichmedia.com/desk)";

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
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export async function searchDuckDuckGo(
  query: string
): Promise<DiscoveryHit[]> {
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
  const html = await res.text();
  const hits: DiscoveryHit[] = [];
  const blockRe =
    /<a[^>]*class="[^"]*result__a[^"]*"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?(?:class="result__snippet"[^>]*>([\s\S]*?)<\/)/gi;
  let match: RegExpExecArray | null;
  while ((match = blockRe.exec(html)) && hits.length < 12) {
    const url = decodeDuckHref(match[1]);
    if (!url.startsWith("http")) continue;
    if (url.includes("duckduckgo.com")) continue;
    hits.push({
      title: stripTags(match[2]).slice(0, 180),
      url,
      snippet: stripTags(match[3] || "").slice(0, 280),
      sourceProvider: "web",
    });
  }
  return hits;
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
    const hits = await searchDuckDuckGo(q);
    return {
      provider: "web",
      configured: true,
      query: q,
      kind,
      hits,
      note: "Public web crawl. Social graph sources can be plugged in later.",
    };
  },
};

export function buildDiscoverQuery(kind: DeskBookId, query: string) {
  return `${query} ${kindSearchSuffix(kind)}`.trim();
}
