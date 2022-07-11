/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: process.env.API_URL,
    CDN_URL: process.env.CDN_URL
  }
};

module.exports = nextConfig;
