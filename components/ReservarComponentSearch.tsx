import React, { Dispatch, SetStateAction, useCallback, useMemo, useState, useEffect, useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Icons } from "@/icons";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

// Mover fuera del componente para evitar recreación
const FILTER_OPTIONS = {
  pais: [
    { nombre: "México", valor: "MX" },
    { nombre: "Colombia", valor: "CO" },
    { nombre: "Argentina", valor: "AR" },
    { nombre: "Perú", valor: "PE" },
    { nombre: "Chile", valor: "CL" },
  ],
  genero: [
    { nombre: "Femenino", valor: "femenino" },
    { nombre: "Masculino", valor: "masculino" },
  ],
  idioma: [
    { nombre: "Español", valor: "es" },
    { nombre: "Ingles", valor: "en" },
  ],
  enfoque: [
    { nombre: "Niños", valor: "niños" },
    { nombre: "Adolescentes", valor: "adolescentes" },
    { nombre: "Familiar", valor: "familiar" },
    { nombre: "Pareja", valor: "pareja" },
    { nombre: "Adulto", valor: "adulto" },
  ],
};

interface ReservarComponentSearchProps {
  onSearchChange: (term: string) => void;
  setFilters: Dispatch<
    SetStateAction<{
      pais: string[];
      genero: string[];
      idioma: string[];
      enfoque: string[];
    }>
  >;
}

// Pre-compilar el icono de búsqueda fuera del componente
const SearchIcon = React.memo(() => {
  const iconHtml = useMemo(() =>
    Icons.loup.replace(/<svg /, '<svg fill="currentColor" '),
    []
  );

  return (
    <span
      className="text-gray-400 dark:text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2"
      dangerouslySetInnerHTML={{ __html: iconHtml }}
      style={{ width: "1.2em", height: "1.2em" }}
    />
  );
});

SearchIcon.displayName = "SearchIcon";

// FilterSection como componente memoizado con lazy rendering para móvil
type FilterSectionProps = {
  title: string;
  filterKey: keyof typeof FILTER_OPTIONS;
  values: string[];
  onToggle: (filterKey: keyof typeof FILTER_OPTIONS, value: string) => void;
  isVisible?: boolean;
};

