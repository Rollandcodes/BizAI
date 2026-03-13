import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply UTF-8 charset to every HTML route
        source: '/(.*)',
        headers: [
          { key: 'Content-Type', value: 'text/html; charset=UTF-8' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ];
  },
};

export default nextConfig;
