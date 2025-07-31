"use client";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Navbar } from "@/components/User/Historial/SearchNavbar";
import { TableComponent } from "@/components/User/Historial/TableComponent";
import { ListaAtencion } from "@/interface";
import { parseCookies } from "nookies";
import showToast from "@/components/ToastStyle";
import { useRouter } from "next/navigation";
import HeaderUser from "@/components/User/HeaderUser";

const columns = [
  { name: "Código", uid: "codigo", sortable: true },
  { name: "Paciente", uid: "paciente", sortable: true },
  { name: "Fecha de Cita", uid: "fecha_inicio", sortable: true },
  { name: "Diagnóstico", uid: "diagnostico", sortable: true },
];

const INITIAL_VISIBLE_COLUMNS = ["codigo", "paciente", "fecha_inicio", "diagnostico"];

export default function App() {
  const [filterValue, setFilterValue] = useState("");
  const [atencion, setAtencion] = useState<ListaAtencion[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "fecha_inicio",
    direction: "ascending",
  });

  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Verificar el rol
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

  const headerColumns = useMemo(() => {
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredData = [...atencion];
    if (hasSearchFilter) {
      filteredData = filteredData.filter((item) =>
        item.nombre_completo.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    return filteredData;
  }, [atencion, filterValue, hasSearchFilter]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof typeof a] as string;
      const second = b[sortDescriptor.column as keyof typeof b] as string;
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  const renderCell = useCallback((atencion: ListaAtencion, columnKey: React.Key) => {
    const cellValue = atencion[columnKey as keyof typeof atencion];

    switch (columnKey) {
      case "codigo":
        return atencion.codigo;
      case "paciente":
        return atencion.nombre_completo;
      case "diagnostico":
        return atencion.diagnostico;
      case "fecha_inicio":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            {atencion.hora_inicio && <p className="text-bold text-small capitalize">{atencion.hora_inicio}</p>}
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onSearchChange = useCallback((value?: string) => {
    setFilterValue(value || "");
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
  }, []);

  const handleSortByDate = () => {
    setSortDescriptor((prev) => ({
      column: "fecha_inicio",
      direction: prev.direction === "ascending" ? "descending" : "ascending",
    }));
  };

  const handleSortByName = () => {
    setSortDescriptor((prev) => ({
      column: "paciente",
      direction: prev.direction === "ascending" ? "descending" : "ascending",
    }));
  };

  const handleGetCitas = async () => {
    try {
      const cookies = parseCookies();
      const token = cookies["session"];
      const url = `${process.env.NEXT_PUBLIC_API_URL}api/atenciones`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        if (Array.isArray(data.result)) {
          setAtencion(data.result.flat());
        } else {
          console.error("La propiedad 'result' no es un array:", data);
          showToast("error", "Formato de respuesta inválido");
          setAtencion([]);
        }
      } else {
        showToast("error", data.message || "Error al obtener las citas");
        setAtencion([]);
      }
    } catch (error) {
      console.error(error);
      showToast("error", "Error de conexión. Intenta nuevamente.");
      setAtencion([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchAtenciones = async () => {
      if (isAuthorized) {
        await handleGetCitas();
      }
    };

    fetchAtenciones().catch((error) => {
      console.error('Error fetching atenciones:', error);
      showToast("error", "Error al cargar las atenciones");
    });
  }, [isAuthorized]);

  if (isAuthorized === null || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
      </div>
    );
  }

  return (
    <div className="bg-[#f6f7f7] dark:bg-background min-h-screen flex flex-col">
      <HeaderUser title="Historial de pacientes" />
      <Navbar
        filterValue={filterValue}
        onSearchChange={onSearchChange}
        onClear={onClear}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        columns={columns}
        onSortByDate={handleSortByDate}
        onSortByName={handleSortByName}
      />
      <section className={`"opacitiy-50"`}>
        <TableComponent
          atencion={sortedItems}
          headerColumns={headerColumns}
          renderCellAction={renderCell}
        />
      </section>
    </div>
  );
}
