/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL || "sqlite:///./test.db",
    SECRET_KEY: process.env.SECRET_KEY || "supersecretkey",
    ALGORITHM: "HS256",
    ACCESS_TOKEN_EXPIRE_MINUTES: "1440", // Convertido a string
  },
}

module.exports = nextConfig 