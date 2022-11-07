/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  env:{
    API_BASE_URL:process.env.API_BASE_URL,
    SOCKET_BASE_URL:process.env.SOCKET_BASE_URL
  },
  images: {
    domains: ['localhost']
  },
}

module.exports = nextConfig
