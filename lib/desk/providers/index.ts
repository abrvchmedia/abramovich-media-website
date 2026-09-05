import type { DiscoveryProviderId, DeskBookId } from "@/lib/desk/kinds";
import { webProvider } from "./web";
import { googleProvider } from "./google";
import {
  facebookProvider,
  instagramProvider,
  linkedinProvider,
} from "./social";
import type { DiscoveryProvider, DiscoveryResult } from "./types";

const registry: Record<DiscoveryProviderId, DiscoveryProvider> = {
  web: webProvider,
  google: googleProvider,
  linkedin: linkedinProvider,
  facebook: facebookProvider,
  instagram: instagramProvider,
};

export async function runDiscovery(input: {
  provider: DiscoveryProviderId;
  query: string;
  kind: DeskBookId;
}): Promise<DiscoveryResult> {
  const query = input.query.trim();
  if (query.length < 2) throw new Error("Enter a search query");
  const provider = registry[input.provider];
  if (!provider) throw new Error("Unknown discovery provider");
  return provider.search({ query, kind: input.kind });
}

export { type DiscoveryResult, type DiscoveryHit } from "./types";
