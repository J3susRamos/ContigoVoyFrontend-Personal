
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
    console.warn("⚠ No se pudo acceder a la API, usando rutas de fallback:", err);
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
import BlogNotFound from "@/components/blog/BlogNotFound";
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

    const cacheConfig =
      process.env.NODE_ENV === "development"
        ? { cache: "no-store" as const }
        : { next: { revalidate: 3600 } };

    // Estrategia 1: Intentar buscar por slug usando el endpoint específico
    try {
      console.log("🔍 [getBlogByQuery] Estrategia 1: Buscando por slug...");
      const slugEndpoint = `${apiUrl}api/blogs/slug/${encodeURIComponent(blogQuery)}`;
      console.log("🔍 [getBlogByQuery] Slug endpoint:", slugEndpoint);

      const slugResponse = await fetch(slugEndpoint, {
        ...cacheConfig,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (slugResponse.ok) {
        const slugData = await slugResponse.json();
        console.log("✅ [getBlogByQuery] Encontrado por slug!");
        return slugData.result || null;
      } else {
        console.log("🔍 [getBlogByQuery] No encontrado por slug, continuando...");
      }
    } catch (slugError) {
      console.log("🔍 [getBlogByQuery] Error en búsqueda por slug, continuando...", slugError);
    }

    // Estrategia 2: Si es un número, usar búsqueda por ID
    if (/^\d+$/.test(blogQuery)) {
      try {
        console.log("🔍 [getBlogByQuery] Estrategia 2: Buscando por ID...");
        const idEndpoint = `${apiUrl}api/blogs/${blogQuery}`;
        console.log("🔍 [getBlogByQuery] ID endpoint:", idEndpoint);

        const idResponse = await fetch(idEndpoint, {
          ...cacheConfig,
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (idResponse.ok) {
          const idData = await idResponse.json();
          console.log("✅ [getBlogByQuery] Encontrado por ID!");
          return idData.result || null;
        } else {
          console.log("🔍 [getBlogByQuery] No encontrado por ID, continuando...");
        }
      } catch (idError) {
        console.log("🔍 [getBlogByQuery] Error en búsqueda por ID, continuando...", idError);
      }
    }

    // Estrategia 3: Buscar por tema exacto (URL decodificada)
    try {
      console.log("🔍 [getBlogByQuery] Estrategia 3: Buscando por tema exacto...");
      let searchTerm = decodeURIComponent(blogQuery);
      console.log("🔍 [getBlogByQuery] Tema exacto:", searchTerm);

      const temaEndpoint = `${apiUrl}api/blogs/tema/${encodeURIComponent(searchTerm)}`;
      console.log("🔍 [getBlogByQuery] Tema endpoint:", temaEndpoint);

      const temaResponse = await fetch(temaEndpoint, {
        next: { revalidate: 3600 }, // Cache por 1 hora
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (temaResponse.ok) {
        const temaData = await temaResponse.json();
        console.log("✅ [getBlogByQuery] Encontrado por tema exacto!");
        return temaData.result || null;
      } else {
        console.log(`🔍 [getBlogByQuery] No encontrado por tema exacto (${temaResponse.status}), continuando...`);
      }
    } catch (temaError) {
      console.log("🔍 [getBlogByQuery] Error en búsqueda por tema exacto, continuando...", temaError);
    }

    // Estrategia 4: Buscar convirtiendo guiones a espacios y variaciones
    if (blogQuery.includes("-")) {
      const variations = [
        blogQuery.replace(/-/g, " "),                    // guiones a espacios
        blogQuery.replace(/-/g, " ").replace(/\s+/g, " "), // normalizar espacios
        blogQuery.replace(/-/g, " ").toLowerCase(),       // minúsculas
      ];

      for (const [index, searchTerm] of variations.entries()) {
        try {
          console.log(`🔍 [getBlogByQuery] Estrategia 4.${index + 1}: "${searchTerm}"`);

          const espaciosEndpoint = `${apiUrl}api/blogs/tema/${encodeURIComponent(searchTerm)}`;

          const espaciosResponse = await fetch(espaciosEndpoint, {
            next: { revalidate: 3600 }, // Cache por 1 hora
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (espaciosResponse.ok) {
            const espaciosData = await espaciosResponse.json();
            console.log(`✅ [getBlogByQuery] Encontrado con variación 4.${index + 1}!`);
            return espaciosData.result || null;
          } else {
            console.log(`🔍 [getBlogByQuery] Variación 4.${index + 1} no encontrada (${espaciosResponse.status})`);
          }
        } catch (espaciosError) {
          console.log(`🔍 [getBlogByQuery] Error en variación 4.${index + 1}:`, espaciosError);
        }
      }

      console.log("🔍 [getBlogByQuery] Ninguna variación de espacios funcionó, continuando...");
    }

    // Estrategia 5: Búsqueda general en todos los blogs (fallback)
    try {
      console.log("🔍 [getBlogByQuery] Estrategia 5: Búsqueda general (fallback)...");
      const allBlogsEndpoint = `${apiUrl}api/blogs`;
      console.log("🔍 [getBlogByQuery] All blogs endpoint:", allBlogsEndpoint);

      const allBlogsResponse = await fetch(allBlogsEndpoint, {
        // Cache por 1 hora para permitir generación estática
        next: { revalidate: 3600 },
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (allBlogsResponse.ok) {
        const allBlogsData = await allBlogsResponse.json();
        console.log("🔍 [getBlogByQuery] Blogs obtenidos para búsqueda general:", allBlogsData.result?.length || 0);

        if (allBlogsData.result && Array.isArray(allBlogsData.result)) {
          // Función para normalizar texto
          const normalizeText = (text: string) => {
            return text
              .toLowerCase()
              .replace(/[áéíóúñü]/g, (match) => {
                const replacements: { [key: string]: string } = {
                  'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'n', 'ü': 'u'
                };
                return replacements[match] || match;
              })
              .replace(/[^\w\s]/g, ' ')
              .replace(/\s+/g, ' ')
              .trim();
          };

          const normalizedQuery = normalizeText(blogQuery.replace(/-/g, ' '));
          console.log("🔍 [getBlogByQuery] Query normalizado para búsqueda:", normalizedQuery);

          // Buscar coincidencia por tema, slug o contenido similar
          const matchingBlog = allBlogsData.result.find((blog: any) => {
            const tema = normalizeText(blog.tema || "");
            const slug = normalizeText(blog.slug || "");
            const categoria = normalizeText(blog.categoria || "");

            // Múltiples estrategias de coincidencia mejoradas
            const exactMatch = tema === normalizedQuery || slug === normalizedQuery;
            const containsMatch = tema.includes(normalizedQuery) || normalizedQuery.includes(tema);

            // Coincidencia por slug original (sin normalizar para casos específicos)
            const originalSlugMatch = (blog.slug || "").toLowerCase() === blogQuery.toLowerCase();

            // Coincidencia de palabras clave (mínimo 70% de coincidencia)
            const queryWords = normalizedQuery.split(' ').filter(word => word.length > 3);
            const matchingWords = queryWords.filter(word => tema.includes(word));
            const wordMatchScore = queryWords.length > 0 ? (matchingWords.length / queryWords.length) : 0;
            const wordsMatch = wordMatchScore >= 0.7;

            const isMatch = exactMatch || containsMatch || originalSlugMatch || wordsMatch;

            if (isMatch) {
              console.log(`🎯 [getBlogByQuery] Coincidencia encontrada: "${blog.tema}" con query "${blogQuery}"`);
              console.log(`   - Slug del blog: "${blog.slug}"`);
              console.log(`   - Tipo de coincidencia: ${exactMatch ? 'exact' : containsMatch ? 'contains' : originalSlugMatch ? 'originalSlug' : 'words'}`);
            }

            return isMatch;
          });

          if (matchingBlog) {
            console.log("✅ [getBlogByQuery] Encontrado en búsqueda general!");
            return matchingBlog;
          } else {
            console.log("🔍 [getBlogByQuery] No se encontró coincidencia en", allBlogsData.result.length, "blogs disponibles");
            // Log de algunos blogs disponibles para debug
            console.log("🔍 [getBlogByQuery] Primeros 5 blogs disponibles:");
            allBlogsData.result.slice(0, 5).forEach((blog: any, index: number) => {
              console.log(`  ${index + 1}. "${blog.tema}"`);
              console.log(`     Slug: "${blog.slug}"`);
            });
          }
        }
      } else {
        console.log("❌ [getBlogByQuery] Error en endpoint de todos los blogs:", allBlogsResponse.status);
      }
    } catch (fallbackError) {
      console.log("🔍 [getBlogByQuery] Error en búsqueda general:", fallbackError);
    }

    // Si llegamos aquí, no se encontró nada
    console.warn(`❌ [getBlogByQuery] Blog "${blogQuery}" not found después de todas las estrategias`);
    return null;

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
      <BlogNotFound
        searchQuery={blogQuery}
        apiUrl={process.env.NEXT_PUBLIC_API_URL}
      />
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
