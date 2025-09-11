import {
  BlogsWebSite,
  GetBlogsPreviewApi,
  GetCagetories,
} from "@/app/apiRoutes";
import BlogPageComponentOptimized from "@/components/blog/BlogPageComponentOptimized";

// Obtener datos durante el build (Server Component)
async function getBlogData() {
  console.log('🔍 [getBlogData] Iniciando obtención de datos de blog...');
  console.log('🔍 [getBlogData] NODE_ENV:', process.env.NODE_ENV);
  console.log('🔍 [getBlogData] VERCEL_URL:', process.env.VERCEL_URL);
  console.log('🔍 [getBlogData] NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
  
  try {
    // Durante el build, si no hay servidor disponible, devolver datos vacíos
    const isBuilding = process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL;
    console.log('🔍 [getBlogData] isBuilding:', isBuilding);

    if (isBuilding) {
      console.log('⚠️ [getBlogData] En modo building, devolviendo datos vacíos');
      return {
        data: { result: [] },
        categoria: { result: [] },
        authors: { result: [] },
        error: null
      };
    }

    console.log('🔍 [getBlogData] Ejecutando llamadas a las APIs...');
    
    const [dato, category, author] = await Promise.all([
      BlogsWebSite(),
      GetCagetories(),
      GetBlogsPreviewApi()
    ]);

    console.log('✅ [getBlogData] Datos obtenidos exitosamente:');
    console.log('  - Blogs:', dato?.result?.length || 0, 'artículos');
    console.log('  - Categorías:', category?.result?.length || 0, 'categorías');
    console.log('  - Autores:', author?.result?.length || 0, 'autores');

    return {
      data: dato,
      categoria: category,
      authors: author,
      error: null
    };
  } catch (error) {
    console.error("❌ [getBlogData] Error completo:", error);
    console.error("❌ [getBlogData] Error mensaje:", (error as Error).message);
    console.error("❌ [getBlogData] Error stack:", (error as Error).stack);
    
    // En caso de error, devolver estructuras vacías pero válidas
    return {
      data: { result: [] },
      categoria: { result: [] },
      authors: { result: [] },
      error: (error as Error).message
    };
  }
}

export default async function BlogPage() {
  console.log('🔍 [BlogPage] Renderizando página de blog...');
  
  const { data, categoria, authors, error } = await getBlogData();

  console.log('🔍 [BlogPage] Datos finales para renderizar:');
  console.log('  - Blogs data:', data);
  console.log('  - Categorías data:', categoria);
  console.log('  - Autores data:', authors);
  console.log('  - Error:', error);
  console.log('  - Blogs length:', data?.result?.length);
  console.log('  - Categorías length:', categoria?.result?.length);
  console.log('  - Autores length:', authors?.result?.length);

  // Mostrar error en los logs si existe
  if (error) {
    console.error('❌ [BlogPage] Error en los datos:', error);
  }

  // Siempre renderizar el componente, incluso con datos vacíos
  return (
    <BlogPageComponentOptimized
      Datos={data?.result || []}
      Categories={categoria?.result || []}
      Authors={authors?.result || []}
    />
  );
}