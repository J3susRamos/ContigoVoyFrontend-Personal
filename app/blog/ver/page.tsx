import { Metadata } from 'next';
import Link from 'next/link';
import BlogIndividualView from '@/components/blog/BlogIndividualView';
import BlogStructuredData from '@/components/blog/BlogStructuredData';
import { BlogPreviewData } from '@/interface';

// Función para obtener un blog por tema (Server-side)
async function getBlogByQuery(blogQuery: string): Promise<BlogPreviewData | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/';
    
    // Convertir el slug de vuelta a un término de búsqueda
    const searchTerm = blogQuery.includes('-') 
      ? blogQuery.replace(/-/g, ' ') 
      : decodeURIComponent(blogQuery);
    
    const endpoint = `${apiUrl}api/blogs/tema/${encodeURIComponent(searchTerm)}`;
    
    const response = await fetch(endpoint, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.warn(`Blog "${searchTerm}" not found: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    return data.result || null;
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

// Generar metadata dinámica para cada blog
export async function generateMetadata(
  { searchParams }: { searchParams: Promise<{ blog?: string }> }
): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const blogQuery = resolvedSearchParams.blog;
  
  if (!blogQuery) {
    return {
      title: 'Blog no encontrado | Centro Psicológico Contigo Voy',
      description: 'El artículo solicitado no fue encontrado.',
    };
  }

  const blog = await getBlogByQuery(blogQuery);
  
  if (!blog) {
    return {
      title: 'Artículo no encontrado | Centro Psicológico Contigo Voy',
      description: 'El artículo que buscas no existe o ha sido movido.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  // Crear descripción limpia del contenido
  const cleanContent = blog.contenido
    .replace(/<[^>]*>/g, '') // Remover HTML
    .replace(/\s+/g, ' ') // Normalizar espacios
    .trim();
  
  // Si el contenido es muy corto o repetitivo, crear una descripción alternativa
  let description = '';
  
  if (cleanContent.length < 50 || isRepetitive(cleanContent)) {
    // Crear descripción basada en el título y categoría
    description = `Descubre todo sobre ${blog.tema.toLowerCase()} en nuestro blog especializado en ${blog.categoria.toLowerCase()}. Artículo escrito por ${blog.psicologo} ${blog.psicologApellido}, especialista en psicología y bienestar mental.`;
  } else {
    // Usar el contenido real pero limitado
    description = cleanContent.substring(0, 160).trim();
    if (cleanContent.length > 160) {
      description += '...';
    }
  }

  // Función auxiliar para detectar contenido repetitivo
  function isRepetitive(text: string): boolean {
    const words = text.split(' ');
    if (words.length < 10) return true;
    
    const firstHalf = words.slice(0, Math.floor(words.length / 2)).join(' ');
    const secondHalf = words.slice(Math.floor(words.length / 2)).join(' ');
    
    return firstHalf === secondHalf || text.includes(text.substring(0, 30).repeat(2));
  }
  
  // Crear slug para la URL canónica
  const slug = blog.tema
    .toLowerCase()
    .replace(/[áéíóúñ]/g, (match) => {
      const replacements: { [key: string]: string } = {
        'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'n'
      };
      return replacements[match] || match;
    })
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

  return {
    title: `${blog.tema} | Blog Contigo Voy`,
    description: description,
    authors: [{ 
      name: `${blog.psicologo} ${blog.psicologApellido}` 
    }],
    keywords: [
      blog.categoria,
      'psicología',
      'salud mental',
      'bienestar',
      'terapia',
      ...blog.tema.split(' ').filter(word => word.length > 3)
    ],
    alternates: {
      canonical: `https://centropsicologicocontigovoy.com/blog/ver?blog=${encodeURIComponent(slug)}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: 'article',
      siteName: 'Centro Psicológico Contigo Voy',
      title: blog.tema,
      description: description,
      url: `https://centropsicologicocontigovoy.com/blog/ver?blog=${encodeURIComponent(slug)}`,
      images: blog.imagenes?.[0] || blog.imagen ? [{
        url: blog.imagenes?.[0] || blog.imagen,
        alt: `Imagen del artículo: ${blog.tema}`,
        width: 1200,
        height: 630,
      }] : undefined,
      authors: [`${blog.psicologo} ${blog.psicologApellido}`],
      publishedTime: blog.fecha,
      tags: [blog.categoria, 'psicología', 'salud mental'],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.tema,
      description: description,
      images: blog.imagenes?.[0] || blog.imagen ? [blog.imagenes?.[0] || blog.imagen] : undefined,
    },
    other: {
      'article:author': `${blog.psicologo} ${blog.psicologApellido}`,
      'article:published_time': blog.fecha,
      'article:section': blog.categoria,
      'article:tag': blog.categoria,
    },
  };
}

export default async function BlogViewerPage({
  searchParams,
}: {
  searchParams: Promise<{ blog?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const blogQuery = resolvedSearchParams.blog;
  
  if (!blogQuery) {
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
  
  const blog = await getBlogByQuery(blogQuery);
  
  if (!blog) {
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

  return (
    <>
      <BlogStructuredData blog={blog} />
      <BlogIndividualView blog={blog} />
    </>
  );
}