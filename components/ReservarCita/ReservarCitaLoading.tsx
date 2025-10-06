import { Skeleton } from "@heroui/react";
import { memo } from "react"; // Import memo para optimizar re-renders innecesarios

// Memoizar componentes internos para evitar re-creaciones en cada render
const RenderFilterSection = memo(() => (
  <Skeleton className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-100 dark:border-gray-600">
    <div className="h-8 mb-4"></div>
    <div className="h-32"></div>
  </Skeleton>
));

const CardPreviewLoading = memo(() => (
  <Skeleton className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 h-80 w-full">
    {/* Asegurar que ocupe todo el ancho disponible en mobile */}
  </Skeleton>
));

// Memoizar el array de filtros para desktop (evita recreación en cada render)
const FilterSections = memo(() => (
  <div className="hidden sm:block space-y-4">
    {Array.from({ length: 4 }).map((_, index) => (
      <RenderFilterSection key={index} />
    ))}
  </div>
));

// Definir interfaz para props de PsychologistGrid para resolver el error de TypeScript
interface PsychologistGridProps {
  count?: number;
}

// Memoizar el array de cards para el grid (mejora rendimiento en mobile al reducir overhead)
const PsychologistGrid = memo(({ count = 6 }: PsychologistGridProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
    {Array.from({ length: count }).map((_, index) => (
      <CardPreviewLoading key={index} />
    ))}
  </div>
));

const ReservarCitaLoading = memo(() => {
  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900">
      {/* Hero simplificado - Reducir padding en mobile para mejor rendimiento visual y carga más rápida */}
      <div className="relative bg-gradient-to-br from-purple-600 to-indigo-600 dark:from-purple-900 dark:to-indigo-900 py-12 sm:py-16 md:py-20">
        {/* Decoración solo en desktop - Ya oculta en mobile para ahorrar rendering */}
        <div className="hidden md:block absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full blur-xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
              {/* Usar leading-tight para mejor legibilidad y rendimiento en mobile */}
              La mejor inversión es en ti mismo
            </h1>

            <h2 className="text-lg sm:text-xl md:text-3xl font-semibold text-white/90 mb-3 md:mb-4">
              ¡Comienza tu proceso hoy!
            </h2>

            <p className="text-base sm:text-lg md:text-2xl text-white/80 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed">
              {/* leading-relaxed para fluidez en mobile */}
              Agenda tu sesión con un psicólogo en línea, fácil, seguro y
              privado
            </p>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-6 text-white/80 text-sm sm:text-base">
              {/* Reducir gap en mobile para layout más compacto */}
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-2 sm:px-3 md:px-4 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="font-medium text-xs sm:text-sm">
                  Profesionales certificados
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-2 sm:px-3 md:px-4 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="font-medium text-xs sm:text-sm">100% confidencial</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-2 sm:px-3 md:px-4 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="font-medium text-xs sm:text-sm">
                  Primera sesión gratuita
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal - Reducir padding en mobile para scroll más eficiente */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8">
          {/* Sidebar - Optimizar para mobile: menos espacio y skeletons más compactos */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="w-full p-3 sm:p-4 md:p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl">
              <div className="mb-3 sm:mb-4 md:mb-6">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 dark:text-gray-200 mb-2 leading-tight">
                  Encuentra tu psicólogo ideal
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Filtra por tus preferencias
                </p>
              </div>

              {/* Mobile: Search and Filters button - Hacerlos más compactos */}
              <div className="flex flex-col gap-2 sm:hidden">
                <Skeleton className="rounded-xl h-10 w-full"></Skeleton>
                <Skeleton className="rounded-xl h-10 w-full"></Skeleton>
              </div>

              {/* Desktop: Search */}
              <Skeleton className="hidden sm:block mb-4 sm:mb-6 rounded-xl h-12 w-full"></Skeleton>

              {/* Filters - solo desktop */}
              <FilterSections />
            </div>
          </div>

          {/* Grid de psicólogos - Pasar count como prop para flexibilidad */}
          <div className="flex-1">
            <PsychologistGrid count={6} />
          </div>
        </div>
      </div>
    </div>
  );
});

export default ReservarCitaLoading;
