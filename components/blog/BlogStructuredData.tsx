import { BlogPreviewData } from '@/interface';

interface BlogStructuredDataProps {
  blog: BlogPreviewData;
  baseUrl?: string;
}

export default function BlogStructuredData({ 
  blog, 
  baseUrl = 'https://centropsicologicocontigovoy.com' 
}: BlogStructuredDataProps) {
  // Crear slug para la URL (preferir slug de API si existe)
  const rawSlug = blog.slug ?? blog.tema;
  const slug = encodeURIComponent(rawSlug);

  const articleUrl = `${baseUrl}/blog/${slug}`;
  
  // Limpiar contenido para la descripción
  const cleanDescription = blog.contenido
    .replace(/<[^>]*>/g, '')
    .substring(0, 200)
    .trim();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blog.tema,
    "description": cleanDescription,
    "image": blog.imagenes?.[0] || blog.imagen,
    "author": {
      "@type": "Person",
      "name": `${blog.psicologo} ${blog.psicologApellido}`,
      "image": blog.psicologoImagenId,
      "jobTitle": "Psicólogo",
      "worksFor": {
        "@type": "Organization",
        "name": "Centro Psicológico Contigo Voy"
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": "Centro Psicológico Contigo Voy",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    },
    "datePublished": blog.fecha,
    "dateModified": blog.fecha,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleUrl
    },
    "url": articleUrl,
    "articleSection": blog.categoria,
    "keywords": [
      blog.categoria,
      "psicología",
      "salud mental",
      "bienestar",
      "terapia"
    ],
    "about": {
      "@type": "Thing",
      "name": blog.categoria
    },
    "isPartOf": {
      "@type": "WebSite",
      "name": "Centro Psicológico Contigo Voy",
      "url": baseUrl
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
}
