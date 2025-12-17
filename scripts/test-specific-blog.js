#!/usr/bin/env node

/**
 * Script de prueba específico para el blog problemático
 * "depresion-vs-tristeza-diferencias-clave-que-todos-debemos-conocer"
 */

const https = require('https');
const { URL } = require('url');

const API_BASE_URL = 'https://api.centropsicologicocontigovoy.com/api';
const PROBLEMATIC_BLOG = 'depresion-vs-tristeza-diferencias-clave-que-todos-debemos-conocer';

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
        'User-Agent': 'Blog-Test-Tool/1.0'
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

async function testBlogSearch() {
  console.log('🧪 Probando búsqueda del blog problemático específico...\n');

  const blogQuery = PROBLEMATIC_BLOG;
  console.log(`🎯 Blog objetivo: "${blogQuery}"\n`);

  try {
    // Obtener todos los blogs
    console.log('📡 Obteniendo todos los blogs...');
    const allBlogsResponse = await makeRequest(`${API_BASE_URL}/blogs`);

    if (allBlogsResponse.status !== 200) {
      console.error('❌ Error obteniendo blogs:', allBlogsResponse.status);
      return;
    }

    const allBlogs = allBlogsResponse.data.result || [];
    console.log(`✅ Obtenidos ${allBlogs.length} blogs\n`);

    // Simular la lógica exacta del frontend
    const normalizedQuery = normalizeText(blogQuery.replace(/-/g, ' '));
    console.log(`🔍 Query normalizado: "${normalizedQuery}"\n`);

    // Buscar el blog específico
    console.log('🔍 Buscando coincidencias...\n');

    let found = false;

    allBlogs.forEach((blog, index) => {
      const tema = normalizeText(blog.tema || "");
      const slug = normalizeText(blog.slug || "");
      const originalSlug = (blog.slug || "").toLowerCase();

      // Aplicar la misma lógica que el frontend
      const exactMatch = tema === normalizedQuery || slug === normalizedQuery;
      const containsMatch = tema.includes(normalizedQuery) || normalizedQuery.includes(tema);
      const originalSlugMatch = originalSlug === blogQuery.toLowerCase();

      // Coincidencia de palabras
      const queryWords = normalizedQuery.split(' ').filter(word => word.length > 3);
      const matchingWords = queryWords.filter(word => tema.includes(word));
      const wordMatchScore = queryWords.length > 0 ? (matchingWords.length / queryWords.length) : 0;
      const wordsMatch = wordMatchScore >= 0.7;

      const isMatch = exactMatch || containsMatch || originalSlugMatch || wordsMatch;

      if (isMatch || blog.tema.toLowerCase().includes('depresion') || blog.tema.toLowerCase().includes('tristeza')) {
        console.log(`${isMatch ? '🎯' : '📋'} Blog ${index + 1}:`);
        console.log(`   Tema original: "${blog.tema}"`);
        console.log(`   Slug original: "${blog.slug}"`);
        console.log(`   Tema normalizado: "${tema}"`);
        console.log(`   Slug normalizado: "${slug}"`);
        console.log(`   Coincidencias:`);
        console.log(`     - Exacta: ${exactMatch}`);
        console.log(`     - Contiene: ${containsMatch}`);
        console.log(`     - Slug original: ${originalSlugMatch}`);
        console.log(`     - Palabras (${wordMatchScore.toFixed(2)}): ${wordsMatch}`);
        console.log(`   ✅ MATCH: ${isMatch}\n`);

        if (isMatch) {
          found = true;
        }
      }
    });

    if (found) {
      console.log('🎉 Blog encontrado con la lógica actual!');
    } else {
      console.log('❌ Blog NO encontrado con la lógica actual');
      console.log('\n📋 Primeros 5 blogs para referencia:');
      allBlogs.slice(0, 5).forEach((blog, index) => {
        console.log(`   ${index + 1}. "${blog.tema}"`);
        console.log(`      Slug: "${blog.slug}"`);
      });
    }

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  }
}

// Ejecutar prueba
testBlogSearch().catch(console.error);