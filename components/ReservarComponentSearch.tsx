import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Icons } from "@/icons";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

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
  // 🔄 ESPECIALIDADES: Ahora es un array vacío que se llenará desde el backend
  especialidad: [] as { nombre: string; valor: string }[],
};

// 🔄 TEMPORAL: Función con debug completo
async function GetEspecialidades(): Promise<{ nombre: string; valor: string }[]> {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}api/especialidades`;
    console.log('🔄 [GetEspecialidades] Iniciando petición...');
    console.log('🔍 [GetEspecialidades] URL completa:', apiUrl);
    console.log('🔍 [GetEspecialidades] NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
    
    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    console.log('📡 [GetEspecialidades] Response Status:', res.status);
    console.log('📡 [GetEspecialidades] Response OK:', res.ok);
    console.log('📡 [GetEspecialidades] Response URL:', res.url);
    
    if (!res.ok) {
      console.error('❌ [GetEspecialidades] HTTP Error:', res.status, res.statusText);
      throw new Error(`HTTP error! status: ${res.status} - ${res.statusText}`);
    }

    const data = await res.json();
    console.log('📊 [GetEspecialidades] Respuesta completa recibida:', data);
    console.log('🔍 [GetEspecialidades] Tipo de data:', typeof data);
    console.log('🔍 [GetEspecialidades] Keys de data:', Object.keys(data));
    console.log('🔍 [GetEspecialidades] Es array?:', Array.isArray(data));
    
    if (data && typeof data === 'object') {
      console.log('🔍 [GetEspecialidades] Propiedades del objeto:');
      Object.keys(data).forEach(key => {
        console.log(`   - ${key}:`, data[key], `(tipo: ${typeof data[key]}, es array: ${Array.isArray(data[key])})`);
      });
    }
    
    // Probar diferentes formatos de respuesta
    let especialidadesData = [];
    
    if (data.status_code === 200 && data.data && Array.isArray(data.data)) {
      console.log('✅ [GetEspecialidades] Formato detectado: { status_code: 200, data: [...] }');
      especialidadesData = data.data;
    } else if (Array.isArray(data)) {
      console.log('✅ [GetEspecialidades] Formato detectado: [...] (array directo)');
      especialidadesData = data;
    } else if (data.result && Array.isArray(data.result)) {
      console.log('✅ [GetEspecialidades] Formato detectado: { result: [...] }');
      especialidadesData = data.result;
    } else if (data.especialidades && Array.isArray(data.especialidades)) {
      console.log('✅ [GetEspecialidades] Formato detectado: { especialidades: [...] }');
      especialidadesData = data.especialidades;
    } else if (data.status_message === "OK" && data.result && Array.isArray(data.result)) {
      console.log('✅ [GetEspecialidades] Formato detectado: { status_message: "OK", result: [...] }');
      especialidadesData = data.result;
    } else {
      console.log('🔍 [GetEspecialidades] Buscando arrays en la respuesta...');
      // Buscar cualquier array en la respuesta
      const arrays = Object.values(data).filter(value => Array.isArray(value));
      console.log('🔍 [GetEspecialidades] Arrays encontrados:', arrays.length);
      
      if (arrays.length > 0) {
        especialidadesData = arrays[0];
        console.log('✅ [GetEspecialidades] Usando primer array encontrado:', arrays[0]);
      } else {
        console.log('❌ [GetEspecialidades] No se encontraron arrays en la respuesta');
        console.log('🔍 [GetEspecialidades] Data completa para análisis:', JSON.stringify(data, null, 2));
      }
    }
    
    console.log('🔢 [GetEspecialidades] Especialidades extraídas:', especialidadesData);
    console.log('🔢 [GetEspecialidades] Cantidad de especialidades:', especialidadesData.length);
    
    if (especialidadesData.length > 0) {
      // Formatear las especialidades
      const formatted = especialidadesData.map((esp: any, index: number) => {
        console.log(`🔍 [GetEspecialidades] Procesando especialidad ${index}:`, esp);
        
        // Manejar diferentes estructuras de objeto
        const nombre = esp.nombre || esp.name || esp.especialidad || esp;
        const valor = esp.valor || esp.value || esp.id || nombre;
// ELIMINA completamente la normalización que convierte espacios a guiones
        
        const result = {
          nombre: typeof nombre === 'string' ? nombre : String(nombre),
          valor: typeof valor === 'string' ? valor : String(valor)
        };
        
        console.log(`🔍 [GetEspecialidades] Especialidad ${index} formateada:`, result);
        return result;
      });
      
      console.log('✨ [GetEspecialidades] Especialidades finales formateadas:', formatted);
      return formatted;
    }
    
    console.error('❌ [GetEspecialidades] No se pudieron extraer especialidades');
    throw new Error("No se pudieron extraer especialidades de la respuesta");
  } catch (error) {
    console.error("💥 [GetEspecialidades] Error completo:", error);
    throw error;
  }
}

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

export default function ReservarComponentSearch({
  onSearchChange,
  setFilters,
}: ReservarComponentSearchProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOptions, setFilterOptions] = useState(FILTER_OPTIONS);
  const [isLoadingEspecialidades, setIsLoadingEspecialidades] = useState(true);
  const [localFilters, setLocalFilters] = useState({
    pais: [] as string[],
    genero: [] as string[],
    idioma: [] as string[],
    enfoque: [] as string[],
    especialidad: [] as string[],
  });

  // 🔄 CORREGIDO: Usar la función de la API
  useEffect(() => {
    const loadEspecialidades = async () => {
      try {
        setIsLoadingEspecialidades(true);
        console.log('🔄 [Componente] Iniciando carga de especialidades...');
        
        const especialidades = await GetEspecialidades();
        
        console.log('✅ [Componente] Especialidades cargadas exitosamente:', especialidades);
        
        setFilterOptions(prev => ({
          ...prev,
          especialidad: especialidades
        }));
      } catch (error) {
        console.error('💥 [Componente] Error cargando especialidades:', error);
        // Usar especialidades por defecto si hay error
        console.log('🔄 [Componente] Usando especialidades por defecto...');
        setFilterOptions(prev => ({
          ...prev,
          especialidad: [
            { nombre: "Cognitivo-conductual", valor: "cognitivo-conductual" },
            { nombre: "Gestalt humanista", valor: "gestalt-humanista" },
            { nombre: "Neuropsicología", valor: "neuropsicologia" },
            { nombre: "Psicoanálisis", valor: "psicoanalisis" },
            { nombre: "Psicología Deportiva", valor: "psicologia-deportiva" },
            { nombre: "Psicologia Familiar", valor: "psicologia-familiar" },
            { nombre: "Psicología forense", valor: "psicologia-forense" },
            { nombre: "Psicopedagogía", valor: "psicopedagogia" },
          ]
        }));
      } finally {
        setIsLoadingEspecialidades(false);
        console.log('✅ [Componente] Carga de especialidades finalizada');
      }
    };

    loadEspecialidades();
  }, []);

  const handleCheckboxChange = (
    filterKey: keyof typeof FILTER_OPTIONS,
    value: string
  ) => {
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
  };

  useEffect(() => {
    console.log('🔍 [Componente] Filtros actualizados:', localFilters);
  console.log('🔍 [Componente] Especialidades seleccionadas:', localFilters.especialidad);
    setFilters(localFilters);
  }, [localFilters, setFilters]);

  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearchChange(term);
  };

  const renderFilterSection = (
    title: string,
    filterKey: keyof typeof FILTER_OPTIONS
  ) => (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-100 dark:border-gray-600 hover:border-gray-200 dark:hover:border-gray-500 transition-colors duration-300">
      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
        {title}
      </h4>
      <div className="space-y-3">
        {filterKey === 'especialidad' && isLoadingEspecialidades ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-3 p-2">
              <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 animate-pulse"></div>
            </div>
          ))
        ) : filterOptions[filterKey].length > 0 ? (
          filterOptions[filterKey].map((item, index) => (
            <div
              key={`${filterKey}-${index}`}
              className="flex items-center space-x-3 p-2 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
            >
              <Checkbox
                id={`${filterKey}-${index}`}
                checked={localFilters[filterKey].includes(item.valor)}
                onCheckedChange={() =>
                  handleCheckboxChange(filterKey, item.valor)
                }
                className="text-lg rounded-md border-2 border-gray-300 dark:border-gray-500 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-indigo-500 data-[state=checked]:border-transparent"
              />
              <label
                htmlFor={`${filterKey}-${index}`}
                className="text-base font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200 flex-1"
              >
                {item.nombre}
              </label>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
            No hay opciones disponibles
          </p>
        )}
      </div>
    </div>
  );

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
      {/* Mobile: Search and Filters button */}
      <div className="flex flex-col gap-4 sm:hidden">
        <div className="relative">
          <input
            name="nombre"
            type="text"
            placeholder="Buscar por nombre..."
            className="px-4 pl-12 text-base h-12 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-gray-100 transition-all duration-300"
            value={searchTerm}
            onChange={handleSearchChange}
          />{" "}
          <span
            className="text-gray-400 dark:text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors"
            dangerouslySetInnerHTML={{
              __html: Icons.loup.replace(/<svg /, '<svg fill="currentColor" '),
            }}
            style={{
              width: "1.2em",
              height: "1.2em",
            }}
          />
        </div>{" "}
        <button
          onClick={toggleFilters}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 px-6 rounded-xl text-base font-medium hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 w-full flex items-center justify-between gap-x-4 shadow-lg hover:shadow-xl transform hover:scale-[1.02] dark:shadow-purple-900/50"
        >
          <span>Filtros avanzados</span>
          {isFiltersOpen ? (
            <FaChevronUp className="text-white" />
          ) : (
            <FaChevronDown className="text-white" />
          )}
        </button>
      </div>{" "}
      {/* Desktop: Search only (filters always visible) */}
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
              __html: Icons.loup.replace(/<svg /, '<svg fill="currentColor" '),
            }}
            style={{
              width: "1.2em",
              height: "1.2em",
            }}
          />
        </div>
      </div>
      {/* Filters content */}
      <div
        className={`${isFiltersOpen ? "block" : "hidden"} sm:block space-y-6`}
      >
        {renderFilterSection("País de tu psicólogo", "pais")}
        {renderFilterSection("Género", "genero")}
        {renderFilterSection("Idioma", "idioma")}
        {renderFilterSection("Enfoque", "enfoque")}
        {/* 🔄 ESPECIALIDADES: Ahora se cargan dinámicamente desde el backend correcto */}
        {renderFilterSection("Especialidad", "especialidad")}
      </div>
    </div>
  );
}