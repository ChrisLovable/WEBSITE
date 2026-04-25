/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  // Browsers still request /favicon.ico by default; serve the site logo so the tab icon 404s go away.
  async rewrites() {
    return [{ source: '/favicon.ico', destination: '/logo.png' }];
  }
};

export default nextConfig;

