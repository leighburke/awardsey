/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },  // temporary
  eslint: { ignoreDuringBuilds: true },     // temporary
  turbopack: {},                            // moved from experimental.turbo
}
module.exports = nextConfig
