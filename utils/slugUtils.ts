/**
 * Utilidades para generar y manejar slugs
 */

/**
 * Crear slug desde el título
 */
export function createSlug(title: string): string {
  if (!title) return '';

  return title
    .toLowerCase()
    .trim()
    // Reemplazar caracteres acentuados
    .replace(/[áéíóúñü]/g, (match) => {
      const replacements: { [key: string]: string } = {
        'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'n', 'ü': 'u'
      };
      return replacements[match] || match;
    })
    // Remover caracteres especiales excepto espacios y guiones
    .replace(/[^\w\s-]/g, '')
    // Reemplazar espacios múltiples con uno solo
    .replace(/\s+/g, ' ')
    // Reemplazar espacios con guiones
    .replace(/\s/g, '-')
    // Remover guiones múltiples
    .replace(/-+/g, '-')
    // Remover guiones al inicio y final
    .replace(/^-+|-+$/g, '');
}

/**
 * Validar si un slug es válido
 */
export function isValidSlug(slug: string): boolean {
  if (!slug) return false;

  // Solo letras minúsculas, números y guiones
  const slugRegex = /^[a-z0-9-]+$/;

  // No debe empezar o terminar con guión
  const validStartEnd = !slug.startsWith('-') && !slug.endsWith('-');

  // No debe tener guiones múltiples
  const noMultipleHyphens = !slug.includes('--');

  return slugRegex.test(slug) && validStartEnd && noMultipleHyphens;
}

/**
 * Limpiar slug existente
 */
export function cleanSlug(slug: string): string {
  return createSlug(slug);
}
