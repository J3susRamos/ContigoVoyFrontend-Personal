"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/User/Citas/NavbarCitas";
import { TableCitas } from "@/components/User/Citas/TableCitas";
import { Citas } from "@/interface";
import { parseCookies } from "nookies";
import showToast from "@/components/ToastStyle";
import HeaderUser from "@/components/User/HeaderUser";
import EmptyTable, { GenericFilters } from "@/components/ui/EmptyTable";

const INITIAL_VISIBLE_COLUMNS = [
  "codigo",
  "paciente",
  "fecha_inicio",
  "motivo",
  "estado",
  "duracion",
];

export interface Filters extends GenericFilters {
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
  const cookies = useMemo(() => parseCookies(), []);
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

  const handleGetCitas = useCallback(async () => {
    try {
      setError(null);
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
          genero: cita.genero,
          edad: cita.edad,
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
  }, [cookies]);

  const [sortDescriptor] = useState({
    column: "fecha_inicio",
    direction: "ascending",
  });
  
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");

    if (userData.rol !== "PSICOLOGO") {
      router.push("/unauthorized");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  useEffect(() => {
    handleGetCitas();
  }, [handleGetCitas]);

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    if (!citas?.length) return [];

    return citas.filter((cita) => {
      if (filters.genero.length > 0 && !filters.genero.includes(cita.genero)) {
        return false;
      }

      if (
        filters.edad.length > 0 &&
        !filters.edad.some((rango) => {
          const [min, max] = rango.split(" - ").map(Number);
          return cita.edad >= min && cita.edad <= max;
        })
      ) {
        return false;
      }

      if (filters.estado.length > 0 && !filters.estado.includes(cita.estado)) {
        return false;
      }

      if (filters.fechaInicio.length === 2) {
        const [from, to] = filters.fechaInicio;
        const citaDate = new Date(cita.fecha_inicio);
        const fromDate = new Date(from + "T00:00:00");
        const toDate = new Date(to + "T23:59:59");

        if (citaDate < fromDate || citaDate > toDate) {
          return false;
        }
      }

      if (
        filterValue &&
        !cita.paciente.toLowerCase().includes(filterValue.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [citas, filterValue, filters]);

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
        onAddNew={() => {}}
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
          {filteredItems.length > 0 ? (
            <TableCitas
              users={filteredItems}
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
            <EmptyTable
              filters={filters}
              filterValue={filterValue}
              messages={{
                emptyTitle: "No hay citas registradas",
                noResultsDescription:
                  "No hay citas que coincidan con los filtros aplicados. Intenta ajustar tus criterios de búsqueda.",
                emptyDescription:
                  "Aún no se han programado citas médicas en el sistema.",
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
