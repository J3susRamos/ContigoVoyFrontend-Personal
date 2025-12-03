
export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/blogs`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error("Fallo al obtener blogs");
    const data = await res.json();
    const items = Array.isArray(data?.result) ? data.result : [];
    if (!items.length) throw new Error("Lista de blogs vacía");
    return items.map((b: { slug?: string; tema: string }) => ({ blog: encodeURIComponent(b.slug ?? b.tema) }));
  } catch (err) {
    console.warn("⚠ No se pudo acceder a la API, usando rutas de fallback "+err);
    return [
      { blog: encodeURIComponent("bienestar-emocional") },
      { blog: encodeURIComponent("autoestima-y-confianza") },
    ];
  }
}
// cambio

import Link from "next/link";
import BlogIndividualView from "@/components/blog/BlogIndividualView";
import BlogStructuredData from "@/components/blog/BlogStructuredData";
import { BlogPreviewData } from "@/interface";

async function getBlogByQuery(
  blogQuery: string,
): Promise<BlogPreviewData | null> {
  console.log("🔍 [getBlogByQuery] Iniciando búsqueda de blog...");
  console.log("🔍 [getBlogByQuery] Blog query recibido:", blogQuery);
  console.log("🔍 [getBlogByQuery] NODE_ENV:", process.env.NODE_ENV);
  console.log(
    "🔍 [getBlogByQuery] NEXT_PUBLIC_API_URL:",
    process.env.NEXT_PUBLIC_API_URL,
  );

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/";

    // Intentar primero con el query tal como viene (podría ser URL-encoded)
    let searchTerm = decodeURIComponent(blogQuery);
    console.log("🔍 [getBlogByQuery] Primer intento con query decodificado:", searchTerm);

    let endpoint = `${apiUrl}api/blogs/tema/${encodeURIComponent(searchTerm)}`;
    console.log("🔍 [getBlogByQuery] Endpoint original:", endpoint);

    const cacheConfig =
      process.env.NODE_ENV === "development"
        ? { cache: "no-store" as const }
        : { next: { revalidate: 3600 } };

    let response = await fetch(endpoint, {
      ...cacheConfig,
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("🔍 [getBlogByQuery] Response status:", response.status);
    console.log("🔍 [getBlogByQuery] Response ok:", response.ok);

    // Si el primer intento falla y hay guiones, intentar convirtiendo guiones a espacios
    if (!response.ok && blogQuery.includes("-")) {
      console.log("🔍 [getBlogByQuery] Primer intento falló, probando con guiones convertidos a espacios");
      searchTerm = blogQuery.replace(/-/g, " ");
      endpoint = `${apiUrl}api/blogs/tema/${encodeURIComponent(searchTerm)}`;
      console.log("🔍 [getBlogByQuery] Segundo intento con searchTerm:", searchTerm);
      console.log("🔍 [getBlogByQuery] Segundo endpoint:", endpoint);
      
      response = await fetch(endpoint, {
        ...cacheConfig,
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      console.log("🔍 [getBlogByQuery] Segundo intento - Response status:", response.status);
    }

    console.log(
      "🔍 [getBlogByQuery] Response headers:",
      Object.fromEntries(response.headers.entries()),
    );
    console.log("🔍 [getBlogByQuery] Response URL:", response.url);

    if (!response.ok) {
      console.warn(
        `❌ [getBlogByQuery] Blog "${searchTerm}" not found: ${response.status}`,
      );
      console.warn(
        `❌ [getBlogByQuery] Response status text:`,
        response.statusText,
      );

      try {
        const errorBody = await response.text();
        console.warn(`❌ [getBlogByQuery] Error response body:`, errorBody);
      } catch (bodyError) {
        console.warn(
          `❌ [getBlogByQuery] No se pudo leer el body del error:`,
          bodyError,
        );
      }

      return null;
    }

    const data = await response.json();
    console.log("✅ [getBlogByQuery] Datos obtenidos exitosamente:");
    console.log(
      "✅ [getBlogByQuery] Data structure:",
      JSON.stringify(data, null, 2),
    );
    console.log("✅ [getBlogByQuery] Data.result exists:", !!data.result);
    console.log("✅ [getBlogByQuery] Data.result type:", typeof data.result);

    return data.result || null;
  } catch (error) {
    console.error("❌ [getBlogByQuery] Error completo al obtener blog:", error);
    console.error(
      "❌ [getBlogByQuery] Error message:",
      (error as Error).message,
    );
    console.error("❌ [getBlogByQuery] Error stack:", (error as Error).stack);
    console.error("❌ [getBlogByQuery] Error name:", (error as Error).name);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      console.error(
        "❌ [getBlogByQuery] Posible problema de conectividad o CORS",
      );
      console.error(
        "❌ [getBlogByQuery] Verificar que la URL del API sea accesible:",
        process.env.NEXT_PUBLIC_API_URL,
      );
    }

    return null;
  }
}


export async function generateMetadata({ params }: { params: { blog: string } }) {
  const blogQuery = params.blog;

  if (!blogQuery) {
    return {
      title: "Blog no encontrado | Centro Psicológico Contigo Voy",
      description: "El artículo solicitado no fue encontrado.",
    };
  }

  const blog = await getBlogByQuery(blogQuery);

  if (!blog) {
    return {
      title: "Artículo no encontrado | Centro Psicológico Contigo Voy",
      description: "El artículo que buscas no existe o ha sido movido.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const cleanContent = blog.contenido
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

  let description = "";

  if (cleanContent.length < 50 || isRepetitive(cleanContent)) {
    description = `Descubre todo sobre ${blog.tema.toLowerCase()} en nuestro blog especializado en ${blog.categoria.toLowerCase()}. Artículo escrito por ${blog.psicologo} ${blog.psicologApellido}, especialista en psicología y bienestar mental.`;
  } else {
    description = cleanContent.substring(0, 160).trim();
    if (cleanContent.length > 160) {
      description += "...";
    }
  }

  function isRepetitive(text: string): boolean {
    const words = text.split(" ");
    if (words.length < 10) return true;

    const firstHalf = words.slice(0, Math.floor(words.length / 2)).join(" ");
    const secondHalf = words.slice(Math.floor(words.length / 2)).join(" ");

    return (
      firstHalf === secondHalf || text.includes(text.substring(0, 30).repeat(2))
    );
  }

  const rawSlug = blog.slug ?? blog.tema;
  const slug = encodeURIComponent(rawSlug);

  return {
    title: `${blog.tema} | Blog Contigo Voy`,
    description: description,
    authors: [
      {
        name: `${blog.psicologo} ${blog.psicologApellido}`,
      },
    ],
    keywords: [
      blog.categoria,
      "psicología",
      "salud mental",
      "bienestar",
      "terapia",
      ...blog.tema.split(" ").filter((word) => word.length > 3),
    ],
    alternates: {
      canonical: `https://centropsicologicocontigovoy.com/blog/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "article",
      siteName: "Centro Psicológico Contigo Voy",
      title: blog.tema,
      description: description,
      url: `https://centropsicologicocontigovoy.com/blog/${slug}`,
      images:
        blog.imagenes?.[0] || blog.imagen
          ? [
              {
                url: blog.imagenes?.[0] || blog.imagen,
                alt: `Imagen del artículo: ${blog.tema}`,
                width: 1200,
                height: 630,
              },
            ]
          : undefined,
      authors: [`${blog.psicologo} ${blog.psicologApellido}`],
      publishedTime: blog.fecha,
      tags: [blog.categoria, "psicología", "salud mental"],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.tema,
      description: description,
      images:
        blog.imagenes?.[0] || blog.imagen
          ? [blog.imagenes?.[0] || blog.imagen]
          : undefined,
    },
    other: {
      "article:author": `${blog.psicologo} ${blog.psicologApellido}`,
      "article:published_time": blog.fecha,
      "article:section": blog.categoria,
      "article:tag": blog.categoria,
    },
  };
}

