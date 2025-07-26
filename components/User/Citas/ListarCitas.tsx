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
import { Citas, FiltersCitas } from "@/interface";
import { parseCookies } from "nookies";
import showToast from "@/components/ToastStyle";
import ConfirmDeleteModal from "@/components/ui/confirm-delete-modal";
import EmptyTable from "@/components/ui/Table/EmptyTable";
import { TableCitas } from "./TableCitas";
import { FormCita } from "./form_cita_modal";
import Pagination from "@/components/ui/Pagination";

interface Props {
  filters: FiltersCitas;
  filterValue: string;
  showFormCita: boolean;
  setShowFormCita: Dispatch<SetStateAction<boolean>>;
}

const ListarCitas = ({
  filters,
  filterValue,
  showFormCita,
  setShowFormCita,
}: Props) => {
  const [citas, setCitas] = useState<Citas[]>([]);
  const toastShownRef = useRef(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cookies = useMemo(() => parseCookies(), []);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingCita, setEditingCita] = useState<Citas | null>(null);

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

const handleDelete = async (idCita: number) => {
  setIsDeleting(true);
  try {
    const cookies = parseCookies();
    const token = cookies["session"];
    const url = `${process.env.NEXT_PUBLIC_API_URL}api/citas/${idCita}`;
    
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      showToastFunction("error", "Error al eliminar la cita");
      return false;
    }

    const citaData = await response.json();
    console.log("Delete response:", citaData);

    // Update this condition to match your Laravel response structure
    if (citaData.status_code === 200) {
      showToastFunction("success", "Cita eliminada correctamente");
      await handleGetCitas({ showToast: false });
      return true;
    } else {
      const errorMessage = citaData.status_message || "Error de conexión. Intenta nuevamente.";
      showToastFunction("error", errorMessage);
      return false;
    }
  } catch (error) {
    console.error("Delete error:", error);
    showToast("error", "Error de conexión. Intenta nuevamente");
    return false;
  } finally {
    setIsDeleting(false);
  }
};

  // Handle edit function
  const handleEdit = (cita: Citas) => {
    setEditingCita(cita);
    setShowFormCita(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowFormCita(false);
    setEditingCita(null);
  };

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
      <FormCita
        isOpen={showFormCita}
        onCloseAction={handleCloseModal}
        onCitaCreatedAction={() => {
          handleCloseModal();
          handleGetCitas({ showToast: false }).catch((error) => {
            console.error("Error refreshing citas after creation:", error);
            showToastFunction("error", "Error al actualizar la lista de citas");
          });
        }}
        editingCita={editingCita}
      />
      {citas.length > 0 ? (
        <>
          <TableCitas
            filteredCitas={citas}
            onDeleteAction={(id) => setDeleteId(id)}
            onEditAction={handleEdit}
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
      <ConfirmDeleteModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            handleDelete(deleteId).then((success) => {
              if (success) setDeleteId(null);
            }).catch((error) => {
              console.error("Error deleting cita:", error);
              showToastFunction("error", "Error al eliminar la cita");
            });
          }
        }}
        isProcessing={isDeleting}
        message="¿Estás seguro de eliminar esta cita?"
      />
    </>
  );
};

export default ListarCitas;