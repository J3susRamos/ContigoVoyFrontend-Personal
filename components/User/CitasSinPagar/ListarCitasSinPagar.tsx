import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import showToastFunction from "../../ToastStyle";
import { Citas, FiltersCitasSinPagar } from "@/interface";
import { parseCookies } from "nookies";
import EmptyTable from "@/components/ui/Table/EmptyTable";
import { TableCitasSinPagar } from "./table/TableCitasSinPagar";
import Pagination from "@/components/ui/Pagination";

interface Props {
  filters: FiltersCitasSinPagar;
  filterValue: string;
}

const ListarCitasSinPagar = ({
  filters,
  filterValue,
}: Props) => {
  const [citas, setCitas] = useState<Citas[]>([]);
  const toastShownRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const cookies = useMemo(() => parseCookies(), []);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleGetCitas = useCallback(
    async ({
      showToast = true,
      paginate = true,
      perPage = 5,
      page = 1,
      filters = {},
      paciente = ""
    }: {
      showToast?: boolean;
      paginate?: boolean;
      perPage?: number;
      page?: number;
      filters?: {
        genero?: string[];
        edad?: string[];
        estado?: string[];
        fechaInicio?: string[];
        codigo?: string[];
      };
      paciente?: string;
    } = {}) => {
      try {
        setError(null);
        const token = cookies["session"];

        const queryParams = new URLSearchParams();
        if (paginate) {
          queryParams.append("paginate", "true");
          queryParams.append("per_page", perPage.toString());
          queryParams.append("page", page.toString());
        }

        if (filters.genero?.length) {
          queryParams.append("genero", filters.genero.join(","));
        }

        if (filters.estado?.length) {
          queryParams.append("estado", filters.estado.join(","));
        }

        if (filters.edad?.length) {
          queryParams.append("edad", filters.edad.join(","));
        }

        if (filters.fechaInicio?.length === 2) {
          queryParams.append("fecha_inicio", filters.fechaInicio[0]);
          queryParams.append("fecha_fin", filters.fechaInicio[1]);
        }

        if (filters.codigo?.length) {
          queryParams.append("codigo", filters.codigo.join(","));
        }

        if (paciente) {
          queryParams.append("nombre", paciente);
        }

        //Cambiar aqui con nuevo endpoint
        const url = `${process.env.NEXT_PUBLIC_API_URL}api/citas/lista${
          queryParams.toString() ? `?${queryParams.toString()}` : ""
        }`;

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
        const citasRaw = paginate ? citasData.result.data : citasData.result;

        if (Array.isArray(citasRaw)) {
          const formattedCitas = citasRaw.map((cita: Citas) => ({
            idCita: cita.idCita,
            idPaciente: cita.idPaciente,
            idPsicologo: cita.idPsicologo,
            paciente: cita.paciente,
            codigo: cita.codigo,
            fecha_inicio: cita.fecha_inicio,
            motivo: cita.motivo,
            estado: cita.estado,
            duracion: cita.duracion,
            genero: cita.genero,
            edad: cita.edad,
            fecha_nacimiento: cita.fecha_nacimiento,
          }));
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
    [cookies]
  );

  useEffect(() => {
    const loadCitas = async () => {
      try {
        await handleGetCitas({ filters: filters, paciente: filterValue });
      } catch (error) {
        console.error("Error loading citas:", error);
        setError("Error al cargar las citas");
        showToastFunction("error", "Error al cargar las citas");
      }
    };

    loadCitas().catch((error) => {
      console.error("Unhandled error in loadCitas:", error);
      setError("Error inesperado al cargar las citas");
      showToastFunction("error", "Error inesperado al cargar las citas");
    });
  }, [handleGetCitas, filterValue, filters]);

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
          <TableCitasSinPagar
            filteredCitas={citas}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onNext={() => {
              handleGetCitas({ page: currentPage + 1 }).catch((error) => {
                console.error("Error loading next page:", error);
                showToastFunction("error", "Error al cargar la siguiente página");
              });
            }}
            onPrevious={() => {
              handleGetCitas({ page: currentPage - 1 }).catch((error) => {
                console.error("Error loading previous page:", error);
                showToastFunction("error", "Error al cargar la página anterior");
              });
            }}
          />
        </>
      ) : (
        <EmptyTable
          filters={
            !!filterValue ||
            Object.values(filters).some((filter) => filter && filter.length > 0)
          }
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