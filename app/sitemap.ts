import { MetadataRoute } from 'next';
import { createSlug } from '@/utils/slugUtils';

export const dynamic = "force-static";

interface BlogFromAPI {
  id: number;
  tema: string;
  slug: string;
  fecha_publicado: string;
}

interface BlogForSitemap {
  tema: string;
  fecha: string;
  slug: string;
}

async function getBlogs(): Promise<BlogForSitemap[]> {
  const API_BASE_URL = 'https://api.centropsicologicocontigovoy.com';
  const API_ENDPOINT = `${API_BASE_URL}/api/blogs/all`;

  try {
    const response = await fetch(API_ENDPOINT, {});

    if (!response.ok) {
      console.error(`${response.status} - ${response.statusText}`);
      const errorBody = await response.text();
      console.error(`${errorBody.substring(0, 200)}...`);
      return [];
    }

    const rawJsonText = await response.text();

    let result: any;
    try {
      result = JSON.parse(rawJsonText);
    } catch (e) {
      console.error("no es un JSON válido.");
      return [];
    }

    if (!result || !result.result || !Array.isArray(result.result)) {
      console.error("ERROR DE FORMATO JSON.");
      return [];
    }

    const apiBlogs = result.result;

    if (apiBlogs.length === 0) {
      console.error("La API retornó 0 blogs. ¿Hay blogs publicados?");
    }

    const blogs: BlogForSitemap[] = apiBlogs.map((blog: BlogFromAPI) => ({
      tema: blog.tema,
      fecha: blog.fecha_publicado,
      slug: blog.slug
    }));

    return blogs;

  } catch (error) {
    console.error("ERROR DE CONEXIÓN :", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.centropsicologicocontigovoy.com';
  const lastModifiedStatic = new Date('2025-08-01');

  const staticUrls: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: lastModifiedStatic, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/sobreNosotros/`, lastModified: lastModifiedStatic, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/contactanos/`, lastModified: lastModifiedStatic, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/PreguntasFrecuentes/`, lastModified: lastModifiedStatic, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/blog/`, lastModified: lastModifiedStatic, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/ReservarCita/`, lastModified: lastModifiedStatic, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/login/`, lastModified: lastModifiedStatic, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/servicios/terapia/infantes/`, lastModified: lastModifiedStatic, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/servicios/terapia/adolescentes/`, lastModified: lastModifiedStatic, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/servicios/terapia/adultos/`, lastModified: lastModifiedStatic, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/servicios/terapia/parejas/`, lastModified: lastModifiedStatic, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/servicios/terapia/familia/`, lastModified: lastModifiedStatic, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/servicios/terapia/empresarial/`, lastModified: lastModifiedStatic, changeFrequency: 'weekly', priority: 0.8 },
  ];

  // Obtener blogs dinámicamente
  const blogs = await getBlogs();
  const blogUrls: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${baseUrl}/blog/${createSlug(blog.tema)}/`,
    lastModified: new Date(blog.fecha),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticUrls, ...blogUrls];
}
