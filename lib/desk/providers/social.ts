import type { DiscoveryProvider, DiscoveryResult } from "./types";
import type { DiscoveryProviderId } from "@/lib/desk/kinds";

function stub(id: DiscoveryProviderId): DiscoveryProvider {
  return {
    id,
    configured: () => false,
    async search({ query, kind }): Promise<DiscoveryResult> {
      return {
        provider: id,
        configured: false,
        query,
        kind,
        hits: [],
        note: `${id} is reserved for a later connector. Save contacts manually or run Web crawl / Google for now.`,
      };
    },
  };
}

export const linkedinProvider = stub("linkedin");
export const facebookProvider = stub("facebook");
export const instagramProvider = stub("instagram");
