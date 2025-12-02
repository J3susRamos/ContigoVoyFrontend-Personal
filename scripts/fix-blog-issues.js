#!/usr/bin/env node

/**
 * Script para diagnosticar y corregir problemas específicos de blogs
 * que no se encuentran en la API
 */

const https = require('https');
const { URL } = require('url');

const API_BASE_URL = 'https://api.centropsicologicocontigovoy.com/api';

// Lista de blogs problemáticos reportados
const PROBLEMATIC_BLOGS = [
  'depresion-vs-tristeza-diferencias-clave-que-todos-debemos-conocer',
  'bienestar-emocional',
  'autoestima-y-confianza'
];

/**
 * Realizar petición HTTPS
 */
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);

    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Blog-Diagnostic-Tool/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: jsonData,
            raw: data
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: null,
            raw: data,
            parseError: error.message
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

/**
 * Normalizar texto para comparación
 */
function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[áéíóúñü]/g, (match) => {
      const replacements = {
        'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'n', 'ü': 'u'
      };
      return replacements[match] || match;
    })
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Buscar blogs similares usando diferentes estrategias
 */
function findSimilarBlogs(blogQuery, allBlogs) {
  const normalizedQuery = normalizeText(blogQuery.replace(/-/g, ' '));
  const queryWords = normalizedQuery.split(' ').filter(word => word.length > 3);

  const results = [];

  allBlogs.forEach(blog => {
    const tema = normalizeText(blog.tema || '');
    const slug = normalizeText(blog.slug || '');

    let score = 0;
    let matchType = '';

    // Coincidencia exacta
    if (tema === normalizedQuery || slug === normalizedQuery) {
      score = 100;
      matchType = 'exact';
    }
    // Contiene la query completa
    else if (tema.includes(normalizedQuery) || normalizedQuery.includes(tema)) {
      score = 80;
      matchType = 'contains';
    }
    // Coincidencia de palabras clave
    else {
      const matchingWords = queryWords.filter(word =>
        tema.includes(word) || slug.includes(word)
      );
      if (matchingWords.length > 0) {
        score = (matchingWords.length / queryWords.length) * 60;
        matchType = `words(${matchingWords.join(', ')})`;
      }
    }

    if (score > 0) {
      results.push({
        blog,
        score,
        matchType,
        tema: blog.tema,
        slug: blog.slug
      });
    }
  });

  return results.sort((a, b) => b.score - a.score);
}

/**
 * Diagnóstico principal
 */
async function runDiagnostic() {
  console.log('🔍 Iniciando diagnóstico de blogs problemáticos...\n');

  try {
    // 1. Obtener todos los blogs
    console.log('📡 Obteniendo todos los blogs disponibles...');
    const allBlogsResponse = await makeRequest(`${API_BASE_URL}/blogs`);

    if (allBlogsResponse.status !== 200) {
      console.error('❌ Error obteniendo blogs:', allBlogsResponse.status);
      console.error('Response:', allBlogsResponse.raw);
      return;
    }

    const allBlogs = allBlogsResponse.data.result || [];
    console.log(`✅ Obtenidos ${allBlogs.length} blogs de la API\n`);

    // 2. Analizar cada blog problemático
    for (const blogQuery of PROBLEMATIC_BLOGS) {
      console.log(`🔍 Analizando: "${blogQuery}"`);
      console.log('━'.repeat(50));

      // Estrategia 1: Buscar por slug
      console.log('📋 Estrategia 1: Búsqueda por slug...');
      try {
        const slugResponse = await makeRequest(`${API_BASE_URL}/blogs/slug/${blogQuery}`);
        console.log(`   Status: ${slugResponse.status}`);
        if (slugResponse.status === 200) {
          console.log('   ✅ Encontrado por slug!');
          continue; // Si se encuentra, continuar con el siguiente
        }
      } catch (error) {
        console.log('   ❌ Error en búsqueda por slug:', error.message);
      }

      // Estrategia 2: Buscar por tema (con guiones convertidos a espacios)
      console.log('📋 Estrategia 2: Búsqueda por tema...');
      const temaQuery = blogQuery.replace(/-/g, ' ');
      try {
        const temaResponse = await makeRequest(`${API_BASE_URL}/blogs/tema/${encodeURIComponent(temaQuery)}`);
        console.log(`   Status: ${temaResponse.status} para tema: "${temaQuery}"`);
        if (temaResponse.status === 200) {
          console.log('   ✅ Encontrado por tema!');
          continue;
        }
      } catch (error) {
        console.log('   ❌ Error en búsqueda por tema:', error.message);
      }

      // Estrategia 3: Búsqueda manual en todos los blogs
      console.log('📋 Estrategia 3: Búsqueda manual...');
      const similarBlogs = findSimilarBlogs(blogQuery, allBlogs);

      if (similarBlogs.length > 0) {
        console.log(`   ✅ Encontradas ${similarBlogs.length} coincidencias:`);
        similarBlogs.slice(0, 3).forEach((result, index) => {
          console.log(`     ${index + 1}. "${result.tema}" (score: ${result.score.toFixed(1)}, tipo: ${result.matchType})`);
          console.log(`        Slug: "${result.slug}"`);
        });
      } else {
        console.log('   ❌ No se encontraron blogs similares');

        // Mostrar algunos blogs disponibles como referencia
        console.log('   📝 Algunos blogs disponibles:');
        allBlogs.slice(0, 5).forEach((blog, index) => {
          console.log(`     ${index + 1}. "${blog.tema}"`);
          console.log(`        Slug: "${blog.slug}"`);
        });
      }

      console.log(''); // Línea en blanco
    }

    // 3. Verificar endpoints específicos
    console.log('🔍 Verificando endpoints específicos...\n');

    const endpoints = [
      { name: 'Blogs', url: `${API_BASE_URL}/blogs` },
      { name: 'Categorías', url: `${API_BASE_URL}/categorias` },
      { name: 'Autores', url: `${API_BASE_URL}/blogs/authors` }
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await makeRequest(endpoint.url);
        console.log(`${response.status === 200 ? '✅' : '❌'} ${endpoint.name}: ${response.status}`);
        if (response.status === 200 && response.data.result) {
          console.log(`   Elementos disponibles: ${response.data.result.length}`);
        }
      } catch (error) {
        console.log(`❌ ${endpoint.name}: Error - ${error.message}`);
      }
    }

    console.log('\n🎯 Diagnóstico completado!');

  } catch (error) {
    console.error('❌ Error en diagnóstico:', error);
  }
}

// Ejecutar diagnóstico
if (require.main === module) {
  runDiagnostic().catch(console.error);
}

module.exports = { runDiagnostic, normalizeText, findSimilarBlogs };