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
    <div>
      {/* Header */}
      <div className="flex flex-1 bg-[#eaeded] w-full z-30 mt-4">
        <div>
          <nav className="bg-[#eaeded] rounded-2xl flex items-center w-[calc(95vw-270px)] p-4">
            <div className="bg-[#eaeded] flex items-start justify-between w-full">
              <div>
                <div className="pl-12 text-4xl font-bold text-[#634AE2]">
                  <h1>Lista de Citas</h1>
                </div>
              </div>
              <div className="flex gap-x-5 mt-2">
                <CerrarSesion />
              </div>
            </div>
          </nav>
        </div>
      </div>
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
          <div className="flex justify-center items-center h-64">
            <div className="text-lg font-medium">Cargando citas...</div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-lg font-medium text-red-500">{error}</div>
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