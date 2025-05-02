"use client";
import React, { useState, useMemo, useCallback, useEffect } from "react";
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

export default function App() {
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Set<React.Key>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [citas, setCitas] = useState<Citas[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleGetCitas = async () => {
    try {
      setIsLoading(true);
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
        throw new Error(response.statusText);
      }

      const data = await response.json();

      if (Array.isArray(data.result)) {
        // Mapear los datos de la API a la estructura esperada
        const formattedCitas = data.result.map((cita: Citas) => ({
          codigo: cita.codigo,
          paciente: cita.paciente,
          fecha_inicio: cita.fecha_inicio,
          motivo:  cita.motivo,
          estado: cita.estado,
          duracion: cita.duracion,
          idCita: cita.idCita
        }));
        setCitas(formattedCitas);
        showToast("success", "Citas obtenidas correctamente");
      } else {
        throw new Error("Formato de respuesta inválido");
      }
    } catch (error) {
      console.error(error);
      setError("Error al obtener las citas");
      showToast("error", "Error al obtener las citas");
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { name: "Paciente", uid: "paciente", sortable: true },
    { name: "Código", uid: "codigo", sortable: true },
    { name: "Motivo", uid: "motivo", sortable: true },
    { name: "Estado", uid: "estado", sortable: true },
    { name: "Fecha de Inicio", uid: "fecha_inicio", sortable: true },
    { name: "Duración", uid: "duracion", sortable: true },
  ];

  useEffect(() => {
    handleGetCitas();
  }, []);

  const [sortDescriptor] = useState({
    column: "fecha_inicio",
    direction: "ascending",
  });

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    let filteredCitas = [...citas];
    if (hasSearchFilter) {
      filteredCitas = filteredCitas.filter((cita) =>
        cita.paciente.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    return filteredCitas;
  }, [citas, filterValue, hasSearchFilter]);

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
  }, [visibleColumns, columns]);

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
  }, []);

  return (
    <div className="bg-background dark:bg-background">
      {/* Header */}
      <header className="mt-4 z-30">
        <div className="bg-secondary dark:bg-secondary rounded-2xl p-4 w-[calc(95vw-270px)]">
          <div className="flex items-start justify-between w-full">
            <h1 className="text-2xl md:text-4xl font-bold text-primary dark:text-primary-foreground">
              Lista de Citas
            </h1>
            <div className="flex gap-x-5 mt-2">
              <CerrarSesion />
            </div>
          </div>
        </div>
      </header>
      
      <div>
        {/* Navbar */}
        <Navbar
          filterValue={filterValue}
          onSearchChange={onSearchChange}
          onClear={onClear}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
          columns={columns}
        />

        {/* Contenido */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64 text-foreground dark:text-foreground">
            <div className="text-lg font-medium">Cargando citas...</div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-lg font-medium text-destructive dark:text-destructive">
              {error}
            </div>
          </div>
        ) : (
          <TableCitas
            users={sortedItems} 
            headerColumns={headerColumns}
            selectedKeys={selectedKeys}
            setSelectedKeys={setSelectedKeys}
            onCitaDeleted={(idCita) => {
              setCitas(prevCitas => prevCitas.filter(cita => Number(cita.idCita) !== Number(idCita)));
            }}
          />
        )}
      </div>
    </div>
  );
}