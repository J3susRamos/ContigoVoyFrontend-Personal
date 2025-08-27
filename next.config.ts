import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  // Removemos output: "export" para permitir rutas dinámicas
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath: "",
  // Configuración para optimizar las rutas de blog
  experimental: {
    optimizePackageImports: ['lucide-react', '@heroui/react'],
  },
};

export default nextConfig;
