/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config, { isServer }) => {
    // Fix for Leaflet's missing images in production build
    if (!isServer) {
      config.resolve.alias.leaflet$ = require.resolve('leaflet');
    }
    return config;
  },
};

module.exports = nextConfig;
