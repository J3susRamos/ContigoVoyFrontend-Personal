import React, {
    useState,
    useCallback,
    useRef,
    useEffect,
} from "react";
import {FiltersPaciente, Paciente} from "@/interface";
import TablePacientes from "./TablePacientes";
import pacientesGet from "@/utils/pacientesCRUD/pacientesGet";
import showToastFunction from "../../ToastStyle";
import pacientesDelete from "@/utils/pacientesCRUD/pacientesDelete";
import ConfirmDeleteModal from "@/components/ui/confirm-delete-modal";
import EmptyTable from "@/components/ui/Table/EmptyTable";
import Pagination from "@/components/ui/Pagination";

interface Props {
    filters: FiltersPaciente;
    filterValue: string;
}

export default function ListarPacientes({filters, filterValue}: Props) {
    const [paciente, setPaciente] = useState<Paciente[]>([]);
    const toastShownRef = useRef(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const handleGetPacientes = useCallback(
        async (showToast = true, page = 1) => {
            try {
                const pacientsData = await pacientesGet(page, 5, true, filters, filterValue);

                const status = pacientsData.state;
                const data = pacientsData.result;

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
                        if (Array.isArray(data.data)) {
                            setPaciente(data.data);
                            setCurrentPage(data.pagination.current_page);
                            setTotalPages(data.pagination.last_page);

                            if (showToast && !toastShownRef.current) {
                                showToastFunction(
                                    "success",
                                    "Pacientes cargados correctamente"
                                );
                                toastShownRef.current = true;
                            }
                        } else {
                            console.error("La propiedad 'data' no es un array:", data);
                            showToastFunction("error", "Formato de respuesta inválido");
                            setPaciente([]);
                        }
                        break;
                }
            } catch (error) {
                console.error("Error en handleGetPacientes:", error);
                showToastFunction("error", "Error inesperado al obtener pacientes");
            }
        },
        [setPaciente, filterValue, filters]
    );

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

    // Wrapper function to handle the Promise properly
    const handleAsyncGetPacientes = useCallback(
        (showToast = true, page = 1) => {
            handleGetPacientes(showToast, page).catch((error) => {
                console.error("Error in handleGetPacientes:", error);
                showToastFunction("error", "Error inesperado al obtener pacientes");
            });
        },
        [handleGetPacientes]
    );

    useEffect(() => {
        handleAsyncGetPacientes();
    }, [handleAsyncGetPacientes, filters, filterValue]);

    return (
        <>
            {paciente.length > 0 ? (
                <>
                    <TablePacientes
                        filteredPacientes={paciente}
                        onDeleteInit={(id) => setDeleteId(id)}
                    />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onNext={() => handleAsyncGetPacientes(true, currentPage + 1)}
                        onPrevious={() => handleAsyncGetPacientes(true, currentPage - 1)}
                    />
                </>
            ) : (
                <EmptyTable
                    filters={
                        !!filterValue ||
                        Object.values(filters).some((filter) => filter && filter.length > 0)
                    }
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
