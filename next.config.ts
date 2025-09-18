import type {NextConfig} from "next";

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

export default nextConfig;
