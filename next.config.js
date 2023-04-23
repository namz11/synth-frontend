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

// const nextConfig = {
//   reactStrictMode: true,
//   async rewrites() {
//     const protocol = process.env.SYNTH_BASE_API.startsWith("https")
//       ? "https://"
//       : "http://";
//     return [
//       {
//         source: "/api/:path*",
//         destination: `${protocol}${process.env.SYNTH_BASE_API}/api/:path*`,
//       },
//     ];
//   },
// };

// module.exports = nextConfig;
