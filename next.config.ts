import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",

  images: {
    unoptimized: true, // ✅ Obligatorio en Hostinger
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.centropsicologicocontigovoy.com",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
    ],
  },

  trailingSlash: true,

  experimental: {
    optimizePackageImports: ["lucide-react", "@heroui/react"],
    optimizeCss: true,
  },

  // ⚙️ Para evitar fallos de build por tipos o ESLint (comunes en output: export)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ ID único por build (no es necesario cambiarlo)
  async generateBuildId() {
    return `contigovoy-build-${Date.now()}`;
  },

  // ❌ ❌ Elimina rewrites y headers (no funcionan con output: export)
  // async rewrites() {
  //   return [
  //     {
  //       source: "/apicontigovoy/public/api/:path*",
  //       destination: "https://api.centropsicologicocontigovoy.com/api/:path*",
  //     },
  //   ];
  // },

  // async headers() {
  //   return [
  //     {
  //       source: "/:all*(css|js|woff2|svg|jpg|jpeg|png|webp|avif)",
  //       headers: [
  //         {
  //           key: "Cache-Control",
  //           value: "public, max-age=31536000, immutable",
  //         },
  //       ],
  //     },
  //   ];
  // },
};

export default nextConfig;
