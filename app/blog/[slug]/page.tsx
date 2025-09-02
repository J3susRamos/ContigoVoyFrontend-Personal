import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogIndividualView from '@/components/blog/BlogIndividualView';
import { BlogPreviewData } from '@/interface';

// Función para obtener un blog específico
async function getBlog(slug: string): Promise<BlogPreviewData | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/';
    const response = await fetch(
      `${apiUrl}api/blogs/${slug}`,
      {
        cache: 'force-cache', // Usar cache forzado para generación estática
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      console.warn(`Blog ${slug} not found: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    return data.result || null;
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

// Generar metadata dinámicamente para cada blog
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);
  
  if (!blog) {
    return {
      title: 'Blog no encontrado',
    };
  }
  
  const publishedTime = new Date(blog.fecha).toISOString();
  const imageUrl = blog.imagenes?.[0] || blog.imagen;
  
  return {
    title: `${blog.tema} | Blog Contigo Voy`,
    description: blog.contenido.replace(/<[^>]*>/g, '').substring(0, 160) + '...',
    authors: [{ name: `${blog.psicologo} ${blog.psicologApellido}` }],
    keywords: [blog.categoria, 'psicología', 'salud mental', 'bienestar'],
    openGraph: {
      title: blog.tema,
      description: blog.contenido.replace(/<[^>]*>/g, '').substring(0, 200),
      type: 'article',
      publishedTime,
      authors: [`${blog.psicologo} ${blog.psicologApellido}`],
      images: imageUrl ? [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: blog.tema,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.tema,
      description: blog.contenido.replace(/<[^>]*>/g, '').substring(0, 200),
      images: imageUrl ? [imageUrl] : [],
    },
    alternates: {
      canonical: `https://centropsicologicocontigovoy.com/blog/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  
  if (!blog) {
    notFound();
  }
  
  return <BlogIndividualView blog={blog} />;
}

// Generar páginas estáticas en build time para todos los blogs
export async function generateStaticParams() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/';
    console.log('Fetching blogs for static generation from:', apiUrl);
    
    const response = await fetch(
      `${apiUrl}api/blogs`,
      {
        cache: 'force-cache', // Forzar cache para build time
      }
    );
    
    if (!response.ok) {
      console.warn('Failed to fetch blogs for static generation, status:', response.status);
      return [];
    }
    
    const data = await response.json();
    const blogs: BlogPreviewData[] = data.result || [];
    
    console.log(`Generating static params for ${blogs.length} blogs`);
    
    // Generar slugs para todos los blogs usando el campo idBlog
    return blogs.map((blog) => ({
      slug: blog.idBlog.toString(),
    })).filter(item => item.slug !== '');
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}
