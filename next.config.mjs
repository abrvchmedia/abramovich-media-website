/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["img.youtube.com"],
  },
  async redirects() {
    return [
      // Do not add apex→www redirects here — Vercel "Domains" already handles www/apex.
      // A duplicate host redirect in Next + Vercel's redirect causes infinite loops in Safari.
      {
        source: "/proposals/uncoverresearch",
        destination: "/proposals/UncoverResearch",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
