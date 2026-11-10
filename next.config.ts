import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Image autonome : utile pour lancer le site avec docker compose (jalon m2)
  output: 'standalone',
};

export default nextConfig;
