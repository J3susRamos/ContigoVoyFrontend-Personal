'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import BlogIndividualView from '@/components/blog/BlogIndividualView';
import { BlogPreviewData } from '@/interface';

// Función para obtener un blog por ID o slug usando query params
async function getBlogByQuery(blogQuery: string): Promise<BlogPreviewData | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/';
    
    // Si es un número, usar la ruta optimizada para IDs
    let endpoint = '';
    if (/^\d+$/.test(blogQuery)) {
      endpoint = `${apiUrl}api/blogs/id/${blogQuery}`;
    } else {
      // Si no es un número, usar la ruta general que acepta slugs
      endpoint = `${apiUrl}api/blogs/${blogQuery}`;
    }
    
    const response = await fetch(
      endpoint,
      {
        cache: 'no-store', // Siempre obtener datos frescos
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      console.warn(`Blog ${blogQuery} not found: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    return data.result || null;
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

// Componente para cargar y mostrar el contenido del blog
function BlogContent({ blogQuery }: { blogQuery: string }) {
  const [blog, setBlog] = useState<BlogPreviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadBlog() {
      try {
        setLoading(true);
        const blogData = await getBlogByQuery(blogQuery);
        
        if (!blogData) {
          setError(true);
          return;
        }
        
        setBlog(blogData);
        
        // Actualizar metadata dinámicamente
        if (typeof window !== 'undefined') {
          document.title = `${blogData.tema} | Blog Contigo Voy`;
          
          // Actualizar meta description
          const metaDescription = document.querySelector('meta[name="description"]');
          if (metaDescription) {
            const description = blogData.contenido.replace(/<[^>]*>/g, '').substring(0, 160).trim();
            metaDescription.setAttribute('content', description + (description.length >= 160 ? '...' : ''));
          }
          
          // Actualizar Open Graph
          const ogTitle = document.querySelector('meta[property="og:title"]');
          if (ogTitle) {
            ogTitle.setAttribute('content', blogData.tema);
          }
          
          const ogDescription = document.querySelector('meta[property="og:description"]');
          if (ogDescription) {
            const description = blogData.contenido.replace(/<[^>]*>/g, '').substring(0, 200).trim();
            ogDescription.setAttribute('content', description);
          }
          
          if (blogData.imagenes?.[0] || blogData.imagen) {
            const ogImage = document.querySelector('meta[property="og:image"]');
            if (ogImage) {
              ogImage.setAttribute('content', blogData.imagenes?.[0] || blogData.imagen);
            }
          }
        }
      } catch (err) {
        console.error('Error loading blog:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (blogQuery) {
      loadBlog();
    }
  }, [blogQuery]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#634AE2] mx-auto"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
            Cargando artículo...
          </p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
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

  return <BlogIndividualView blog={blog} />;
}

// Componente para manejar los search params
function BlogParamsHandler() {
  const searchParams = useSearchParams();
  const blogQuery = searchParams.get('blog');
  
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
  
  return <BlogContent blogQuery={blogQuery} />;
}

export default function BlogPlantillaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#634AE2]"></div>
      </div>
    }>
      <BlogParamsHandler />
    </Suspense>
  );
}
