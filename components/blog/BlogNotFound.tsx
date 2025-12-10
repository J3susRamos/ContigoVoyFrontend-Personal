import Link from 'next/link';
import { diagnoseBlogAPI, suggestSimilarBlogs } from '@/utils/blogUtils';

// Mapeo de blogs conocidos que pueden tener problemas de slug
const KNOWN_BLOG_MAPPINGS: Record<string, string[]> = {
  'depresion-vs-tristeza': ['depresion', 'tristeza', 'diferencias-depresion-tristeza'],
  'bienestar-emocional': ['bienestar', 'emocional', 'salud-mental'],
  'autoestima-y-confianza': ['autoestima', 'confianza', 'autoestima-personal'],
  'diferencias-clave': ['diferencias', 'claves', 'importantes']
};

interface BlogNotFoundProps {
  searchQuery: string;
  apiUrl?: string;
}

export default async function BlogNotFound({ searchQuery, apiUrl }: BlogNotFoundProps) {
  let suggestions: string[] = [];

  // Intentar obtener sugerencias si es posible
  if (apiUrl) {
    try {
      const diagnostic = await diagnoseBlogAPI(apiUrl);
      if (diagnostic) {
        suggestions = suggestSimilarBlogs(searchQuery, diagnostic.availableBlogs);
        console.log('💡 [BlogNotFound] Sugerencias encontradas:', suggestions);
      }
    } catch (error) {
      console.error('❌ [BlogNotFound] Error al obtener sugerencias:', error);
    }
  }

  // Añadir sugerencias basadas en mapeo de blogs problemáticos conocidos
  const knownSuggestions: string[] = [];
  Object.entries(KNOWN_BLOG_MAPPINGS).forEach(([pattern, alternatives]) => {
    if (searchQuery.includes(pattern) || pattern.includes(searchQuery)) {
      knownSuggestions.push(...alternatives);
      console.log(`💡 [BlogNotFound] Patrón "${pattern}" detectado, añadiendo:`, alternatives);
    }
  });

  // Combinar y filtrar sugerencias únicas
  suggestions = [...new Set([...suggestions, ...knownSuggestions])].slice(0, 5);
  console.log('💡 [BlogNotFound] Sugerencias finales:', suggestions);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="text-center space-y-6 max-w-2xl px-6">
        <div className="text-6xl">😕</div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Artículo no encontrado
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          No pudimos encontrar el artículo &quot;{searchQuery}&quot;.
          Puede que haya sido movido o el enlace esté desactualizado.
        </p>

        {suggestions.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Artículos relacionados que podrían interesarte:
            </h2>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <Link
                  key={index}
                  href={`/blog/${suggestion}`}
                  className="block px-4 py-2 text-left bg-gradient-to-r from-[#634AE2] to-[#8b7cf6] bg-opacity-10 hover:bg-opacity-20 text-[#634AE2] dark:text-[#8b7cf6] rounded-lg transition-all duration-300 hover:shadow-md"
                >
                  {suggestion.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/blog"
            className="inline-block px-6 py-3 bg-gradient-to-r from-[#634AE2] to-[#8b7cf6] text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
          >
            Ver todos los artículos
          </Link>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-white rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-300"
          >
            Ir al inicio
          </Link>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
          <p>¿No encuentras lo que buscas?</p>
          <p>
            <Link
              href="/contactanos"
              className="text-[#634AE2] dark:text-[#8b7cf6] hover:underline"
            >
              Contáctanos
            </Link>
            {' '}y te ayudaremos a encontrar la información que necesitas.
          </p>
        </div>
      </div>
    </div>
  );
}