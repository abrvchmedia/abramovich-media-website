import type { DeskBookId, DiscoveryProviderId } from "@/lib/desk/kinds";

export interface DiscoveryHit {
  title: string;
  url: string;
  snippet: string;
  sourceProvider: DiscoveryProviderId;
  city?: string;
  organization?: string;
}

export interface DiscoveryResult {
  provider: DiscoveryProviderId;
  configured: boolean;
  query: string;
  kind: DeskBookId;
  hits: DiscoveryHit[];
  note?: string;
}

export interface DiscoveryProvider {
  id: DiscoveryProviderId;
  configured(): boolean;
  search(input: {
    query: string;
    kind: DeskBookId;
  }): Promise<DiscoveryResult>;
}

export function kindSearchSuffix(kind: DeskBookId): string {
  switch (kind) {
    case "talent":
      return "actor model talent agency casting headshot";
    case "distribution":
      return "film distribution sales agent buyer";
    case "investor":
      return "film financier private equity media fund";
    case "production":
      return "film television commercial production casting call";
    case "brand":
      return "brand partnership influencer campaign commercial";
  }
}
