/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // Dev demo proxy (app/demo/[port]/...): Grafana needs /demo/<port>/ to keep its trailing slash.
  // In production nginx serves /demo/ and Next keeps its default redirect.
  skipTrailingSlashRedirect: process.env.NODE_ENV !== "production",
};

export default nextConfig;
