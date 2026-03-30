/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["img.youtube.com"],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "abramovichmedia.com",
          },
        ],
        destination: "https://www.abramovichmedia.com/:path*",
        permanent: true,
      },
      {
        source: "/proposals/uncoverresearch",
        destination: "/proposals/UncoverResearch",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
