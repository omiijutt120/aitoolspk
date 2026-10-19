import type { NextConfig } from 'next';
const config: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  reactStrictMode: true,
  // Bound build concurrency for laptops while exporting the complete catalog.
  experimental: { cpus: 2, webpackMemoryOptimizations: true },
};
export default config;
