'use client'

import { ServiceFilterInfo } from '@/lib/filters'

interface FilterBadgeProps {
  serviceInfo: ServiceFilterInfo | null
  onClear:  () => void
}

/**
 * Badge que muestra cuando el usuario viene desde una página de servicio.  
 * Muestra:   "Filtrado por: [Nombre del servicio]" con botón para limpiar.  
 */
export function FilterBadge({ serviceInfo, onClear }:  FilterBadgeProps) {
  if (!serviceInfo) return null

  return (
    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-300 px-4 py-3 rounded-lg mb-6 text-sm font-medium shadow-sm">
      <svg
        className="w-4 h-4 flex-shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M3 3a1 1 0 011-1h12a1 1 0 011 1v2h2a1 1 0 110 2h-. 22l-.894 4. 47a2 2 0 01-1.946 1.659H6.062a2 2 0 01-1.946-1.659L3.22 7H1a1 1 0 110-2h2V3zm0 5h14l. 632-3.163A1 1 0 0016.97 4H3. 03a1 1 0 00-. 632 1.837L3 8z"
          clipRule="evenodd"
        />
      </svg>
      <span className="flex-1">
        <strong>Filtrado por: </strong> {serviceInfo.displayName}
      </span>
      <button
        onClick={onClear}
        className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-bold transition-colors"
        aria-label={`Limpiar filtro de ${serviceInfo.displayName}`}
        type="button"
      >
        ✕
      </button>
    </div>
  )
}