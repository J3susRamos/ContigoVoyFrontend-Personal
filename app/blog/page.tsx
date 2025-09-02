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
    return {
      data: null,
      categoria: null,
      authors: null,
      error: "Error obteniendo blogs"
    };
  }
}

export default async function BlogPage() {
  const { data, categoria, authors, error } = await getBlogData();

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>{error}</p>
      </div>
    );
  }

  if (!data || !categoria || !authors) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No se pudieron cargar los datos</p>
      </div>
    );
  }

  return (
    <BlogPageComponentOptimized
      Datos={data.result}
      Categories={categoria.result}
      Authors={authors.result}
    />
  );
}
