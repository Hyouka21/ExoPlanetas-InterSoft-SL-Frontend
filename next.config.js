/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/:path*',
      },
    ]
  },
  // Optimizaciones de rendimiento
  experimental: {
    optimizeCss: true,
  },
  // Configuración de compilación más rápida
  swcMinify: true,
  // Reducir el tamaño del bundle
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig
