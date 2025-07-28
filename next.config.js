/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para mejorar la estabilidad del desarrollo
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Mejorar la estabilidad del hot reload
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    return config
  },
  // Configuración del servidor de desarrollo
  devIndicators: {
    buildActivity: false,
  },
  // Configuración de compresión
  compress: true,
  // Configuración de headers para mejorar la estabilidad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig 