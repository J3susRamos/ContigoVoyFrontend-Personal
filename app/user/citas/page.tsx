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
  const cookies = parseCookies();

  const [isAuthorized, setIsAuthorized] = useState(() => {
    const cookies = parseCookies();
    return cookies["rol"] !== "admin";
  });
  
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Set<React.Key>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [citas, setCitas] = useState<Citas[]>([]);
  const [, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleGetCitas = useCallback(async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }, [cookies]);

  useEffect(() => {
    if (isAuthorized) {
      handleGetCitas();
    }
  }, [isAuthorized, handleGetCitas]);

  const [sortDescriptor] = useState({
    column: "fecha_inicio",
    direction: "ascending",
  });
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");

    if (userData.rol === "PSICOLOGO") {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
      router.push("/unauthorized"); 
    }
  }, [router]);

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
  }, [visibleColumns]);

  const onSearchChange = useCallback((value?: string) => {
    setFilterValue(value || "");
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
  }, []);
  
  if (!isAuthorized) return null;
  

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
        )}
      </div>
    </div>
  );
}
