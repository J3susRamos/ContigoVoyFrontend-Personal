"use client";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/User/Citas/NavbarCitas";
import { TableCitas } from "@/components/User/Citas/TableCitas";
import CerrarSesion from "@/components/CerrarSesion";
import { Citas } from "@/interface";
import { parseCookies } from "nookies";
import showToast from "@/components/ToastStyle";

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

const FiltersInitialState = {
  genero: [] as string[],
  estado: [] as string[],
  edad: [] as string[],
  fechaInicio: [] as string[],
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
  const [citas, setCitas] = useState<Citas[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(FiltersInitialState);

  const handleGetCitas = useCallback(async () => {
    try {
      setError(null);
      const cookies = parseCookies(); // Move parseCookies inside the function
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

      if (Array.isArray(data.result)) {
        const formattedCitas = data.result.map((cita: Citas) => ({
          codigo: cita.codigo,
          paciente: cita.paciente,
          fecha_inicio: cita.fecha_inicio,
          motivo: cita.motivo,
          estado: cita.estado,
          duracion: cita.duracion,
          idCita: cita.idCita,
        }));
        setCitas(formattedCitas);
        showToast("success", "Citas obtenidas correctamente");
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

  useEffect(() => {
    const fetchCitas = async () => {
      if (isAuthorized) {
        await handleGetCitas();
      }
    };
    
    fetchCitas().catch(error => {
      console.error("Error fetching citas:", error);
    });
  }, [isAuthorized, handleGetCitas]);

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

    // Filtro por estado
    if (filters.estado.length > 0) {
      filteredCitas = filteredCitas.filter((cita) =>
        filters.estado.includes(cita.estado)
      );
    }

    // Filtro por fecha de inicio
    if (filters.fechaInicio.length === 2) {
      const [from, to] = filters.fechaInicio;
      const fromDate = new Date(from + "T00:00:00");
      const toDate = new Date(to + "T23:59:59");

      filteredCitas = filteredCitas.filter((cita) => {
        const citaDate = new Date(cita.fecha_inicio);
        return citaDate >= fromDate && citaDate <= toDate;
      });
    }

    // Filtro por texto en paciente
    if (hasSearchFilter) {
      filteredCitas = filteredCitas.filter((cita) =>
        cita.paciente.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

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
  console.log(sortedItems);

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

  if (isAuthorized === null) return null;
  return (
    <div className="bg-[#f8f8ff] dark:bg-background min-h-screen flex flex-col">
      <header className="mt-4 z-30 px-4">
        <div className="flex items-start justify-between w-[calc(95vw-270px)] mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold text-primary dark:text-primary-foreground">
            Lista de Citas
          </h1>
          <div className="flex gap-x-5 mt-2">
            <CerrarSesion />
          </div>
        </div>
      </header>

      <div>
        <Navbar
          filterValue={filterValue}
          filters={filters}
          setFilters={setFilters}
          onSearchChange={onSearchChange}
          onClear={onClear}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
          columns={columns}
          onAddNew={() => {}}
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
                  {(filterValue || Object.values(filters).some(filter => filter && filter.length > 0)) ? (
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
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 9a2 2 0 01-2-2V9a2 2 0 012-2h8a2 2 0 012 2v7a2 2 0 01-2 2H10z" 
                      />
                    </svg>
                  )}
                </div>
                
                {/* Título dinámico */}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-foreground mb-2">
                  {(filterValue || Object.values(filters).some(filter => filter && filter.length > 0)) 
                    ? "No se encontraron resultados" 
                    : "No hay citas registradas"
                  }
                </h3>
                
                {/* Descripción dinámica */}
                <p className="text-gray-600 dark:text-muted-foreground">
                  {(filterValue || Object.values(filters).some(filter => filter && filter.length > 0)) 
                    ? "No hay citas que coincidan con los filtros aplicados. Intenta ajustar tus criterios de búsqueda." 
                    : "Aún no se han programado citas médicas en el sistema."
                  }
                </p>
              </div>
            </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}