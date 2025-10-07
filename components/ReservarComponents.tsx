"use client";
import { PsicologoFilters, PsicologoPreviewData } from "@/interface";
import ReservarComponentSearch from "./ReservarComponentSearch";
import ReservarPsiPreview from "./ReservarPsiPreview";
import { Dispatch, SetStateAction, useEffect, useState, useRef, useCallback, useMemo, memo } from "react";
import Pagination from "./ui/Pagination";

interface Props {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  currentPage: number;
  setPage: Dispatch<SetStateAction<number>>;
  data: PsicologoPreviewData[];
  onFilterChange: (filters: PsicologoFilters, searchTerm?: string) => void;
  lastPage: number;
}

// Componente memoizado para el header con animaciones reducidas en móvil
const HeroHeader = memo(() => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#634AE2] via-[#9494F3] to-[#7B5FE8] dark:from-purple-900 dark:via-indigo-800 dark:to-blue-900 py-12 md:py-20">
      {/* Animaciones solo en desktop para ahorrar recursos */}
      {!isMobile && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/10 dark:bg-black/30"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
            La mejor inversión es en ti mismo
          </h1>

          <h2 className="text-xl md:text-3xl font-semibold text-white/90 mb-3 md:mb-4">
            ¡Comienza tu proceso hoy!
          </h2>

          <p className="text-lg md:text-2xl text-white/80 mb-6 md:mb-8 max-w-3xl mx-auto">
            Agenda tu sesión con un psicólogo en línea, fácil, seguro y privado
          </p>

          <div className="flex flex-wrap justify-center gap-3 md:gap-6 text-white/80">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 md:px-4 py-1.5 md:py-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs md:text-sm font-medium">Profesionales certificados</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 md:px-4 py-1.5 md:py-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs md:text-sm font-medium">100% confidencial</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 md:px-4 py-1.5 md:py-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs md:text-sm font-medium">Primera sesión gratuita</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

HeroHeader.displayName = "HeroHeader";

// Componente memoizado para el mensaje de "no results"
const NoResultsMessage = memo(({ onClearFilters }: { onClearFilters: () => void }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8 md:p-12 text-center">
    <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
      <svg className="w-10 h-10 md:w-12 md:h-12 text-purple-500 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.463.898-6.05 2.373a4 4 0 014.33-4.33 7.957 7.957 0 013.44 0 4 4 0 014.33 4.33A7.962 7.962 0 0118 13.291z" />
      </svg>
    </div>
    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3">
      No se encontraron psicólogos
    </h3>
    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-4 md:mb-6 max-w-md mx-auto">
      Intenta ajustar tus filtros de búsqueda para encontrar el profesional ideal para ti.
    </p>
    <button
      onClick={onClearFilters}
      className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-xl text-sm md:text-base font-semibold hover:from-purple-700 hover:to-indigo-700 transition-colors duration-300 shadow-lg active:scale-95"
    >
      Limpiar filtros
    </button>
  </div>
));

NoResultsMessage.displayName = "NoResultsMessage";

// Componente wrapper para el preview con lazy loading
const LazyPsicologoCard = memo(({ item }: { item: PsicologoPreviewData; index: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { rootMargin: '50px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="transform transition-transform duration-300 md:hover:scale-[1.02] active:scale-[0.98]"
    >
      {isVisible ? (
        <ReservarPsiPreview psicologo={item} />
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg h-64 animate-pulse" />
      )}
    </div>
  );
});

LazyPsicologoCard.displayName = "LazyPsicologoCard";

export default function ReservarComponents({
  data,
  onFilterChange,
  currentPage,
  setPage,
  lastPage,
  setSearchTerm,
}: Props) {
  const [filters, setFilters] = useState({
    pais: [] as string[],
    genero: [] as string[],
    idioma: [] as string[],
    enfoque: [] as string[],
  });

  const sectionTopRef = useRef<HTMLDivElement>(null);
  const filterTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detectar móvil para ajustar debounce
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    const resizeHandler = () => {
      // Throttle resize events
      if (!filterTimeoutRef.current) {
        filterTimeoutRef.current = setTimeout(() => {
          checkMobile();
          filterTimeoutRef.current = null;
        }, 200);
      }
    };

    window.addEventListener('resize', resizeHandler, { passive: true });
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

  // Debounce más largo en móvil para ahorrar recursos
  const debounceTime = isMobile ? 500 : 300;

  // Debounced filter change para evitar múltiples llamadas
  const debouncedFilterChange = useCallback(
    (newFilters: { pais: string[]; genero: string[]; idioma: string[]; enfoque: string[] }, searchTerm?: string) => {
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }

      filterTimeoutRef.current = setTimeout(() => {
        onFilterChange(newFilters as PsicologoFilters, searchTerm);
      }, debounceTime);
    },
    [onFilterChange, debounceTime]
  );

  useEffect(() => {
    debouncedFilterChange(filters);

    return () => {
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }
    };
  }, [filters, debouncedFilterChange]);

  // Scroll optimizado - instantáneo en móvil para ahorrar recursos
  const scrollToSection = useCallback(() => {
    if (sectionTopRef.current) {
      if (isMobile) {
        // Scroll instantáneo en móvil
        sectionTopRef.current.scrollIntoView({ block: "start" });
      } else {
        // Scroll suave en desktop
        requestAnimationFrame(() => {
          sectionTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    }
  }, [isMobile]);

  // Handlers memoizados
  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
    debouncedFilterChange(filters, term);
  }, [setSearchTerm, debouncedFilterChange, filters]);

  const handlePrevious = useCallback(() => {
    setPage((prev) => Math.max(prev - 1, 1));
    scrollToSection();
  }, [setPage, scrollToSection]);

  const handleNext = useCallback(() => {
    setPage((prev) => prev + 1);
    scrollToSection();
  }, [setPage, scrollToSection]);

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setFilters({
      pais: [],
      genero: [],
      idioma: [],
      enfoque: [],
    });
  }, [setSearchTerm]);

  // Memoizar el renderizado de la lista para evitar re-renders
  const psychologistGrid = useMemo(() => {
    if (data.length === 0) return null;

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 md:gap-8">
          {data.map((item, index) => (
            <LazyPsicologoCard key={`psicologo-${index}`} item={item} index={index} />
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          onPrevious={handlePrevious}
          onNext={handleNext}
          totalPages={lastPage}
        />
      </>
    );
  }, [data, currentPage, handlePrevious, handleNext, lastPage]);

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900">
      <HeroHeader />

      <div ref={sectionTopRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
          <div className="lg:w-80 flex-shrink-0">
            <ReservarComponentSearch
              onSearchChange={handleSearchChange}
              setFilters={setFilters}
            />
          </div>

          <div className="flex-1">
            {data.length > 0 ? (
              psychologistGrid
            ) : (
              <NoResultsMessage onClearFilters={handleClearFilters} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}