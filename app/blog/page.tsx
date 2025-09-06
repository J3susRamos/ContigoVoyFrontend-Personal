import {
  BlogsWebSite,
  GetBlogsPreviewApi,
  GetCagetories,
} from "@/app/apiRoutes";
import BlogPageComponentOptimized from "@/components/blog/BlogPageComponentOptimized";

// Obtener datos durante el build (Server Component)
async function getBlogData() {
  try {
    // Durante el build, si no hay servidor disponible, devolver datos vacíos
    const isBuilding = process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL;

    if (isBuilding) {
      return {
        data: { result: [] },
        categoria: { result: [] },
        authors: { result: [] },
        error: null
      };
    }

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

    // Durante el build, devolver datos vacíos en lugar de error
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