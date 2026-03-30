/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["img.youtube.com"],
  },
  // Keep redirects() empty or host-agnostic only. Case-alias for /proposals lives in
  // middleware.ts (exact lowercase match) — next.config redirects match case-insensitively
  // and would 307-loop on /proposals/UncoverResearch.
  async redirects() {
    return [];
  },
};

export default nextConfig;
