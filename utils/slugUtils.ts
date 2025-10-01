/**
 * Utilidades para generar y manejar slugs
 */

/**
 * Crear slug desde el título
 */
export function createSlug(title: string): string {
  if (!title) return '';
  
  // Para evitar problemas de búsqueda, simplemente retornar el título URL-encoded
  // Esto preserva los caracteres especiales y permite una búsqueda más precisa
  return encodeURIComponent(title.trim());
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
