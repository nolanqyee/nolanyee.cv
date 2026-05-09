import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "**.spotify.com" },
            { protocol: "https", hostname: "**.youtube.com" },
            { protocol: "https", hostname: "**.ytimg.com" },
        ],
    },
    compress: true,
};

export default nextConfig;
