"use client";
// 1. Agregamos useEffect para la sincronización
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Icons } from "@/icons";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { Flags } from "@/utils/flagsPsicologos";

type FKey = "pais" | "genero" | "idioma" | "enfoque" | "especialidad";

interface ReservarComponentSearchProps {
  onSearchChange: (term: string) => void;
  //  Agregamos initialFilters a las Props
  initialFilters?: {
    pais: string[];
    genero: string[];
    idioma: string[];
    enfoque: string[];
    especialidad: string[];
  };
  setFilters: Dispatch<
    SetStateAction<{
      pais: string[];
      genero: string[];
      idioma: string[];
      enfoque: string[];
      especialidad: string[];
    }>
  >;
}

// ... (Config base y funciones auxiliares se mantienen igual)
const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000").replace(/\/?$/, "/");
const countryPrettyName: Record<string, string> = Flags.reduce((acc, { value, label }) => { acc[value] = label; return acc; }, {} as Record<string, string>);
const languagePrettyName: Record<string, string> = { es: "Español", en: "Inglés", fr: "Francés", pt: "Portugués", it: "Italiano", de: "Alemán" };
type Option = { nombre: string; valor: string };
type FilterOptions = Record<FKey, Option[]>;
const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");
const normalize = (arr?: string[]) => Array.from(new Set((arr ?? []).map((v) => (v ?? "").toString().trim()).filter((v) => v.length > 0)));
const toPairs = (arr: string[], pretty?: (v: string) => string): Option[] => (arr || []).map((v) => ({ valor: v, nombre: pretty ? pretty(v) : v })).filter((o) => o.valor && o.nombre).sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

async function fetchFilterOptionsBase() {
    // ... (Mantenemos tu lógica de fetch intacta)
    const candidates = [`${API_BASE}api/psicologos/filter-options`, `${API_BASE}api/psicologos/filters`, `${API_BASE}api/psicologos/getFilterOptions` ];
    let lastErr: any = null;
    for (const url of candidates) {
        try {
            const res = await fetch(url, { headers: { Accept: "application/json" } });
            if (!res.ok) continue;
            const raw = await res.json();
            const payload = (raw && typeof raw === "object" && (raw.data ?? raw.result)) ?? raw ?? {};
            const pick = (obj: any, key: string) => {
                const val = obj?.[key];
                if (Array.isArray(val)) return val;
                if (val && typeof val === "object") return Object.values(val);
                return [];
            };
            return {
                paises: pick(payload, "paises"),
                generos: pick(payload, "generos"),
                idiomas: pick(payload, "idiomas"),
                enfoques: pick(payload, "enfoques"),
                especialidades: pick(payload, "especialidades"),
            };
        } catch (e) { lastErr = e; }
    }
    throw lastErr;
}

