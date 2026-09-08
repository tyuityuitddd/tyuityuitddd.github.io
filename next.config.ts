// This portfolio is published at https://USERNAME.github.io/.
// Keep routes at the domain root for GitHub Pages static export.
const nextConfig = {
  output: 'export' as const,
  images: { unoptimized: true },
};
export default nextConfig;
