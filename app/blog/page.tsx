import {
  BlogsWebSite,
  GetBlogsPreviewApi,
  GetCagetories,
} from "@/app/apiRoutes";
import BlogPageComponentOptimized from "@/components/blog/BlogPageComponentOptimized";

// Obtener datos durante el build (Server Component)
async function getBlogData() {
  try {
    const [dato, category, author] = await Promise.all([
      BlogsWebSite(),
      GetCagetories(),
      GetBlogsPreviewApi()
    ]);
    
    return {
      data: dato,
      categoria: category,
      authors: author,
      error: null
    };
  } catch (error) {
    console.error("Error fetching blog data:", error);
    
    // En caso de error, devolver estructuras vacías pero válidas
    return {
      data: { result: [] },
      categoria: { result: [] },
      authors: { result: [] },
      error: null
    };
  }
}

export default async function BlogPage() {
  const { data, categoria, authors } = await getBlogData();

  // Siempre renderizar el componente, incluso con datos vacíos
  return (
    <BlogPageComponentOptimized
      Datos={data?.result || []}
      Categories={categoria?.result || []}
      Authors={authors?.result || []}
    />
  );
}