const FilterSection = React.memo(function FilterSection({
  title,
  filterKey,
  values,
  onToggle,
  isVisible = true,
}: FilterSectionProps) {
  // Lazy rendering para móvil - solo renderiza cuando es visible
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible && !shouldRender) {
      setShouldRender(true);
    }
  }, [isVisible, shouldRender]);

  if (!shouldRender) {
    return (
      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-100 dark:border-gray-600 min-h-[120px] animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded mb-4 w-3/4"></div>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-100 dark:border-gray-600">
      <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
        <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex-shrink-0"></div>
        {title}
      </h4>
      <div className="space-y-2">
        {FILTER_OPTIONS[filterKey].map((item) => (
          <div
            key={`${filterKey}-${item.valor}`}
            className="flex items-center space-x-3 p-1 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors duration-150"
          >
            <Checkbox
              id={`${filterKey}-${item.valor}`}
              checked={values.includes(item.valor)}
              onCheckedChange={() => onToggle(filterKey, item.valor)}
              className="text-base rounded border-2 border-gray-300 dark:border-gray-500 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-indigo-500 data-[state=checked]:border-transparent"
            />
            <label
              htmlFor={`${filterKey}-${item.valor}`}
              className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer flex-1 truncate"
            >
              {item.nombre}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
});

FilterSection.displayName = "FilterSection";

export default function ReservarComponentSearch({
  onSearchChange,
  setFilters,
}: ReservarComponentSearchProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [localFilters, setLocalFilters] = useState({
    pais: [] as string[],
    genero: [] as string[],
    idioma: [] as string[],
    enfoque: [] as string[],
  });

  // Refs CORREGIDOS con valores iniciales
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const filterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const filtersRef = useRef<HTMLDivElement>(null);

  // Estado optimizado para móvil
  const [isMobile, setIsMobile] = useState(true);
  const [touchedFilters, setTouchedFilters] = useState<Set<string>>(new Set());

  // Detectar móvil de manera más eficiente
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // Check inicial
    checkMobile();

    // Throttled resize handler para móvil
    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = setTimeout(checkMobile, 100);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  // Cerrar filtros al hacer click fuera (solo móvil)
  useEffect(() => {
    if (!isMobile || !isFiltersOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
        setIsFiltersOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isFiltersOpen]);

  // Handlers optimizados para móvil
  const handleCheckboxChange = useCallback((
    filterKey: keyof typeof FILTER_OPTIONS,
    value: string
  ) => {
    setTouchedFilters(prev => new Set(prev).add(filterKey));

    setLocalFilters((prev) => {
      const currentValues = prev[filterKey];
      const updatedValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      return {
        ...prev,
        [filterKey]: updatedValues,
      };
    });
  }, []);

  // Debounce optimizado para móvil (más largo para ahorrar batería)
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce más largo en móvil para ahorrar procesamiento
    searchTimeoutRef.current = setTimeout(() => {
      onSearchChange(term);
    }, isMobile ? 400 : 300);
  }, [onSearchChange, isMobile]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }
    };
  }, []);

  // Sincronizar filtros con el padre (con debounce en móvil)
  useEffect(() => {
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }

    filterTimeoutRef.current = setTimeout(() => {
      setFilters(localFilters);
    }, isMobile ? 200 : 100);

    return () => {
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }
    };
  }, [localFilters, setFilters, isMobile]);

  const toggleFilters = useCallback(() => {
    setIsFiltersOpen(prev => !prev);
  }, []);

  // Renderizado optimizado para móvil - solo renderizar filtros tocados o visibles
  const renderedFilterSections = useMemo(() => {
    if (isMobile && !isFiltersOpen) return null;

    const sections = [
      { key: 'pais' as const, title: "País de tu psicólogo" },
      { key: 'genero' as const, title: "Género" },
      { key: 'idioma' as const, title: "Idioma" },
      { key: 'enfoque' as const, title: "Enfoque" },
    ];

    return (
      <>
        {sections.map(({ key, title }) => (
          <FilterSection
            key={key}
            title={title}
            filterKey={key}
            values={localFilters[key]}
            onToggle={handleCheckboxChange}
            isVisible={!isMobile || touchedFilters.has(key) || isFiltersOpen}
          />
        ))}
      </>
    );
  }, [isMobile, isFiltersOpen, localFilters, handleCheckboxChange, touchedFilters]);

  // Input de búsqueda común - optimizado para móvil
  const SearchInput: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => (
    <div className={`relative ${isMobile ? 'sm:hidden' : 'hidden sm:block'} ${isMobile ? 'mb-3' : 'mb-4'}`}>
      <input
        name="nombre"
        type="text"
        placeholder="Buscar por nombre..."
        className="px-4 pl-12 text-sm sm:text-base h-11 sm:h-12 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full rounded-xl border border-gray-200 dark:border-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
        value={searchTerm}
        onChange={handleSearchChange}
        enterKeyHint="search"
        inputMode="search"
      />
      <SearchIcon />
    </div>
  );

  // Efecto para limpiar touched filters cuando se cierran los filtros en móvil
  useEffect(() => {
    if (!isFiltersOpen && isMobile) {
      const timeout = setTimeout(() => setTouchedFilters(new Set()), 300);
      return () => clearTimeout(timeout);
    }
  }, [isFiltersOpen, isMobile]);

  return (
    <div
      ref={filtersRef}
      className="w-full p-4 sm:p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-lg sm:shadow-2xl"
    >
      {/* Header optimizado para móvil */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 mb-1 sm:mb-2">
          Encuentra tu psicólogo ideal
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          Filtra por tus preferencias
        </p>
      </div>

      {/* Mobile: Search and Filters button */}
      <div className="flex flex-col gap-3 sm:hidden">
        <SearchInput isMobile />
        <button
          onClick={toggleFilters}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2.5 px-4 rounded-xl text-sm font-medium hover:from-purple-600 hover:to-indigo-600 transition-colors duration-200 w-full flex items-center justify-between gap-x-3 shadow-lg active:scale-95"
          aria-expanded={isFiltersOpen}
        >
          <span>Filtros avanzados</span>
          {isFiltersOpen ? (
            <FaChevronUp className="text-white text-sm" />
          ) : (
            <FaChevronDown className="text-white text-sm" />
          )}
        </button>
      </div>

      {/* Desktop: Search only */}
      <SearchInput />

      {/* Filters content con transición optimizada para móvil */}
      <div
        className={`
          ${isMobile ? 'overflow-hidden transition-all duration-300 ease-in-out' : 'block'}
          ${isFiltersOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
          sm:max-h-none sm:opacity-100 sm:block
          space-y-4 sm:space-y-6
        `}
        aria-hidden={isMobile && !isFiltersOpen}
      >
        {renderedFilterSections}
      </div>
    </div>
  );
}