import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import showToastFunction from "../../ToastStyle";
import { Citas } from "@/interface";
import { FiltersCitas } from "@/app/user/citas/page";
import { parseCookies } from "nookies";
import showToast from "@/components/ToastStyle";
import ConfirmDeleteModal from "@/components/ui/confirm-delete-modal";
import EmptyTable from "@/components/ui/EmptyTable";
import { TableCitas } from "./TableCitas";

interface Props {
  filters: FiltersCitas;
  filterValue: string;
}

const ListarCitas = ({ filters, filterValue }: Props) => {
  const [citas, setCitas] = useState<Citas[]>([]);
  const toastShownRef = useRef(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cookies = useMemo(() => parseCookies(), []);

  const handleGetCitas = useCallback(
    async (showToast = true) => {
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
          showToastFunction("error", "Error al obtener las citas");
          return;
        }
        const citasData = await response.json();

        if (Array.isArray(citasData.result)) {
          const formattedCitas = citasData.result.map((cita: Citas) => ({
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
          if (showToast && !toastShownRef.current) {
            showToastFunction("success", "Citas obtenidas correctamente");
            toastShownRef.current = true;
          }
          setCitas(formattedCitas);
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

  const filteredCitas = useMemo(() => {
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
      const citaData = await response.json();

      if (citaData.state === 2) {
        showToastFunction("success", "Paciente eliminado correctamente");
        await handleGetCitas(false);
        return true;
      } else {
        const errorMessage =
          citaData.state === 1
            ? citaData.result.status_message ||
              "Error de conexión. Intenta nuevamente."
            : "Error de conexión. Intenta nuevamente.";
        showToastFunction("error", errorMessage);
        return false;
      }
    } catch (error) {
      console.error(error);
      showToast("error", "Error de conexión. Intenta nuevamente");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    handleGetCitas();
  }, [handleGetCitas]);

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
      {filteredCitas.length > 0 ? (
        <TableCitas
          filteredCitas={filteredCitas}
          onDeleteInit={(id) => setDeleteId(id)}
        />
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
