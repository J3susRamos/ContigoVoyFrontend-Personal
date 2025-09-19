import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import showToastFunction from "../../ToastStyle";
import { CitaSinPagar } from "@/interface";
import { parseCookies } from "nookies";
import EmptyTable from "@/components/ui/Table/EmptyTable";
import { TableCitasSinPagar } from "./table/TableCitasSinPagar";
import Pagination from "@/components/ui/Pagination";

interface Props {
  filterValue: string;
}

const ListarCitasSinPagar = ({ filterValue }: Props) => {
  const [citas, setCitas] = useState<CitaSinPagar[]>([]);
  const toastShownRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const cookies = useMemo(() => parseCookies(), []);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleGetCitas = useCallback(
    async ({
      showToast = true,
      paginate = true,
    }: {
      showToast?: boolean;
      paginate?: boolean;
      perPage?: number;
      page?: number;
    } = {}) => {
      try {
        setError(null);
        const token = cookies["session"];

        //Cambiar aqui con nuevo endpoint
        const url = `${process.env.NEXT_PUBLIC_API_URL}api/citas/sin-pagar`;

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
          showToastFunction("error", "Error al obtener las citas");
          return;
        }

        const citasData = await response.json();
        const citasRaw = citasData.result;

        if (Array.isArray(citasRaw)) {
          const formattedCitas = citasRaw;
          if (showToast && !toastShownRef.current) {
            showToastFunction("success", "Citas obtenidas correctamente");
            toastShownRef.current = true;
          }
          setCitas(formattedCitas);

          if (paginate && citasData.result.pagination) {
            setCurrentPage(citasData.result.pagination.current_page);
            setTotalPages(citasData.result.pagination.last_page);
          }
        } else {
          setError("Formato de respuesta inválido");
          showToastFunction("error", "Formato de respuesta inválido");
        }
      } catch (error) {
        console.error(error);
        setError("Error al obtener las citas");
        showToastFunction("error", "Error de conexión. Intenta nuevamente.");
      }
    },
    [cookies],
  );

  useEffect(() => {
    const loadCitas = async () => {
      try {
        await handleGetCitas();
      } catch (error) {
        console.error("Error loading citas:", error);
        setError("Error al cargar las citas sin pagar");
        showToastFunction("error", "Error al cargar las citas");
      }
    };

    loadCitas().catch((error) => {
      console.error("Unhandled error in loadCitas:", error);
      setError("Error inesperado al cargar las citas sin pagar");
      showToastFunction(
        "error",
        "Error inesperado al cargar las citas sin pagar",
      );
    });
  }, [handleGetCitas, filterValue]);

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg font-medium text-destructive dark:text-destructive">
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      {citas.length > 0 ? (
        <>
          <TableCitasSinPagar filteredCitas={citas} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onNext={() => {
              handleGetCitas({ page: currentPage + 1 }).catch((error) => {
                console.error("Error loading next page:", error);
                showToastFunction(
                  "error",
                  "Error al cargar la siguiente página",
                );
              });
            }}
            onPrevious={() => {
              handleGetCitas({ page: currentPage - 1 }).catch((error) => {
                console.error("Error loading previous page:", error);
                showToastFunction(
                  "error",
                  "Error al cargar la página anterior",
                );
              });
            }}
          />
        </>
      ) : (
        <EmptyTable
          messages={{
            emptyTitle: "No hay citas registradas",
            noResultsDescription:
              "No hay citas que coincidan con los filtros aplicados. Intenta ajustar tus criterios de búsqueda.",
            emptyDescription: "Aún no se han registrado citas en el sistema.",
          }}
        />
      )}
    </>
  );
};

export default ListarCitasSinPagar;
