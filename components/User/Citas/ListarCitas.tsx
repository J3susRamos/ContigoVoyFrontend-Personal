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
import {Citas, FiltersCitas} from "@/interface";
import {parseCookies} from "nookies";
import showToast from "@/components/ToastStyle";
import ConfirmDeleteModal from "@/components/ui/confirm-delete-modal";
import EmptyTable from "@/components/ui/EmptyTable";
import {TableCitas} from "./TableCitas";
import {FormCita} from "./form_cita_modal";
import Pagination from "@/components/ui/Pagination";

interface Props {
    filters: FiltersCitas;
    filterValue: string;
    showFormCita: boolean;
    setShowFormCita: Dispatch<SetStateAction<boolean>>;
}

interface ApiCitaResponse {
    idCita?: number;
    id?: number;
    idPaciente?: number;
    idPsicologo?: number;
    paciente?: string;
    codigo?: string;
    fecha_inicio?: string;
    motivo?: string;
    estado?: string;
    duracion?: string;
    genero?: string;
    edad?: number;
    fecha_nacimiento?: string;
}

interface ApiPaginationResponse {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface ApiResponse {
    result?: {
        data?: ApiCitaResponse[];
        pagination?: ApiPaginationResponse;
    } | ApiCitaResponse[];
    message?: string;
}

interface UserData {
    idpsicologo?: number;
    id?: number;
    rol?: string;
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
    const [loading, setLoading] = useState(false);
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
            };
            paciente?: string;
        } = {}) => {
            try {
                setLoading(true);
                setError(null);
                const token = cookies["session"];

                if (!token) {
                    setError("No hay sesión activa");
                    showToastFunction("error", "Por favor inicia sesión nuevamente");
                    return;
                }

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

                if (paciente) {
                    queryParams.append("nombre", paciente);
                }

                // Get user data to determine psychologist ID
                let psychologistId: number | null = null;
                try {
                    const userData: UserData = JSON.parse(localStorage.getItem("user") || "{}");
                    psychologistId = userData.idpsicologo || userData.id || null;
                } catch (error) {
                    console.error("Error parsing user data:", error);
                }

                if (!psychologistId) {
                    setError("No se pudo identificar el psicólogo");
                    showToastFunction("error", "Error de autenticación");
                    return;
                }

                const url = `${process.env.NEXT_PUBLIC_API_URL}api/citas/lista?${queryParams.toString()}`;

                console.log("Fetching citas from URL:", url);

                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("Response status:", response.status);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`Error: ${response.status} ${response.statusText}`, errorText);

                    if (response.status === 404) {
                        setError("Endpoint no disponible. Se requiere configuración del backend.");
                        showToastFunction("error", "Error: Endpoint para listar citas no está configurado en el backend");
                    } else if (response.status === 401) {
                        setError("Sesión expirada");
                        showToastFunction("error", "Sesión expirada. Por favor inicia sesión nuevamente.");
                    } else if (response.status === 403) {
                        setError("No autorizado");
                        showToastFunction("error", "No tienes permisos para ver las citas");
                    } else {
                        setError("Error al obtener las citas");
                        showToastFunction("error", "Error al obtener las citas");
                    }
                    return;
                }

                const citasData: ApiResponse = await response.json();
                console.log("Citas data received:", citasData);

                let citasRaw: ApiCitaResponse[] = [];

                if (paginate) {
                    // Handle paginated response
                    if (citasData.result && 'data' in citasData.result && Array.isArray(citasData.result.data)) {
                        citasRaw = citasData.result.data;
                    }
                } else {
                    // Handle non-paginated response
                    if (Array.isArray(citasData.result)) {
                        citasRaw = citasData.result;
                    }
                }

                if (Array.isArray(citasRaw)) {
                    const formattedCitas: Citas[] = citasRaw.map((cita: ApiCitaResponse) => ({
                        idCita: (cita.idCita?.toString() || cita.id?.toString()) ?? "",
                        idPaciente: cita.idPaciente?.toString() ?? "",
                        idPsicologo: cita.idPsicologo?.toString() ?? "",
                        paciente: cita.paciente ?? "",
                        codigo: cita.codigo ?? "",
                        fecha_inicio: cita.fecha_inicio ?? "",
                        motivo: cita.motivo ?? "",
                        estado: cita.estado ?? "",
                        duracion: cita.duracion ?? "",
                        genero: cita.genero ?? "",
                        edad: cita.edad ?? 0,
                        fecha_nacimiento: cita.fecha_nacimiento ?? "",
                    }));

                    console.log("Formatted citas:", formattedCitas);

                    if (showToast && !toastShownRef.current && formattedCitas.length > 0) {
                        showToastFunction("success", "Citas obtenidas correctamente");
                        toastShownRef.current = true;
                    }

                    setCitas(formattedCitas);

                    if (paginate && citasData.result && 'pagination' in citasData.result && citasData.result.pagination) {
                        setCurrentPage(citasData.result.pagination.current_page);
                        setTotalPages(citasData.result.pagination.last_page);
                    }
                } else {
                    console.error("Invalid response format:", citasData);
                    setError("Formato de respuesta inválido");
                    showToastFunction("error", "No se encontraron citas");
                    setCitas([]);
                }
            } catch (error) {
                console.error("Fetch error:", error);
                setError("Error al obtener las citas");
                showToastFunction("error", "Error de conexión. Intenta nuevamente.");
            } finally {
                setLoading(false);
            }
        },
        [cookies]
    );

    const handleDelete = async (idCita: number): Promise<boolean> => {
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

            if (response.ok) {
                showToastFunction("success", "Cita eliminada correctamente");
                await handleGetCitas({showToast: false});
                return true;
            } else {
                const errorData = await response.json();
                showToastFunction("error", errorData.message || "Error al eliminar la cita");
                return false;
            }
        } catch (error) {
            console.error(error);
            showToast("error", "Error de conexión. Intenta nuevamente");
            return false;
        } finally {
            setIsDeleting(false);
        }
    };

    // Handle async calls properly
    const handleAsyncCitasCall = useCallback(
        (params: Parameters<typeof handleGetCitas>[0] = {}) => {
            handleGetCitas(params).catch((error) => {
                console.error("Error in handleGetCitas:", error);
                setError("Error al obtener las citas");
                showToastFunction("error", "Error de conexión. Intenta nuevamente.");
            });
        },
        [handleGetCitas]
    );

    useEffect(() => {
        console.log("useEffect triggered with filters:", filters, "filterValue:", filterValue);
        handleAsyncCitasCall({filters: filters, paciente: filterValue});
    }, [handleAsyncCitasCall, filterValue, filters]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg font-medium">
                    Cargando citas...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-64 gap-4">
                <div className="text-lg font-medium text-destructive dark:text-destructive text-center">
                    {error}
                </div>
                <button
                    onClick={() => {
                        setError(null);
                        handleAsyncCitasCall();
                    }}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <>
            <FormCita
                isOpen={showFormCita}
                onCloseAction={() => setShowFormCita(false)}
                onCitaCreatedAction={() => {
                    setShowFormCita(false);
                    handleAsyncCitasCall({showToast: false});
                }}
            />
            {citas.length > 0 ? (
                <>
                    <TableCitas
                        filteredCitas={citas}
                        onDeleteInitAction={(id: number) => setDeleteId(id)}
                    />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onNext={() => handleAsyncCitasCall({page: currentPage + 1})}
                        onPrevious={() => handleAsyncCitasCall({page: currentPage - 1})}
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
