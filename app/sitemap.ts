import { MetadataRoute } from 'next';
import { createSlug } from '@/utils/slugUtils';

interface Blog {
  tema: string;
  fecha: string;
}


async function getBlogs(): Promise<Blog[]> {
 
  return [
    { tema: 'Los beneficios de la meditación en la salud mental', fecha: '2025-08-01' },
    { tema: 'Cómo manejar el estrés laboral', fecha: '2025-08-02' },
    // Agrega más blogs aquí cuando los crees con sus temas exactos
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://centropsicologicocontigovoy.com';
  
  // URLs estáticas del sitio
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date('2025-08-01'),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/sobreNosotros`,
      lastModified: new Date('2025-08-01'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contactanos`,
      lastModified: new Date('2025-08-01'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/PreguntasFrecuentes`,
      lastModified: new Date('2025-08-01'),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date('2025-08-01'),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ReservarCita`,
      lastModified: new Date('2025-08-01'),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date('2025-08-01'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/servicios/terapia/infantes`,
      lastModified: new Date('2025-08-01'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/servicios/terapia/adolescentes`,
      lastModified: new Date('2025-08-01'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/servicios/terapia/adultos`,
      lastModified: new Date('2025-08-01'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/servicios/terapia/parejas`,
      lastModified: new Date('2025-08-01'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/servicios/terapia/familia`,
      lastModified: new Date('2025-08-01'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/servicios/terapia/empresarial`,
      lastModified: new Date('2025-08-01'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // Obtener blogs dinámicamente
  const blogs = await getBlogs();
  const blogUrls: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${baseUrl}/blog/ver?blog=${encodeURIComponent(createSlug(blog.tema))}`,
    lastModified: new Date(blog.fecha),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticUrls, ...blogUrls];
}
