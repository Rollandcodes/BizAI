import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/',
        headers: [
          { key: 'Content-Type', value: 'text/html; charset=UTF-8' },
        ],
      },
      {
        source: '/dashboard',
        headers: [
          { key: 'Content-Type', value: 'text/html; charset=UTF-8' },
        ],
      },
      {
        source: '/widget/:businessId',
        headers: [
          { key: 'Content-Type', value: 'text/html; charset=UTF-8' },
        ],
      },
    ];
  },
};

export default nextConfig;
