/** @type {import('next').NextConfig} */

const nextConfig = {
  transpilePackages: ["@hackathemy-qrmenu/type","@hackathemy-qrmenu/api-client","@hackathemy-qrmenu/store"],


  images: {
    domains: [new URL(process.env.NEXT_PUBLIC_CDN_URL).hostname],
  },
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
