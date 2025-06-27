"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/User/Citas/NavbarCitas";
import { TableCitas } from "@/components/User/Citas/TableCitas";
import { Citas } from "@/interface";
import { parseCookies } from "nookies";
import showToast from "@/components/ToastStyle";
import HeaderUser from "@/components/User/HeaderUser";
import { FormCita } from "@/components/User/Citas/form_cita_modal";

const INITIAL_VISIBLE_COLUMNS = [
  "codigo",
  "paciente",
  "fecha_inicio",
  "motivo",
  "estado",
  "duracion",
];

export interface Filters {
  genero: string[];
  estado: string[];
  edad: string[];
  fechaInicio: string[];
}

const FiltersInitialState: Filters = {
  genero: [],
  estado: [],
  edad: [],
  fechaInicio: [],
};

const columns = [
  { name: "Paciente", uid: "paciente", sortable: true },
  { name: "Código", uid: "codigo", sortable: true },
  { name: "Motivo", uid: "motivo", sortable: true },
  { name: "Estado", uid: "estado", sortable: true },
  { name: "Fecha de Inicio", uid: "fecha_inicio", sortable: true },
  { name: "Duración", uid: "duracion", sortable: true },
];

export default function App() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Set<React.Key>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [citas, setCitas] = useState<Citas[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(FiltersInitialState);
  const [showFormCita, setShowFormCita] = useState(false);

  // Shared function to fetch citas
  const fetchCitasData = useCallback(async (showSuccessToast: boolean = false) => {
    try {
      setError(null);
      const cookies = parseCookies();
      const token = cookies["session"];
      const url = `${process.env.NEXT_PUBLIC_API_URL}api/citas`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error(`Error: ${response.status} ${response.statusText}`);
        setError("Error al obtener las citas");
        showToast("error", "Error al obtener las citas");
        return;
      }
      
      const data = await response.json();
      console.log(data);

      if (Array.isArray(data.result)) {
        const formattedCitas = data.result.map((cita: Citas) => ({
          codigo: cita.codigo,
          paciente: cita.paciente,
          fecha_inicio: cita.fecha_inicio,
          motivo: cita.motivo,
          estado: cita.estado,
          duracion: cita.duracion,
          idCita: cita.idCita,
          genero: cita.genero,
          edad: cita.edad,
        }));
        setCitas(formattedCitas);
        
        if (showSuccessToast) {
          showToast("success", "Citas obtenidas correctamente");
        }
      } else {
        setError("Formato de respuesta inválido");
        showToast("error", "Formato de respuesta inválido");
      }
    } catch (error) {
      console.error(error);
      setError("Error al obtener las citas");
      showToast("error", "Error de conexión. Intenta nuevamente.");
    }
  }, []);

  // Initial fetch when authorized
  useEffect(() => {
    if (isAuthorized) {
      fetchCitasData(true).catch((error) => {
        console.error('Error in initial fetch:', error);
      });
    }
  }, [isAuthorized, fetchCitasData]);

  // Refresh function for modal (without success toast)
  const refreshCitas = useCallback(async () => {
    await fetchCitasData(false);
  }, [fetchCitasData]);

  const [sortDescriptor] = useState({
    column: "fecha_inicio",
    direction: "ascending",
  });

  useEffect(() => {
    const cookies = parseCookies();
    const userData = JSON.parse(localStorage.getItem("user") || "{}");

    const isAuth = userData.rol === "PSICOLOGO" || cookies["rol"] !== "admin";
    setIsAuthorized(isAuth);

    if (!isAuth) {
      router.push("/unauthorized");
    }
  }, [router]);

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    let filteredCitas = [...citas];

    // ✅ FILTRO POR GENERO
    if (filters.genero.length > 0) {
      filteredCitas = filteredCitas.filter((cita) =>
        filters.genero.includes(cita.genero)
      );
    }

    // Filtrar por edad si hay valores
    if (filters.edad.length > 0) {
      filteredCitas = filteredCitas.filter((p) => {
        return filters.edad.some((rango) => {
          const [min, max] = rango.split(" - ").map(Number);
          return p.edad >= min && p.edad <= max;
        });
      });
    }

    // Filter for estado if there are selected states
    if (filters.estado.length > 0) {
      filteredCitas = filteredCitas.filter((cita) =>
        filters.estado.includes(cita.estado)
      );
    }

    // Filter for date range if both dates are provided
    if (filters.fechaInicio.length === 2) {
      const [from, to] = filters.fechaInicio;
      const fromDate = new Date(from + "T00:00:00");
      const toDate = new Date(to + "T23:59:59");

      filteredCitas = filteredCitas.filter((cita) => {
        const citaDate = new Date(cita.fecha_inicio);
        return citaDate >= fromDate && citaDate <= toDate;
      });
    }

    //  Filter for search value if it exists
    if (hasSearchFilter) {
      filteredCitas = filteredCitas.filter((cita) =>
        cita.paciente.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    // If no filters are applied, return all citas
    return filteredCitas;
  }, [citas, filterValue, hasSearchFilter, filters]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof typeof a] as string;
      const second = b[sortDescriptor.column as keyof typeof b] as string;
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  const headerColumns = useMemo(() => {
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const onSearchChange = useCallback((value?: string) => {
    setFilterValue(value || "");
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
  }, []);
  
  const handleAddNew = () => {
    setShowFormCita(true);
  };

  if (isAuthorized === null) return null;
  return (
    <div className="bg-[#f8f8ff] dark:bg-background min-h-screen flex flex-col">
      <HeaderUser title="Lista de citas" />
      <Navbar
        filterValue={filterValue}
        filters={filters}
        setFilters={setFilters}
        onSearchChange={onSearchChange}
        onClear={onClear}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        columns={columns}
        onAddNew={handleAddNew}
        menuOpen={menuAbierto}
        setMenuOpen={setMenuAbierto}
      />
      {error ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg font-medium text-destructive dark:text-destructive">
            {error}
          </div>
        </div>
      ) : (
        <>
          {sortedItems.length > 0 ? (
            <TableCitas
              users={sortedItems}
              headerColumns={headerColumns}
              selectedKeys={selectedKeys}
              menuOpen={menuAbierto}
              setSelectedKeysAction={setSelectedKeys}
              onCitaDeleted={(idCita) => {
                setCitas((prevCitas) =>
                  prevCitas.filter(
                    (cita) => Number(cita.idCita) !== Number(idCita)
                  )
                );
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="bg-white dark:bg-card rounded-lg shadow-sm border border-gray-200 dark:border-border p-8 max-w-md w-full text-center">
                {/* Icono dinámico basado en si hay filtros activos */}
                <div className="mx-auto w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-6">
                  {filterValue ||
                  Object.values(filters).some(
                    (filter) => filter && filter.length > 0
                  ) ? (
                    // Icono de búsqueda/filtro cuando hay filtros activos
                    <svg
                      className="w-8 h-8 text-primary dark:text-primary-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  ) : (
                    // Icono de calendario cuando no hay filtros (sin citas)
                    <svg
                      className="w-8 h-8 text-primary dark:text-primary-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="12" cy="12" r="10" strokeWidth="2" />
                      <line
                        x1="15"
                        y1="9"
                        x2="9"
                        y2="15"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <line
                        x1="9"
                        y1="9"
                        x2="15"
                        y2="15"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </div>

                {/* Título dinámico */}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-foreground mb-2">
                  {filterValue ||
                  Object.values(filters).some(
                    (filter) => filter && filter.length > 0
                  )
                    ? "No se encontraron resultados"
                    : "No hay citas registradas"}
                </h3>

                {/* Descripción dinámica */}
                <p className="text-gray-600 dark:text-muted-foreground">
                  {filterValue ||
                  Object.values(filters).some(
                    (filter) => filter && filter.length > 0
                  )
                    ? "No hay citas que coincidan con los filtros aplicados. Intenta ajustar tus criterios de búsqueda."
                    : "Aún no se han programado citas médicas en el sistema."}
                </p>
              </div>
            </div>
          )}
        </>
      )}
      <FormCita
        isOpen={showFormCita}
        onCloseAction={() => setShowFormCita(false)}
        onCitaCreatedAction={() => {
          setShowFormCita(false);
          void refreshCitas();
        }}
      />
    </div>
  );
}
