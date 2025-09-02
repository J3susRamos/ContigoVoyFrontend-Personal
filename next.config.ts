import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  // Habilitamos output export para generar sitio estático
  // Las rutas dinámicas funcionan con generateStaticParams
  output: "export",
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
