/**
 * Utilidades para manejo de contenido de blogs
 */

/**
 * Formatea el contenido HTML del blog para su correcta visualización
 * Preserva saltos de línea, párrafos y estructura del contenido
 * @param htmlContent - Contenido HTML del blog
 * @returns HTML formateado con estructura preservada
 */
export function formatBlogContent(htmlContent: string): string {
  if (!htmlContent) return '';

  // Si el contenido es texto plano (sin tags HTML), convertirlo a HTML estructurado
  if (!htmlContent.includes('<') || (!htmlContent.includes('<p>') && !htmlContent.includes('<h') && !htmlContent.includes('<div>'))) {
    // Es texto plano, necesitamos convertirlo a HTML
    const paragraphs = htmlContent
      .split(/\n\s*\n/) // Dividir por saltos de línea dobles
      .map(p => p.trim())
      .filter(p => p.length > 0)
      .map(p => {
        // Convertir saltos de línea simples a <br> dentro del párrafo
        const processedP = p.replace(/\n/g, '<br>');
        return `<p style="margin-bottom: 1em; line-height: 1.6; white-space: pre-wrap;">${processedP}</p>`;
      });
    
    return paragraphs.join('');
  }

  // Es contenido HTML, procesarlo para mejorar el formato
  const formattedContent = htmlContent
    // Asegurar que los párrafos tengan estilo apropiado
    .replace(/<p([^>]*)>/gi, (match, attributes) => {
      // Si ya tiene estilo, no lo sobrescribamos
      if (attributes && attributes.includes('style=')) {
        return match;
      }
      return `<p${attributes} style="margin-bottom: 1em; line-height: 1.6; white-space: pre-wrap;">`;
    })
    // Asegurar que los encabezados tengan margen apropiado
    .replace(/<h([1-6])([^>]*)>/gi, (match, level, attributes) => {
      if (attributes && attributes.includes('style=')) {
        return match;
      }
      return `<h${level}${attributes} style="margin: 1.2em 0 0.6em 0; line-height: 1.4;">`;
    })
    // Asegurar que las listas tengan formato apropiado
    .replace(/<ul([^>]*)>/gi, (match, attributes) => {
      if (attributes && attributes.includes('style=')) {
        return match;
      }
      return `<ul${attributes} style="margin: 1em 0; padding-left: 2em;">`;
    })
    .replace(/<ol([^>]*)>/gi, (match, attributes) => {
      if (attributes && attributes.includes('style=')) {
        return match;
      }
      return `<ol${attributes} style="margin: 1em 0; padding-left: 2em;">`;
    })
    .replace(/<li([^>]*)>/gi, (match, attributes) => {
      if (attributes && attributes.includes('style=')) {
        return match;
      }
      return `<li${attributes} style="margin-bottom: 0.5em;">`;
    })
    // Asegurar que las imágenes tengan formato responsivo
    .replace(/<img([^>]+)>/gi, (match, attributes) => {
      if (attributes && attributes.includes('style=')) {
        return match;
      }
      return `<img${attributes} style="max-width: 100%; height: auto; display: block; margin: 1em 0;">`;
    })
    // Limpiar espacios extra al inicio y final
    .trim();

  return formattedContent;
}

/**
 * Extrae un resumen limpio y bien formateado del contenido HTML
 * @param htmlContent - Contenido HTML del blog
 * @param maxLength - Longitud máxima del resumen (por defecto 200 caracteres)
 * @returns Resumen del contenido preservando algunos elementos de formato
 */
export function extractFormattedExcerpt(htmlContent: string, maxLength: number = 200): string {
  if (!htmlContent) return '';

  // Si es texto plano, procesarlo de manera similar a formatBlogContent
  if (!htmlContent.includes('<') || (!htmlContent.includes('<p>') && !htmlContent.includes('<h') && !htmlContent.includes('<div>'))) {
    // Es texto plano
    const cleanText = htmlContent
      .replace(/\n{3,}/g, '\n\n') // Normalizar múltiples saltos de línea
      .trim();
    
    if (cleanText.length <= maxLength) {
      return cleanText;
    }
    
    const truncated = cleanText.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    if (lastSpaceIndex > maxLength * 0.8) {
      return truncated.substring(0, lastSpaceIndex) + '...';
    }
    return truncated + '...';
  }

  // Primero, limpiar el HTML pero preservar algunos elementos importantes
  let cleanContent = htmlContent
    // Reemplazar párrafos con saltos de línea dobles para preservar separación
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<p[^>]*>/gi, '')
    // Reemplazar br con saltos de línea simples
    .replace(/<br[^>]*>/gi, '\n')
    // Reemplazar elementos de encabezado con separación
    .replace(/<\/(h[1-6])>/gi, '\n\n')
    .replace(/<h[1-6][^>]*>/gi, '')
    // Reemplazar listas con separación
    .replace(/<\/(ul|ol|li)>/gi, '\n')
    .replace(/<(ul|ol|li)[^>]*>/gi, '• ')
    // Limpiar otros elementos HTML
    .replace(/<[^>]+>/g, '')
    // Limpiar entidades HTML comunes
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    // Normalizar espacios pero preservar saltos de línea
    .replace(/[ \t]+/g, ' ') // Solo espacios y tabs, no saltos de línea
    .replace(/\n{3,}/g, '\n\n') // Máximo 2 saltos de línea consecutivos
    .trim();

  // Si el contenido es más largo que maxLength, cortarlo en una palabra completa
  if (cleanContent.length > maxLength) {
    cleanContent = cleanContent.substring(0, maxLength);
    const lastSpaceIndex = cleanContent.lastIndexOf(' ');
    if (lastSpaceIndex > maxLength * 0.8) { // Solo cortar en espacio si no está muy atrás
      cleanContent = cleanContent.substring(0, lastSpaceIndex);
    }
    cleanContent += '...';
  }

  return cleanContent;
}

/**
 * Extrae el primer párrafo del contenido HTML de manera limpia
 * @param htmlContent - Contenido HTML del blog
 * @returns Primer párrafo limpio del contenido
 */
export function extractFirstParagraph(htmlContent: string): string {
  if (!htmlContent) return '';

  // Buscar el primer párrafo
  const paragraphMatch = htmlContent.match(/<p[^>]*>(.*?)<\/p>/i);
  
  if (paragraphMatch) {
    const content = paragraphMatch[1]
      // Limpiar elementos HTML internos
      .replace(/<[^>]+>/g, '')
      // Limpiar entidades HTML
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      // Limpiar espacios extra
      .replace(/\s+/g, ' ')
      .trim();

    return content;
  }

  // Si no hay párrafos, usar la función de extracto general
  return extractFormattedExcerpt(htmlContent, 150);
}

/**
 * Cuenta las palabras en el contenido HTML
 * @param htmlContent - Contenido HTML del blog
 * @returns Número de palabras
 */
export function countWords(htmlContent: string): number {
  if (!htmlContent) return 0;

  const textContent = htmlContent
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return textContent.split(' ').filter(word => word.length > 0).length;
}

/**
 * Estima el tiempo de lectura basado en el contenido
 * @param htmlContent - Contenido HTML del blog
 * @param wordsPerMinute - Palabras por minuto (por defecto 200)
 * @returns String con el tiempo estimado de lectura
 */
export function getReadingTime(htmlContent: string, wordsPerMinute: number = 200): string {
  const wordCount = countWords(htmlContent);
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min de lectura`;
}