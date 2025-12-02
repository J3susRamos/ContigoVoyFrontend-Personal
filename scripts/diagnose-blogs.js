#!/usr/bin/env node

/**
 * Script de diagnóstico para problemas de blog
 * 
 * Este script puede ejecutarse desde la terminal para diagnosticar
 * problemas comunes con los blogs y la API
 */

const { exec } = require('child_process');
const https = require('https');
const http = require('http');

// Colores para la consola
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function checkURL(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, (res) => {
      resolve({
        status: res.statusCode,
        ok: res.statusCode >= 200 && res.statusCode < 300
      });
    });

    req.on('error', (error) => {
      resolve({
        status: 0,
        ok: false,
        error: error.message
      });
    });

    req.setTimeout(10000, () => {
      req.abort();
      resolve({
        status: 0,
        ok: false,
        error: 'Timeout'
      });
    });
  });
}

async function runDiagnostic() {
  log('🔍 Diagnóstico de Blogs - Centro Psicológico Contigo Voy', 'bold');
  log('=' * 60, 'blue');

  // Leer variables de entorno
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.centropsicologicocontigovoy.com/';

  log(`📊 Información del entorno:`, 'blue');
  log(`  - NEXT_PUBLIC_API_URL: ${apiUrl}`);
  log(`  - NODE_ENV: ${process.env.NODE_ENV || 'undefined'}`);
  log('');

  // Verificar conectividad básica
  log('🌐 Verificando conectividad...', 'blue');

  const endpoints = [
    { name: 'API Base', url: `${apiUrl}` },
    { name: 'Blogs', url: `${apiUrl}api/blogs` },
    { name: 'Slugs', url: `${apiUrl}api/blogs/slugs` },
    { name: 'Categorías', url: `${apiUrl}api/categorias` },
    { name: 'Autores', url: `${apiUrl}api/blogs/authors` },
  ];

  for (const endpoint of endpoints) {
    log(`  Probando ${endpoint.name}...`, 'yellow');
    const result = await checkURL(endpoint.url);

    if (result.ok) {
      log(`  ✅ ${endpoint.name}: OK (${result.status})`, 'green');
    } else {
      log(`  ❌ ${endpoint.name}: Error (${result.status || result.error})`, 'red');
    }
  }

  log('');

  // Verificar archivos del proyecto
  log('📁 Verificando archivos del proyecto...', 'blue');

  const files = [
    'app/blog/[blog]/page.tsx',
    'app/blog/plantilla/page.tsx',
    'utils/slugUtils.ts',
    'utils/blogUtils.ts',
    'components/blog/BlogNotFound.tsx'
  ];

  for (const file of files) {
    try {
      require('fs').accessSync(file);
      log(`  ✅ ${file}: Existe`, 'green');
    } catch {
      log(`  ❌ ${file}: No encontrado`, 'red');
    }
  }

  log('');

  // Sugerencias
  log('💡 Sugerencias para resolver problemas:', 'blue');
  log('  1. Verificar que NEXT_PUBLIC_API_URL esté correctamente configurada');
  log('  2. Comprobar que el servidor de la API esté ejecutándose');
  log('  3. Verificar la conectividad de red');
  log('  4. Revisar los logs del servidor para errores');
  log('  5. Confirmar que los blogs existen en la base de datos');
  log('  6. Ejecutar: npm run build para reconstruir el proyecto');
  log('');

  log('🔧 Comandos útiles:', 'blue');
  log('  - npm run build: Reconstruir el proyecto');
  log('  - npm run dev: Ejecutar en modo desarrollo');
  log('  - npm run start: Ejecutar en modo producción');
  log('');

  log('📝 Para más información, revisar los logs en la consola del navegador', 'yellow');
}

// Ejecutar diagnóstico
runDiagnostic().catch(console.error);