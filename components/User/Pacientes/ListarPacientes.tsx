import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { Paciente } from "@/interface";

import TablePacientes from "./TablePacientes";
import pacientesGet from "@/utils/pacientesCRUD/pacientesGet";
import showToastFunction from "../../ToastStyle";
import pacientesDelete from "@/utils/pacientesCRUD/pacientesDelete";
import ConfirmDeleteModal from "@/components/ui/confirm-delete-modal";
import EmptyTable from "@/components/ui/EmptyTable";
import { FiltersPaciente } from "@/app/user/pacientes/page";

interface Props{
  filters: FiltersPaciente;
  filterValue: string;
}

export default function ListarPacientes({filters, filterValue }: Props) {

  const [paciente, setPaciente] = useState<Paciente[]>([]);
  const toastShownRef = useRef(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleGetPacientes = useCallback(
    async (showToast = true) => {
      try {
        const pacientsData = await pacientesGet();
        console.log(pacientsData);

        const status = pacientsData.state;
        let data = pacientsData.result;

        switch (status) {
          case 0:
            showToastFunction(
              "error",
              "Error de conexión. Intenta nuevamente."
            );
            break;
          case 1:
            showToastFunction(
              "error",
              data.message || "Error al obtener los pacientes"
            );
            break;
          case 2:
            if (Array.isArray(data)) {
              if (showToast && !toastShownRef.current) {
                showToastFunction(
                  "success",
                  "Pacientes cargados correctamente"
                );
                toastShownRef.current = true;
              }
            } else {
              console.error("La propiedad 'result' no es un array:", data);
              showToastFunction("error", "Formato de respuesta inválido");
              data = [];
            }
            break;
        }

        setPaciente(data);
      } catch (error) {
        console.error("Error en handleGetPacientes:", error);
        showToastFunction("error", "Error inesperado al obtener pacientes");
      }
    },
    [setPaciente]
  );

  const pacientesFiltrados = useMemo(() => {
    if (!paciente?.length) return [];

    const searchTerm = filterValue?.toLowerCase() || "";

    return paciente.filter((p) => {
      if (filters.genero.length > 0 && !filters.genero.includes(p.genero)) {
        return false;
      }

      if (
        filters.edad.length > 0 &&
        !filters.edad.some((rango) => {
          const [min, max] = rango.split(" - ").map(Number);
          return p.edad >= min && p.edad <= max;
        })
      ) {
        return false;
      }

      if (filters.fechaUltimaCita.length === 2) {
        const [from, to] = filters.fechaUltimaCita;
        const fechaPaciente = new Date(p.ultima_cita_fecha).getTime();
        const fromDate = new Date(from + "T00:00:00").getTime();
        const toDate = new Date(to + "T23:59:59").getTime();

        if (fechaPaciente < fromDate || fechaPaciente > toDate) {
          return false;
        }
      }

      if (searchTerm && !p.nombre.toLowerCase().includes(searchTerm)) {
        return false;
      }

      return true;
    });
  }, [paciente, filters, filterValue]);


  const handleDelete = async (idPaciente: number) => {
    setIsDeleting(true);
    try {
      const pacienteData = await pacientesDelete(idPaciente);

      if (pacienteData.state === 2) {
        showToastFunction("success", "Paciente eliminado correctamente");
        await handleGetPacientes(false);
        return true;
      } else {
        const errorMessage =
          pacienteData.state === 1
            ? pacienteData.result.status_message ||
              "Error de conexión. Intenta nuevamente."
            : "Error de conexión. Intenta nuevamente.";
        showToastFunction("error", errorMessage);
        return false;
      }
    } catch (error) {
      console.error("Error eliminando paciente:", error);
      showToastFunction("error", "Error inesperado al eliminar paciente");
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    handleGetPacientes();
  }, [handleGetPacientes]);

  return (
    <>
      {pacientesFiltrados.length > 0 ? (
        <TablePacientes
          filteredPacientes={pacientesFiltrados}
          onDeleteInit={(id) => setDeleteId(id)}
        />
      ) : (
        <EmptyTable
          filters={!!filterValue ||
            Object.values(filters).some(
              (filter) => filter && filter.length > 0)}
          messages={{
            emptyTitle: "No hay pacientes registrados",
            noResultsDescription:
              "No hay pacientes que coincidan con los filtros aplicados. Intenta ajustar tus criterios de búsqueda.",
            emptyDescription:
              "Aún no se han registrado pacientes en el sistema.",
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
        message="¿Estás seguro de eliminar este paciente?"
      />
    </>
  );
}
