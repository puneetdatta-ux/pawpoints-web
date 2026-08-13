import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Mascot gallery photos are optimized/resized by Vercel and served from its
    // CDN — Supabase only gets hit when Vercel first fetches each source image,
    // which is what keeps Storage egress inside the free-tier quota.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ohvndmcybxvahjmmjujn.supabase.co",
        pathname: "/storage/v1/object/public/mascot-gallery/**",
      },
    ],
    // Older uploads carry Supabase's default 1h cache-control; don't let that
    // force hourly refetches of images that never change.
    minimumCacheTTL: 2678400, // 31 days
  },
};

export default nextConfig;
