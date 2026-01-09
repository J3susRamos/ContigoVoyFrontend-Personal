'use client'

import { useSearchParams } from 'next/navigation'
import { getServiceFilterByName, getServiceFilterBySlug, type ServiceFilterInfo } from '@/lib/filters'

/**
 * Hook que extrae el filtro de servicio desde URLSearchParams. 
 * 
 * Retorna:  
 * - ServiceFilterInfo si viene desde una página de servicio (con ? serviceName=...)
 * - null si viene directo a /ReservarCita
 */
export function useServiceFilter(): ServiceFilterInfo | null {
  const searchParams = useSearchParams()

  if (! searchParams) return null

  const serviceName = searchParams.get('serviceName')
  if (!serviceName) return null

  console.log(' [HOOK] useServiceFilter llamado con serviceName:', serviceName)

  // Primero intenta buscar por slug (que es lo que ahora pasamos desde las páginas de servicios)
  const serviceBySlug = getServiceFilterBySlug(serviceName)
  if (serviceBySlug) {
    console.log(' [HOOK] Encontrado por slug:', serviceBySlug)
    return serviceBySlug
  }

  // Si no encuentra por slug, intenta por displayName (para compatibilidad con URLs antiguas)
  const serviceByName = getServiceFilterByName(decodeURIComponent(serviceName))
  if (serviceByName) {
    console.log(' [HOOK] Encontrado por displayName:', serviceByName)
    return serviceByName
  }

  console.log(' [HOOK] No se encontró servicio para:', serviceName)
  return null
}