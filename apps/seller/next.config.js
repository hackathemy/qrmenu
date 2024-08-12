module.exports = {
  reactStrictMode: true,
  swcMinify: false,
  transpilePackages: [
    "@hackathon-qrmenu/type",
    "@hackathon-qrmenu/api-client",
    "@hackathon-qrmenu/store",
  ],
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bucket-18yx1w.s3.ap-northeast-2.amazonaws.com",
      },
    ],
  },
};
