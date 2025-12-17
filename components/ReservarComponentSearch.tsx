import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Icons } from "@/icons";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { Flags } from "@/utils/flagsPsicologos";

type FKey = "pais" | "genero" | "idioma" | "enfoque" | "especialidad";

interface ReservarComponentSearchProps {
  onSearchChange: (term: string) => void;
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

// === Config base ===
const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "http://127.0.0.1:8000")
    // asegura barra final única
    .replace(/\/?$/, "/");

// Pretty labels (no alteran el valor enviado al back)
const countryPrettyName: Record<string, string> = Flags.reduce(
  (acc, { value, label }) => {
    acc[value] = label;
    return acc;
  },
  {} as Record<string, string>
);

const languagePrettyName: Record<string, string> = {
  es: "Español",
  en: "Inglés",
  fr: "Francés",
  pt: "Portugués",
  it: "Italiano",
  de: "Alemán",
};

type Option = { nombre: string; valor: string };
type FilterOptions = Record<FKey, Option[]>;

const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

const normalize = (arr?: string[]) =>
  Array.from(
    new Set(
      (arr ?? [])
        .map((v) => (v ?? "").toString().trim())
        .filter((v) => v.length > 0)
    )
  );

const toPairs = (arr: string[], pretty?: (v: string) => string): Option[] =>
  (arr || [])
    .map((v) => ({ valor: v, nombre: pretty ? pretty(v) : v }))
    .filter((o) => o.valor && o.nombre)
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

// --- Fetch filtros base (pais/genero/idioma/enfoque/especialidad) ---
async function fetchFilterOptionsBase(): Promise<{
  paises: string[];
  generos: string[];
  idiomas: string[];
  enfoques: string[];
  especialidades: string[];
}> {
  const candidates = [
    `${API_BASE}api/psicologos/filter-options`,
    `${API_BASE}api/psicologos/filters`,
    `${API_BASE}api/psicologos/getFilterOptions`,
  ];

  let lastErr: any = null;
  for (const url of candidates) {
    try {
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      console.log("[filters] GET", url, "->", res.status, res.ok);
      if (!res.ok) {
        lastErr = new Error(`HTTP ${res.status} on ${url}`);
        continue;
      }

      const raw = await res.json();
      console.log("[filters] body:", raw);

      // Detecta payload
      const payload =
        (raw && typeof raw === "object" && (raw.data ?? raw.result)) ?? raw ?? {};

      // Admite arrays o colecciones estilo Laravel
      const pick = (obj: any, key: string) => {
        const val = obj?.[key];
        if (Array.isArray(val)) return val;
        // Si viene como Collection {0:'PE',1:'MX',...}
        if (val && typeof val === "object" && !Array.isArray(val)) {
          const arr = Object.values(val);
          return Array.isArray(arr) ? arr : [];
        }
        return [];
      };

      const paises = pick(payload, "paises");
      const generos = pick(payload, "generos");
      const idiomas = pick(payload, "idiomas");
      const enfoques = pick(payload, "enfoques");
      const especialidades = pick(payload, "especialidades");

      // Si al menos una key trae algo, damos por válido
      if (
        paises.length +
        generos.length +
        idiomas.length +
        enfoques.length +
        especialidades.length >
        0
      ) {
        return { paises, generos, idiomas, enfoques, especialidades };
      }

      // Otra forma: payload podría ser {paises:[...], ...} directamente
      if (
        Array.isArray(payload?.paises) ||
        Array.isArray(payload?.generos) ||
        Array.isArray(payload?.idiomas) ||
        Array.isArray(payload?.enfoques) ||
        Array.isArray(payload?.especialidades)
      ) {
        return {
          paises: payload?.paises ?? [],
          generos: payload?.generos ?? [],
          idiomas: payload?.idiomas ?? [],
          enfoques: payload?.enfoques ?? [],
          especialidades: payload?.especialidades ?? [],
        };
      }

      lastErr = new Error("Formato de respuesta no reconocido en " + url);
    } catch (e) {
      console.error("[filters] error on", url, e);
      lastErr = e;
    }
  }
  throw lastErr ?? new Error("No se pudo obtener filter-options");
}

