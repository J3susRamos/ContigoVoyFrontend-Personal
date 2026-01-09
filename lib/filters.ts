/**
 * Tipos y mapeo de servicios para el filtrado automático.   
 * Aislado, sin dependencias del resto del código.
 */

export type ServiceFilterInfo = {
  slug: string
  enfoque: string
  displayName: string
  precio: number
  rangoEdad?:  string
  especialidad?: string
}

/**
 * Mapeo slug → filtro de servicio
 * Ajusta los slugs según tus rutas reales
 */
export const SERVICE_FILTERS: Record<string, ServiceFilterInfo> = {
  'terapia-ninos': {
    slug: 'terapia-ninos',
    enfoque: 'niños',
    displayName: 'Terapia para Niños',
    precio:  69,
    rangoEdad: '3-12',
  },
  'terapia-adolescentes': {
    slug: 'terapia-adolescentes',
    enfoque: 'adolescentes',
    displayName: 'Terapia para Adolescentes',
    precio: 75,
    rangoEdad:  '13-18',
  },
  'terapia-adultos': {
    slug: 'terapia-adultos',
    enfoque: 'adulto',
    displayName: 'Terapia para Adultos',
    precio: 80,
  },
  'terapia-parejas': {
    slug: 'terapia-parejas',
    enfoque: 'pareja',
    displayName: 'Terapia para Parejas',
    precio:  90,
  },
  'terapia-familiar': {
    slug: 'terapia-familiar',
    enfoque: 'familiar',
    displayName: 'Terapia Familiar',
    precio: 95,
  },
  'terapia-empresarial': {
    slug: 'terapia-empresarial',
    enfoque: 'adulto', 
    displayName: 'Terapia Empresarial',
    precio: 120,
  },
}

/**
 * Obtener filtro por slug
 */
export function getServiceFilterBySlug(
  slug: string
): ServiceFilterInfo | undefined {
  return SERVICE_FILTERS[slug]
}

/**
 * Obtener filtro por displayName (para buscar desde URL params)
 */
export function getServiceFilterByName(
  name: string
): ServiceFilterInfo | undefined {
  return Object.values(SERVICE_FILTERS).find((f) => f.displayName === name)
}