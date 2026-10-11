import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Development needs the locale proxy; production remains a static export.
  output: process.env.NODE_ENV === "development" ? undefined : "export",
  devIndicators: false,
  // The locale root layout cannot compose a global unmatched static-route page.
  experimental: {
    globalNotFound: true,
    // Keep static-generation workers bounded on the 8 GB development machine.
    cpus: 1,
  },
  images: {
    unoptimized: true,
  },
  /* config options here */
};

export default nextConfig;
