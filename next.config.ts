import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Si estás sirviendo imágenes locales y no necesitas la optimización de Next (por ejemplo, en localhost)
    unoptimized: process.env.NODE_ENV === "development",
    // Permitir dominios externos si usas imágenes desde API o CDN
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
  basePath: "",

  experimental: {
    optimizePackageImports: ["lucide-react", "@heroui/react"],
    optimizeCss: true, // ✅ Mantén esto activado: elimina CSS bloqueante
  },

  // ✅ Genera un ID único por build (mantiene versiones limpias en cache)
  async generateBuildId() {
    return `contigovoy-build-${Date.now()}`;
  },

  // ✅ Rewrites para API externa (correcto como ya lo tienes)
  async rewrites() {
    return [
      {
        source: "/apicontigovoy/public/api/:path*",
        destination: "https://api.centropsicologicocontigovoy.com/api/:path*",
      },
    ];
  },

  // ✅ Cabeceras de cacheo eficientes (mejoran “Use efficient cache lifetimes”)
  async headers() {
    return [
      {
        source: "/:all*(css|js|woff2|svg|jpg|jpeg|png|webp|avif)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:all*(json|xml|txt)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
