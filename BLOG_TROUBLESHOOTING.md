# Solución de Problemas de Blogs - Error 404

## Problema Identificado

Los blogs con slugs como "bienestar-emocional" y "autoestima-y-confianza" están devolviendo errores 404 porque hay una desconexión entre:

1. Los slugs generados por el frontend
2. Los temas almacenados en la base de datos
3. Los endpoints de la API utilizados para la búsqueda

## Síntomas

```
❌ [getBlogByQuery] Blog "bienestar emocional" not found: 404
❌ [getBlogByQuery] Blog "autoestima y confianza" not found: 404
```

## Soluciones Implementadas

### 1. Estrategia de Búsqueda Múltiple

La función `getBlogByQuery` ahora implementa 5 estrategias de búsqueda:

1. **Búsqueda por slug**: `/api/blogs/slug/{slug}`
2. **Búsqueda por ID**: `/api/blogs/{id}` (si el query es un número)
3. **Búsqueda por tema exacto**: `/api/blogs/tema/{tema}` 
4. **Búsqueda convirtiendo guiones a espacios**: Convierte "autoestima-y-confianza" a "autoestima y confianza"
5. **Búsqueda general (fallback)**: Busca en todos los blogs y hace coincidencia por similitud

### 2. Función `createSlug` Mejorada

```typescript
// Antes (problemática)
export function createSlug(title: string): string {
  return title.trim(); // Solo retornaba el título sin procesar
}

// Después (mejorada)
export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[áéíóúñü]/g, (match) => { /* normalización */ })
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}
```

### 3. Componente de Error Mejorado

- `BlogNotFound.tsx`: Muestra sugerencias de blogs similares
- Diagnóstico automático de blogs disponibles
- Enlaces a artículos relacionados

### 4. Herramientas de Diagnóstico

#### Script de Diagnóstico
```bash
npm run diagnose
```

Este script verifica:
- Conectividad de la API
- Estado de todos los endpoints
- Archivos del proyecto
- Variables de entorno

#### Utilidades de Salud de la API
- `apiHealthUtils.ts`: Funciones para verificar el estado de la API
- `blogUtils.ts`: Diagnóstico específico de blogs

## Comandos de Resolución

### 1. Diagnóstico Rápido
```bash
npm run diagnose
```

### 2. Reconstruir el Proyecto
```bash
npm run build
```

### 3. Verificar en Desarrollo
```bash
npm run dev
```

### 4. Verificar Variables de Entorno
Asegúrate de que `NEXT_PUBLIC_API_URL` esté correctamente configurada en tu archivo `.env`.

## Verificación Manual

### 1. Probar la API Directamente

```bash
# Verificar que la API responda
curl https://api.centropsicologicocontigovoy.com/api/blogs

# Verificar un blog específico por tema
curl "https://api.centropsicologicocontigovoy.com/api/blogs/tema/autoestima%20y%20confianza"
```

### 2. Revisar Logs de la Consola

Los logs ahora incluyen información detallada sobre cada estrategia de búsqueda:

```
🔍 [getBlogByQuery] Estrategia 1: Buscando por slug...
🔍 [getBlogByQuery] Estrategia 2: Buscando por ID...
🔍 [getBlogByQuery] Estrategia 3: Buscando por tema exacto...
🔍 [getBlogByQuery] Estrategia 4: Convirtiendo guiones a espacios...
🔍 [getBlogByQuery] Estrategia 5: Búsqueda general (fallback)...
```

### 3. Verificar el generateStaticParams

El `generateStaticParams` ahora tiene fallbacks robustos:

1. Intenta obtener slugs del endpoint específico
2. Si falla, obtiene todos los blogs y genera slugs
3. Si todo falla, usa slugs predefinidos

## Configuración de la API

### Endpoints Necesarios

Asegúrate de que tu API tenga estos endpoints:

```
GET /api/blogs                    # Todos los blogs
GET /api/blogs/slugs             # Lista de slugs (opcional, mejora performance)
GET /api/blogs/slug/{slug}       # Buscar por slug específico (opcional)
GET /api/blogs/tema/{tema}       # Buscar por tema
GET /api/blogs/{id}              # Buscar por ID
```

### Formato de Respuesta Esperado

```json
{
  "result": {
    "id": 1,
    "tema": "Autoestima y Confianza",
    "slug": "autoestima-y-confianza", // Campo slug opcional
    "contenido": "...",
    "categoria": "...",
    "psicologo": "...",
    // ... otros campos
  }
}
```

## Prevención de Problemas Futuros

### 1. Consistencia de Slugs

- Usar siempre `createSlug()` para generar slugs
- Almacenar slugs en la base de datos si es posible
- Mantener consistencia entre frontend y backend

### 2. Testing

- Probar regularmente los enlaces de blogs
- Verificar que `generateStaticParams` funcione correctamente
- Monitorear logs de 404 en producción

### 3. Fallbacks

- Siempre tener estrategias de fallback para búsquedas
- Proporcionar sugerencias cuando un blog no se encuentre
- Mantener rutas estáticas de respaldo

## Contacto para Soporte

Si los problemas persisten después de aplicar estas soluciones:

1. Ejecutar `npm run diagnose` y compartir el resultado
2. Verificar los logs del navegador en las herramientas de desarrollador
3. Comprobar que el servidor de la API esté funcionando
4. Verificar la configuración de variables de entorno