import type {NextConfig} from "next";

import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});


const nextConfig: NextConfig = {
 
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath: "",

  experimental: {
    optimizePackageImports: ['lucide-react', '@heroui/react'],
  },


  async generateBuildId() { 
 
    return `blog-system-${Date.now()}`;
  },

  async rewrites() {
    return [
      {
        source: '/apicontigovoy/public/api/:path*',
        destination: 'https://api.centropsicologicocontigovoy.com/api/:path*',
      },
    ];
  },
};


export default withBundleAnalyzer(nextConfig);