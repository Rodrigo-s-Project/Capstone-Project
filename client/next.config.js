/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: process.env.API_URL,
    CDN_URL: process.env.CDN_URL,
    STRIPE_KEY: process.env.STRIPE_KEY
  }
};

module.exports = nextConfig;
