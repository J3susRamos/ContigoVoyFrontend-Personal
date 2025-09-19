import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import showToast from "@/components/ToastStyle";
import { ListaAtencion } from "@/interface";

const INITIAL_VISIBLE_COLUMNS = ["codigo", "paciente", "fecha_inicio", "diagnostico"];

export const useHistorialPacientes = () => {
  // Estados principales
  const [filterValue, setFilterValue] = useState("");
  const [atencion, setAtencion] = useState<ListaAtencion[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "fecha_inicio",
    direction: "ascending" as "ascending" | "descending",
  });
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  // Verificación de autorización
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");

    if (userData.rol === "PSICOLOGO") {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
      router.push("/unauthorized");
    }
  }, [router]);

  // Obtener citas/atenciones
  const handleGetCitas = useCallback(async () => {
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
  }, []);

  // Efecto para cargar atenciones cuando se autoriza
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
  }, [isAuthorized, handleGetCitas]);

  // Lógica de filtrado y ordenamiento
  const hasSearchFilter = Boolean(filterValue);

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

  // Handlers de búsqueda
  const onSearchChange = useCallback((value?: string) => {
    setFilterValue(value || "");
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
  }, []);

  // Handlers de ordenamiento
  const handleSortByDate = useCallback(() => {
    setSortDescriptor((prev) => ({
      column: "fecha_inicio",
      direction: prev.direction === "ascending" ? "descending" : "ascending",
    }));
  }, []);

  const handleSortByName = useCallback(() => {
    setSortDescriptor((prev) => ({
      column: "paciente",
      direction: prev.direction === "ascending" ? "descending" : "ascending",
    }));
  }, []);

  return {
    // Estados
    filterValue,
    atencion: sortedItems,
    visibleColumns,
    setVisibleColumns,
    isAuthorized,
    isLoading,

    // Handlers
    onSearchChange,
    onClear,
    handleSortByDate,
    handleSortByName,

    // Funciones utilitarias
    refetch: handleGetCitas,
  };
};