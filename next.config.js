/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  async rewrites() {
    // Only proxy to localhost in development
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:8000/:path*',
        },
      ]
    }
    // In production, the API calls will go to the configured NEXT_PUBLIC_API_URL
    return []
  },
  // Performance optimizations
  experimental: {
    optimizeCss: true,
  },
  // Faster compilation
  swcMinify: true,
  // Reduce bundle size
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig
