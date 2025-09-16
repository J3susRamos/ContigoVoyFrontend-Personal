import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  // Quitamos output export para permitir funcionalidad dinámica
  // Ahora podemos usar query parameters y server-side rendering
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath: "",
  // Configuración para optimizar las rutas de blog
  experimental: {
    optimizePackageImports: ['lucide-react', '@heroui/react'],
  },
  // Configuración específica para el sistema de blogs
  async generateBuildId() {
    // Generar ID único para cada build que incluya blogs
    return `blog-system-${Date.now()}`;
  },
};

export default nextConfig;
