/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // `STATIC_EXPORT=1 next build` produces a fully static site in /out
  output: process.env.STATIC_EXPORT ? "export" : undefined,
  images: { unoptimized: true },
  poweredByHeader: false,
  // the deploy (Vercel) should not fail on lint warnings or style rules; run `npm run lint` locally instead
  eslint: { ignoreDuringBuilds: true },
  // no Next.js badge in the corner while developing
  devIndicators: false,
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/video/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