export default function ReservarComponentSearch({
  onSearchChange,
  setFilters,
  initialFilters, //  Recibimos los filtros iniciales
}: ReservarComponentSearchProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    pais: [],
    genero: [],
    idioma: [],
    enfoque: [],
    especialidad: [],
  });

  //  Inicializamos localFilters con initialFilters si existen
  const [localFilters, setLocalFilters] = useState<Record<FKey, string[]>>({
    pais: initialFilters?.pais || [],
    genero: initialFilters?.genero || [],
    idioma: initialFilters?.idioma || [],
    enfoque: initialFilters?.enfoque || [],
    especialidad: initialFilters?.especialidad || [],
  });

  const [loadingBase, setLoadingBase] = useState(true);
  const [errBase, setErrBase] = useState<string | null>(null);

  //  NUEVO: Sincronizar cuando la URL cambie (por ejemplo si el usuario navega entre servicios)
  useEffect(() => {
    if (initialFilters) {
      setLocalFilters({
        pais: initialFilters.pais || [],
        genero: initialFilters.genero || [],
        idioma: initialFilters.idioma || [],
        enfoque: initialFilters.enfoque || [],
        especialidad: initialFilters.especialidad || [],
      });
    }
  }, [initialFilters]);

  // 1) Cargar opciones de la API
  useEffect(() => {
    (async () => {
      try {
        setLoadingBase(true);
        const { paises, generos, idiomas, enfoques, especialidades } = await fetchFilterOptionsBase();
        setFilterOptions({
          pais: toPairs(normalize(paises), (v) => countryPrettyName[v] ?? v),
          genero: toPairs(normalize(generos), (v) => cap(v)),
          idioma: toPairs(normalize(idiomas), (v) => languagePrettyName[v] ?? v),
          enfoque: toPairs(normalize(enfoques), (v) => cap(v)),
          especialidad: toPairs(normalize(especialidades)),
        });
      } catch (e) {
        setErrBase("No se pudieron cargar los filtros.");
      } finally {
        setLoadingBase(false);
      }
    })();
  }, []);

  // 2) Propagar cambios al padre (ya estaba bien)
  useEffect(() => {
    setFilters(localFilters);
  }, [localFilters, setFilters]);

  // 3) Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearchChange(e.target.value);
  };

  const handleCheckboxChange = (filterKey: FKey, value: string) => {
    setLocalFilters((prev) => {
      const current = prev[filterKey] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [filterKey]: updated };
    });
  };

  const toggleFilters = () => setIsFiltersOpen((v) => !v);

  // 4) Render sección
  const renderFilterSection = (title: string, filterKey: FKey, loading: boolean, err: string | null) => {
    const list = filterOptions[filterKey] || [];
    if (loading) return <div className="p-4 animate-pulse bg-gray-100 rounded-xl mb-4 h-32" />;
    if (err) return <p className="text-red-500 p-4">{err}</p>;
    if (!list.length) return null;

    return (
      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-100 dark:border-gray-600 mb-4">
        <span className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
          {title}
        </span>
        <div className="space-y-3">
          {list.map((item, idx) => (
            <div key={`${filterKey}-${item.valor}`} className="flex items-center space-x-3 p-2 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors">
              <Checkbox
                id={`${filterKey}-${idx}`}
                // ✅ Aquí se mantiene sincronizado con el estado local
                checked={localFilters[filterKey].includes(item.valor)}
                onCheckedChange={() => handleCheckboxChange(filterKey, item.valor)}
              />
              <label htmlFor={`${filterKey}-${idx}`} className="text-base font-medium text-gray-700 dark:text-gray-300 cursor-pointer flex-1">
                {item.nombre}
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const filtersContent = useMemo(() => (
    <>
      {renderFilterSection("País de tu psicólogo", "pais", loadingBase, errBase)}
      {renderFilterSection("Género", "genero", loadingBase, errBase)}
      {renderFilterSection("Idioma", "idioma", loadingBase, errBase)}
      {renderFilterSection("Enfoque", "enfoque", loadingBase, errBase)}
      {renderFilterSection("Especialidad", "especialidad", loadingBase, errBase)}
    </>
  ), [filterOptions, localFilters, loadingBase, errBase]);

  return (
    <div className="w-full p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-2xl">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Encuentra tu psicólogo ideal</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">Filtra por tus preferencias</p>
      </div>

      {/* Input de búsqueda (se mantiene igual) */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          className="px-4 pl-12 text-base h-12 w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" 
              dangerouslySetInnerHTML={{ __html: Icons.loup.replace(/<svg /, '<svg fill="currentColor" ') }} 
              style={{ width: "1.2em", height: "1.2em" }} />
      </div>

      <button onClick={toggleFilters} className="sm:hidden mb-4 w-full flex justify-between items-center bg-gray-100 p-3 rounded-lg">
        <span>Filtros avanzados</span>
        {isFiltersOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      <div className={`${isFiltersOpen ? "block" : "hidden"} sm:block space-y-6`}>
        {filtersContent}
      </div>
    </div>
  );
}