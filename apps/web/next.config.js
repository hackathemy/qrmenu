/** @type {import('next').NextConfig} */

const nextConfig = {
  transpilePackages: ["@hackathon/type","@hackathon/api-client","@hackathon/store"],


  images: {
    domains: [new URL(process.env.NEXT_PUBLIC_CDN_URL).hostname],
  },
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