export default function ReservarComponentSearch({
  onSearchChange,
  setFilters,
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

  const [localFilters, setLocalFilters] = useState<Record<FKey, string[]>>({
    pais: [],
    genero: [],
    idioma: [],
    enfoque: [],
    especialidad: [],
  });

  const [loadingBase, setLoadingBase] = useState(true);
  const [errBase, setErrBase] = useState<string | null>(null);

  // 1) Cargar filtros base (pais/genero/idioma/enfoque/especialidad)
  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoadingBase(true);
        setErrBase(null);
        const {
          paises,
          generos,
          idiomas,
          enfoques,
          especialidades,
        } = await fetchFilterOptionsBase();

        setFilterOptions((prev) => ({
          ...prev,
          pais: toPairs(normalize(paises), (v) => countryPrettyName[v] ?? v),
          genero: toPairs(normalize(generos), (v) => cap(v)),
          idioma: toPairs(
            normalize(idiomas),
            (v) => languagePrettyName[v] ?? v
          ),
          enfoque: toPairs(normalize(enfoques), (v) => cap(v)),
          especialidad: toPairs(normalize(especialidades)), // viene del mismo endpoint
        }));
      } catch (e: any) {
        if (e?.name !== "AbortError") {
          setErrBase("No se pudieron cargar los filtros.");
        }
      } finally {
        setLoadingBase(false);
      }
    })();
    return () => ac.abort();
  }, []);

  // 2) Propagar cambios al padre
  useEffect(() => {
    setFilters({
      pais: localFilters.pais,
      genero: localFilters.genero,
      idioma: localFilters.idioma,
      enfoque: localFilters.enfoque,
      especialidad: localFilters.especialidad,
    });
  }, [localFilters, setFilters]);

  // 3) Handlers
  const toggleFilters = () => setIsFiltersOpen((v) => !v);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearchChange(term);
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

  // 4) Render sección (usa loadingBase / errBase para todas)
  const renderFilterSection = (
    title: string,
    filterKey: FKey,
    loading: boolean,
    err: string | null
  ) => {
    const list = filterOptions[filterKey] || [];

    if (loading) {
      return (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-100 dark:border-gray-600">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
            {title}
          </h4>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3 p-2">
              <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 animate-pulse"></div>
            </div>
          ))}
        </div>
      );
    }

    if (err) {
      return (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-100 dark:border-gray-600">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            {title}
          </h4>
          <p className="text-sm text-red-600">{err}</p>
        </div>
      );
    }

    if (!list.length) return null;

    return (
      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-100 dark:border-gray-600 hover:border-gray-200 dark:hover:border-gray-500 transition-colors duration-300">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
          {title}
        </h4>
        <div className="space-y-3">
          {list.map((item, idx) => (
            <div
              key={`${filterKey}-${item.valor}-${idx}`}
              className="flex items-center space-x-3 p-2 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
            >
              <Checkbox
                id={`${filterKey}-${idx}`}
                checked={(localFilters[filterKey] || []).includes(item.valor)}
                onCheckedChange={() =>
                  handleCheckboxChange(filterKey, item.valor)
                }
                className="text-lg rounded-md border-2 border-gray-300 dark:border-gray-500 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-indigo-500 data-[state=checked]:border-transparent"
              />
              <label
                htmlFor={`${filterKey}-${idx}`}
                className="text-base font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200 flex-1"
              >
                {item.nombre}
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 5) UI
  const filtersContent = useMemo(() => {
    return (
      <>
        {renderFilterSection("País de tu psicólogo", "pais", loadingBase, errBase)}
        {renderFilterSection("Género", "genero", loadingBase, errBase)}
        {renderFilterSection("Idioma", "idioma", loadingBase, errBase)}
        {renderFilterSection("Enfoque", "enfoque", loadingBase, errBase)}
        {renderFilterSection(
          "Especialidad",
          "especialidad",
          loadingBase,
          errBase
        )}
      </>
    );
  }, [filterOptions, localFilters, loadingBase, errBase]);

  return (
    <div className="w-full p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-2xl">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          Encuentra tu psicólogo ideal
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Filtra por tus preferencias
        </p>
      </div>

      {/* Mobile: Search + Toggle */}
      <div className="flex flex-col gap-4 sm:hidden">
        <div className="relative">
          <input
            name="nombre"
            type="text"
            placeholder="Buscar por nombre..."
            className="px-4 pl-12 text-base h-12 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-gray-100 transition-all duration-300"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <span
            className="text-gray-400 dark:text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors"
            dangerouslySetInnerHTML={{
              __html: Icons.loup.replace(
                /<svg /,
                '<svg fill="currentColor" '
              ),
            }}
            style={{ width: "1.2em", height: "1.2em" }}
          />
        </div>

        <button
          onClick={toggleFilters}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 px-6 rounded-xl text-base font-medium hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 w-full flex items-center justify-between gap-x-4 shadow-lg hover:shadow-xl transform hover:scale-[1.02] dark:shadow-purple-900/50"
        >
          <span>Filtros avanzados</span>
          {isFiltersOpen ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>

      {/* Desktop: Search */}
      <div className="hidden sm:block">
        <div className="relative mb-6">
          <input
            name="nombre"
            type="text"
            placeholder="Buscar por nombre..."
            className="px-4 pl-12 text-base h-12 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-gray-100 transition-all duration-300"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <span
            className="text-gray-400 dark:text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors"
            dangerouslySetInnerHTML={{
              __html: Icons.loup.replace(
                /<svg /,
                '<svg fill="currentColor" '
              ),
            }}
            style={{ width: "1.2em", height: "1.2em" }}
          />
        </div>
      </div>

      {/* Filters content */}
      <div className={`${isFiltersOpen ? "block" : "hidden"} sm:block space-y-6`}>
        {filtersContent}
      </div>
    </div>
  );
}
