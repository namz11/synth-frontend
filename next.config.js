/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.SYNTH_BASE_API,
      },
    ];
  },
};

module.exports = nextConfig;
