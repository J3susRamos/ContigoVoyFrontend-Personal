/**
 * Utilidades para la gestión de blogs
 */

export interface BlogDiagnostic {
  availableBlogs: Array<{
    id: number;
    tema: string;
    slug?: string;
    categoria?: string;
  }>;
  totalCount: number;
  searchSuggestions: string[];
}

/**
 * Función de diagnóstico para entender qué blogs están disponibles
 */
export async function diagnoseBlogAPI(apiUrl: string): Promise<BlogDiagnostic | null> {
  try {
    console.log('🔍 [diagnoseBlogAPI] Diagnosticando API de blogs...');

    const response = await fetch(`${apiUrl}api/blogs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('❌ [diagnoseBlogAPI] Error al obtener blogs:', response.status);
      return null;
    }

    const data = await response.json();

    if (!data.result || !Array.isArray(data.result)) {
      console.error('❌ [diagnoseBlogAPI] Formato de respuesta inválido');
      return null;
    }

    const blogs = data.result;
    console.log('✅ [diagnoseBlogAPI] Blogs disponibles:', blogs.length);

    // Crear sugerencias de búsqueda basadas en los temas disponibles
    const searchSuggestions = blogs.map((blog: any) => {
      const tema = blog.tema || '';
      return {
        original: tema,
        slug: tema
          .toLowerCase()
          .replace(/[áéíóúñü]/g, (match: string) => {
            const replacements: { [key: string]: string } = {
              'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'n', 'ü': 'u'
            };
            return replacements[match] || match;
          })
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, ''),
        withSpaces: tema.toLowerCase()
      };
    });

    // Log de información de diagnóstico
    console.log('📊 [diagnoseBlogAPI] Diagnóstico completo:');
    blogs.forEach((blog: any, index: number) => {
      console.log(`  ${index + 1}. "${blog.tema}" (ID: ${blog.id})`);
      if (blog.slug) console.log(`     Slug: ${blog.slug}`);
      if (blog.categoria) console.log(`     Categoría: ${blog.categoria}`);
    });

    return {
      availableBlogs: blogs.map((blog: any) => ({
        id: blog.id,
        tema: blog.tema,
        slug: blog.slug,
        categoria: blog.categoria
      })),
      totalCount: blogs.length,
      searchSuggestions: searchSuggestions.map((s: { slug: any; }) => s.slug)
    };

  } catch (error) {
    console.error('❌ [diagnoseBlogAPI] Error en diagnóstico:', error);
    return null;
  }
}

/**
 * Función para sugerir blogs similares cuando uno no se encuentra
 */
export function suggestSimilarBlogs(
  searchQuery: string,
  availableBlogs: Array<{ tema: string; slug?: string }>
): string[] {
  const query = searchQuery.toLowerCase().replace(/-/g, ' ');

  const suggestions = availableBlogs
    .filter(blog => {
      const tema = blog.tema.toLowerCase();
      const slug = blog.slug?.toLowerCase() || '';

      return (
        tema.includes(query) ||
        query.includes(tema) ||
        slug.includes(searchQuery) ||
        // Búsqueda por palabras clave
        query.split(' ').some(word =>
          word.length > 3 && (tema.includes(word) || slug.includes(word))
        )
      );
    })
    .map(blog => blog.slug || blog.tema)
    .slice(0, 5); // Máximo 5 sugerencias

  return suggestions;
}