/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has ESLint errors.
    // !! WARN !!
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  // swcMinify is deprecated in Next.js 16 (minification is always enabled)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.grc-platform.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async rewrites() {
    // Only proxy non-auth API routes to Kong
    // NextAuth routes (/api/auth/*) are handled by Next.js API routes and should NOT be proxied
    const rewrites = [];

    // Only add rewrite if Kong is available (for other API routes)
    // For now, we'll skip the rewrite since Kong isn't working
    // When Kong is fixed, uncomment this:
    // rewrites.push({
    //   source: '/api/:path((?!auth).)*',
    //   destination: `${process.env.API_URL || 'http://localhost:8000'}/api/:path*`,
    // });

    return rewrites;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  // Turbopack configuration for Next.js 16
  // Note: webpack config removed - Next.js 16 uses Turbopack by default
  // If you need webpack, use: next dev --webpack
  turbopack: {
    // Turbopack-specific config can go here if needed
  },
  // Configure webpack watchOptions to prevent continuous compilation
  // This helps with file watcher issues on macOS
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: false,
        ignored: [
          '**/node_modules/**',
          '**/.next/**',
          '**/.git/**',
          '**/coverage/**',
          '**/playwright-report/**',
          '**/test-results/**',
          '**/*.tsbuildinfo',
          '**/dist/**',
          '**/build/**',
        ],
      };
    }
    return config;
  },
};

module.exports = nextConfig;