/** @type {import('next').NextConfig} */

const nextConfig = {
  transpilePackages: ["@hackathon-qrmenu/type","@hackathon-qrmenu/api-client","@hackathon-qrmenu/store"],


  images: {
    domains: [new URL(process.env.NEXT_PUBLIC_CDN_URL).hostname],
  },
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
