/**
 * Utilidades para generar y manejar slugs
 */

/**
 * Crear slug desde el título
 */
export function createSlug(title: string): string {
  if (!title) return '';
  
  // Convertir a minúsculas
  let slug = title.toLowerCase();
  
  // Reemplazar caracteres especiales del español
  slug = slug.replace(/[áàäâã]/g, 'a');
  slug = slug.replace(/[éèëê]/g, 'e');
  slug = slug.replace(/[íìïî]/g, 'i');
  slug = slug.replace(/[óòöôõ]/g, 'o');
  slug = slug.replace(/[úùüû]/g, 'u');
  slug = slug.replace(/[ñ]/g, 'n');
  slug = slug.replace(/[ç]/g, 'c');
  
  // Eliminar caracteres que no sean letras, números, espacios o guiones
  slug = slug.replace(/[^\w\s-]/g, '');
  
  // Reemplazar espacios múltiples con uno solo
  slug = slug.replace(/\s+/g, ' ');
  
  // Reemplazar espacios con guiones
  slug = slug.replace(/\s/g, '-');
  
  // Eliminar guiones múltiples
  slug = slug.replace(/-+/g, '-');
  
  // Eliminar guiones al inicio y final
  slug = slug.replace(/^-+|-+$/g, '');
  
  // Limitar longitud
  if (slug.length > 100) {
    slug = slug.substring(0, 100);
    // Asegurar que no termine en guión
    slug = slug.replace(/-+$/, '');
  }
  
  return slug;
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
