/**
 * Utilidades de conectividad y testing para la API
 */

export interface APIHealthCheck {
  isOnline: boolean;
  endpoints: {
    blogs: boolean;
    slugs: boolean;
    categories: boolean;
    authors: boolean;
  };
  responseTime: number;
  error?: string;
}

/**
 * Función para verificar la salud de la API
 */
export async function checkAPIHealth(apiUrl: string): Promise<APIHealthCheck> {
  const startTime = Date.now();

  const healthCheck: APIHealthCheck = {
    isOnline: false,
    endpoints: {
      blogs: false,
      slugs: false,
      categories: false,
      authors: false,
    },
    responseTime: 0,
  };

  try {
    console.log('🔍 [checkAPIHealth] Verificando salud de la API...');

    // Verificar endpoint principal de blogs
    try {
      const blogsResponse = await fetch(`${apiUrl}api/blogs`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(10000), // 10 segundos timeout
      });

      healthCheck.endpoints.blogs = blogsResponse.ok;

      if (blogsResponse.ok) {
        const data = await blogsResponse.json();
        console.log('✅ [checkAPIHealth] Endpoint blogs disponible:', data.result?.length || 0, 'blogs');
      }
    } catch (blogsError) {
      console.warn('⚠️ [checkAPIHealth] Endpoint blogs no disponible:', blogsError);
    }

    // Verificar endpoint de slugs
    try {
      const slugsResponse = await fetch(`${apiUrl}api/blogs/slugs`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000),
      });

      healthCheck.endpoints.slugs = slugsResponse.ok;

      if (slugsResponse.ok) {
        console.log('✅ [checkAPIHealth] Endpoint slugs disponible');
      }
    } catch (slugsError) {
      console.warn('⚠️ [checkAPIHealth] Endpoint slugs no disponible:', slugsError);
    }

    // Verificar endpoint de categorías
    try {
      const categoriesResponse = await fetch(`${apiUrl}api/categorias`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000),
      });

      healthCheck.endpoints.categories = categoriesResponse.ok;

      if (categoriesResponse.ok) {
        console.log('✅ [checkAPIHealth] Endpoint categorías disponible');
      }
    } catch (categoriesError) {
      console.warn('⚠️ [checkAPIHealth] Endpoint categorías no disponible:', categoriesError);
    }

    // Verificar endpoint de autores
    try {
      const authorsResponse = await fetch(`${apiUrl}api/blogs/authors`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000),
      });

      healthCheck.endpoints.authors = authorsResponse.ok;

      if (authorsResponse.ok) {
        console.log('✅ [checkAPIHealth] Endpoint autores disponible');
      }
    } catch (authorsError) {
      console.warn('⚠️ [checkAPIHealth] Endpoint autores no disponible:', authorsError);
    }

    // Determinar si la API está online
    healthCheck.isOnline = Object.values(healthCheck.endpoints).some(endpoint => endpoint);

  } catch (error) {
    console.error('❌ [checkAPIHealth] Error general:', error);
    healthCheck.error = (error as Error).message;
  }

  healthCheck.responseTime = Date.now() - startTime;

  console.log('📊 [checkAPIHealth] Resultado del health check:', healthCheck);
  return healthCheck;
}

/**
 * Función para obtener información de debug de la API
 */
export async function getAPIDebugInfo(apiUrl: string) {
  console.log('🐛 [getAPIDebugInfo] Información de debug de la API:');
  console.log('  - API URL:', apiUrl);
  console.log('  - NODE_ENV:', process.env.NODE_ENV);
  console.log('  - VERCEL_URL:', process.env.VERCEL_URL);
  console.log('  - Timestamp:', new Date().toISOString());

  const healthCheck = await checkAPIHealth(apiUrl);

  if (!healthCheck.isOnline) {
    console.error('❌ [getAPIDebugInfo] API no está disponible');
    console.error('   Posibles causas:');
    console.error('   1. El servidor de la API está caído');
    console.error('   2. Problemas de red/conectividad');
    console.error('   3. URL incorrecta en NEXT_PUBLIC_API_URL');
    console.error('   4. Problemas de CORS');
    console.error('   5. Firewall bloqueando las solicitudes');
  }

  return healthCheck;
}

/**
 * Función para sugerir soluciones basadas en el diagnóstico
 */
export function getSolutions(healthCheck: APIHealthCheck): string[] {
  const solutions: string[] = [];

  if (!healthCheck.isOnline) {
    solutions.push('Verificar que la URL de la API en NEXT_PUBLIC_API_URL sea correcta');
    solutions.push('Comprobar que el servidor de la API esté ejecutándose');
    solutions.push('Verificar la conectividad de red');
    solutions.push('Revisar la configuración de CORS en el servidor');
  }

  if (healthCheck.responseTime > 5000) {
    solutions.push('El tiempo de respuesta es lento, considerar optimizar la API');
    solutions.push('Verificar la latencia de red entre el cliente y el servidor');
  }

  if (!healthCheck.endpoints.blogs) {
    solutions.push('El endpoint principal de blogs no está disponible');
  }

  if (!healthCheck.endpoints.slugs) {
    solutions.push('El endpoint de slugs no está disponible, se usará fallback');
  }

  return solutions;
}