export default async function BlogViewerPage({
  params,
}: {
  params: { blog: string };
}) {
  console.log(
    "🔍 [BlogViewerPage] Iniciando renderizado de página de blog individual...",
  );
  console.log("🔍 [BlogViewerPage] NODE_ENV:", process.env.NODE_ENV);
  console.log("🔍 [BlogViewerPage] VERCEL_ENV:", process.env.VERCEL_ENV);
  console.log("🔍 [BlogViewerPage] VERCEL_URL:", process.env.VERCEL_URL);

  const blogQuery = params.blog;

  console.log("🔍 [BlogViewerPage] Blog query extraído:", blogQuery);

  if (!blogQuery) {
    console.warn(
      "⚠️ [BlogViewerPage] No se proporcionó parámetro blog, mostrando página de error",
    );
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center space-y-6 max-w-md px-6">
          <div className="text-6xl">❓</div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Parámetro de blog requerido
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            No se especificó qué artículo mostrar.
          </p>
          <Link
            href="/blog"
            className="inline-block px-6 py-3 bg-gradient-to-r from-[#634AE2] to-[#8b7cf6] text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
          >
            Volver al Blog
          </Link>
        </div>
      </div>
    );
  }

  console.log("🔍 [BlogViewerPage] Llamando a getBlogByQuery con:", blogQuery);
  const blog = await getBlogByQuery(blogQuery);

  if (!blog) {
    console.error(
      "❌ [BlogViewerPage] No se encontró el blog, mostrando página de error 404",
    );
    console.error("❌ [BlogViewerPage] Blog query que falló:", blogQuery);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center space-y-6 max-w-md px-6">
          <div className="text-6xl">😕</div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Artículo no encontrado
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            El artículo que buscas no existe o ha sido movido.
          </p>
          <Link
            href="/blog"
            className="inline-block px-6 py-3 bg-gradient-to-r from-[#634AE2] to-[#8b7cf6] text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
          >
            Volver al Blog
          </Link>
        </div>
      </div>
    );
  }

  console.log("✅ [BlogViewerPage] Blog encontrado exitosamente:", {
    tema: blog.tema,
    categoria: blog.categoria,
    psicologo: `${blog.psicologo} ${blog.psicologApellido}`,
    fecha: blog.fecha,
  });

  console.log(
    "🔍 [BlogViewerPage] Renderizando componentes BlogStructuredData y BlogIndividualView",
  );

  return (
    <>
      <BlogStructuredData blog={blog} />
      <BlogIndividualView blog={blog} />
    </>
  );
}
