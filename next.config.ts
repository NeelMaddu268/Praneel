import type { NextConfig } from "next";

// GitHub Pages serves this project from https://<user>.github.io/Praneel/, so the
// Pages workflow sets GITHUB_PAGES=true to switch on static export + basePath.
// Without it (local dev, Vercel) the app builds as a normal root-level Next.js app.
const isGitHubPages = process.env.GITHUB_PAGES === "true";
// `||` (not `??`) so an empty value from the Pages action falls back too.
const repoName = process.env.GITHUB_PAGES_BASE_PATH || "/Praneel";

const nextConfig: NextConfig = isGitHubPages
  ? {
      output: "export",
      basePath: repoName,
      assetPrefix: `${repoName}/`,
      trailingSlash: true,
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
