module.exports = {
  reactStrictMode: true,
  swcMinify: false,
  transpilePackages: [
    "@hackathemy-qrmenu/type",
    "@hackathemy-qrmenu/api-client",
    "@hackathemy-qrmenu/store",
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
