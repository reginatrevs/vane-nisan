import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 treats this as an allowlist and defaults to [75]. The artwork is
    // large, detailed and full-bleed, so 75 visibly softens the calligraphy.
    qualities: [75, 90],
  },
};

export default nextConfig;
