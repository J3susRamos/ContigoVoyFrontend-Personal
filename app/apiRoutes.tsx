import { Especialidad, Idiomas } from "@/components/CrearUsuario/DataFormularios";
import {
  ApiResponse,
  AuthorsApi,
  CategoriaApi,
  CitasPendientesApiResponse,
  PsicologoApiResponse,
  PsicologoApiResponseAlone,
  PsicologoPreviewData,
  DashboardApiResponse,
  CitasApiResponse,
  MarketingApiResponse,
  CitaMensual,
  FormCita,
  actulizarPsicologo,
  ActualizarPerfilCompletoPsicologo,
  EspecialidadesPsicologoResponse,
  /*   EspecialidadesResponse,	  */
  PacienteDisabled,
  Personal,
} from "@/interface";
import { parseCookies } from "nookies";

export const token = parseCookies()["session"];

export async function BlogsWebSite(): Promise<ApiResponse> {
  // Usar revalidate para permitir generación estática
  const cacheConfig = { next: { revalidate: 7200 } }; // 2 horas

  // Siempre usar la variable de entorno para la URL del API
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}api/blogs`;

  console.log("🔍 [BlogsWebSite] Environment:", process.env.NODE_ENV);
  console.log(
    "🔍 [BlogsWebSite] NEXT_PUBLIC_API_URL:",
    process.env.NEXT_PUBLIC_API_URL,
  );
  console.log("🔍 [BlogsWebSite] API URL:", apiUrl);
  console.log("🔍 [BlogsWebSite] Cache Config:", cacheConfig);
  console.log(
    "🔍 [BlogsWebSite] Window location (si existe):",
    typeof window !== "undefined" ? window.location.href : "Server side",
  );

  const res = await fetch(apiUrl, cacheConfig);

  console.log("🔍 [BlogsWebSite] Response Status:", res.status);
  console.log("🔍 [BlogsWebSite] Response OK:", res.ok);
  console.log(
    "🔍 [BlogsWebSite] Response Headers:",
    Object.fromEntries(res.headers.entries()),
  );
  console.log("🔍 [BlogsWebSite] Response URL:", res.url);

  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ [BlogsWebSite] Error Response Text:", errorText);
    console.error("❌ [BlogsWebSite] Response status text:", res.statusText);
    throw new Error(
      `Error al obtener los datos: ${res.status} ${res.statusText} - ${errorText}`,
    );
  }

  const jsonData = await res.json();
  console.log("✅ [BlogsWebSite] Success! Data received:", jsonData);
  console.log("✅ [BlogsWebSite] Data result length:", jsonData?.result?.length);
  return jsonData;
}

export async function GetCagetories(): Promise<CategoriaApi> {
  // Usar cache estático para categorías que cambian poco
  const cacheConfig = { next: { revalidate: 7200 } }; // 2 horas

  // Siempre usar la variable de entorno para la URL del API
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}api/categorias`;

  console.log("🔍 [GetCagetories] Environment:", process.env.NODE_ENV);
  console.log(
    "🔍 [GetCagetories] NEXT_PUBLIC_API_URL:",
    process.env.NEXT_PUBLIC_API_URL,
  );
  console.log("🔍 [GetCagetories] API URL:", apiUrl);

  const res = await fetch(apiUrl, cacheConfig);

  console.log("🔍 [GetCagetories] Response Status:", res.status);
  console.log("🔍 [GetCagetories] Response OK:", res.ok);
  console.log("🔍 [GetCagetories] Response URL:", res.url);

  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ [GetCagetories] Error Response Text:", errorText);
    console.error("❌ [GetCagetories] Response status text:", res.statusText);
    throw new Error(
      `Error al obtener categorías: ${res.status} ${res.statusText} - ${errorText}`,
    );
  }

  const jsonData = await res.json();
  console.log("✅ [GetCagetories] Success! Data received:", jsonData);
  console.log("✅ [GetCagetories] Data result length:", jsonData?.result?.length);
  return jsonData;
}

export async function GetBlogsPreviewApi(): Promise<AuthorsApi> {
  // Usar revalidate para permitir generación estática
  const cacheConfig = { next: { revalidate: 7200 } }; // 2 horas

  // Siempre usar la variable de entorno para la URL del API
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}api/blogs/authors`;

  console.log("🔍 [GetBlogsPreviewApi] Environment:", process.env.NODE_ENV);
  console.log(
    "🔍 [GetBlogsPreviewApi] NEXT_PUBLIC_API_URL:",
    process.env.NEXT_PUBLIC_API_URL,
  );
  console.log("🔍 [GetBlogsPreviewApi] API URL:", apiUrl);

  const res = await fetch(apiUrl, cacheConfig);

  console.log("🔍 [GetBlogsPreviewApi] Response Status:", res.status);
  console.log("🔍 [GetBlogsPreviewApi] Response OK:", res.ok);
  console.log("🔍 [GetBlogsPreviewApi] Response URL:", res.url);

  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ [GetBlogsPreviewApi] Error Response Text:", errorText);
    console.error(
      "❌ [GetBlogsPreviewApi] Response status text:",
      res.statusText,
    );
    throw new Error(
      `Error al obtener autores: ${res.status} ${res.statusText} - ${errorText}`,
    );
  }

  const jsonData = await res.json();
  console.log("✅ [GetBlogsPreviewApi] Success! Data received:", jsonData);
  console.log('✅ [API] Psicólogos recibidos:', jsonData?.result?.length);
    
    // Debug: Mostrar enfoques de los psicólogos recibidos
    if (jsonData?.result?.length > 0) {
      console.log('🔍 [API] Enfoques de psicólogos:', jsonData.result.map((p: any) => p.enfoque));
    }
  return jsonData;
}

export const GetPsicologos = async (
  filters?: {
    pais: string[];
    genero: string[];
    idioma: string[];
    enfoque: string[];
    especialidad: string[]; //  AGREGAR ESTO
  },
  search?: string,
  page?: number,
  perPage?: number,
): Promise<PsicologoApiResponse> => {
  const params = new URLSearchParams();
  if (filters) {
    if (filters.pais && filters.pais.length)
      params.append("pais", filters.pais.join(","));
    if (filters.genero && filters.genero.length)
      params.append("genero", filters.genero.join(","));
    if (filters.idioma && filters.idioma.length)
      params.append("idioma", filters.idioma.join(","));
    if (filters.enfoque && filters.enfoque.length) {
      console.log('🔍 [API] Enviando filtro enfoque:', filters.enfoque.join(','));
      params.append("enfoque", filters.enfoque.join(","));
    }
    if (filters.especialidad && filters.especialidad.length)
      params.append("especialidad", filters.especialidad.join(","));
  }

  if (search) params.append("search", search);
  params.append("paginate", "true");

  if (perPage && page) {
    params.append("per_page", perPage.toString());
    params.append("page", page.toString());
  }

  const url = `${process.env.NEXT_PUBLIC_API_URL}api/psicologos?${params.toString()}`;

  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();

    if (data.status_message === "OK") return data;
    throw new Error(data.message || "Error al obtener psicólogos");
  } catch (error) {
    console.error("Error al obtener psicólogos:", error);
    throw error;
  }
};

export const GetPsicologosInactivos = async (
  filters?: {
    pais: string[];
    genero: string[];
    idioma: string[];
    enfoque: string[];
    especialidad: string[];
  },
  search?: string,
  page?: number,
  perPage?: number,
): Promise<PsicologoApiResponse> => {
  const params = new URLSearchParams();
  if (filters) {
    if (filters.pais && filters.pais.length)
      params.append("pais", filters.pais.join(","));
    if (filters.genero && filters.genero.length)
      params.append("genero", filters.genero.join(","));
    if (filters.idioma && filters.idioma.length)
      params.append("idioma", filters.idioma.join(","));
    if (filters.enfoque && filters.enfoque.length) {
      console.log('🔍 [API] Enviando filtro enfoque:', filters.enfoque.join(','));
      params.append("enfoque", filters.enfoque.join(","));
    }
    if (filters.especialidad && filters.especialidad.length)
      params.append("especialidad", filters.especialidad.join(","));
  }

  if (search) params.append("search", search);
  params.append("paginate", "true");

  if (perPage && page) {
    params.append("per_page", perPage.toString());
    params.append("page", page.toString());
  }

  const url = `${process.env.NEXT_PUBLIC_API_URL}api/psicologos/inactivo?${params.toString()}`;

  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();

    if (data.status_message === "OK") return data;
    throw new Error(data.message || "Error al obtener psicólogos");
  } catch (error) {
    console.error("Error al obtener psicólogos:", error);
    throw error;
  }
};

export async function GetPacientesDisabled(): Promise<PacienteDisabled[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}api/pacientes/deshabilitados`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) throw new Error("Error al obtener los pacientes deshabilitados");

  return await res.json().then((data) => {
    if (data.status_message === "OK") return data.result;
  });
}

//funcion agregada GetPacientesEnabled
export async function GetPacientesEnabled(): Promise<PacienteDisabled[]> {
  try {
    if (typeof window === "undefined") {
      throw new Error("Función solo disponible en el cliente");
    }

    // Buscar token en localStorage y sessionStorage primero
    let token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    // Si no está en storage, buscar en cookies
    if (!token) {
      const cookieMatch = document.cookie.match(/session=([^;]+)/);
      if (cookieMatch) {
        token = cookieMatch[1];
        console.log("Token encontrado en cookies:", token);
      }
    }

    if (!token) {
      console.log("No se encontró token en ningún lugar");
      throw new Error("No se encontró token de autenticación");
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}api/pacientes/habilitados`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error ${res.status}: ${res.statusText}`,
      );
    }

    const data = await res.json();

    if (data.status_message === "OK") return data.result;

    throw new Error(data.message || "Formato de respuesta inesperado");
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error("Error desconocido al obtener pacientes habilitados");
  }
}

export async function ActivarPaciente(
  id: number | null,
  idPsicologo: number | null,
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}api/pacientes/activar/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ idPsicologo }),
    },
  );

  if (!res.ok) throw new Error("Error al activar el paciente");
}

export async function DeletePsicologo(id: number | null): Promise<void> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}api/psicologos/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!res.ok) throw new Error("Error al eliminar el psicologo");
}

export async function GetPsicologosById(
  id: number | null,
): Promise<PsicologoApiResponseAlone> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}api/psicologos/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );

  if (!res.ok) throw new Error("Error al obtener el psicologo");
  return await res.json();
}

export async function UpdatePsicologo(
  id: number | null,
  data: PsicologoPreviewData,
): Promise<void> {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      value.forEach((v) => formData.append(`${key}[]`, String(v)));
    } else {
      formData.append(key, String(value));
    }
  });

  formData.append("_method", "PUT");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}api/psicologos/${id}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    },
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Error ", errorText);
    throw new Error("Error al actualizar el psicologo");
  }
}

export async function GetCitasPendientes(
  id: number | null,
): Promise<CitasPendientesApiResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}api/citas/pendientes/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );

  if (!res.ok) throw new Error("Error al obtener el psicologo");
  return await res.json();
}

/* Dashboard psicólogo */
export async function GetPsicologoDashboard(): Promise<DashboardApiResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}api/citas/dashboard/psicologo`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) throw new Error("Error al obtener los datos del dashboard");

  return await res.json();
}

//Traer citas del psicologo por mes
export async function GetCitasPsicologoPorMes(): Promise<CitasApiResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/citas/lista`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Error al obtener las citas del psicologo");

  return await res.json();
}

export async function GetPlantillas(): Promise<MarketingApiResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/marketing`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Error al obtener las plantillas:", res.status, errorText);
    throw new Error("Error al obtener las plantillas");
  }

  return await res.json();
}

//Traer citas totales por fecha
export async function GetCitasTotalesConFecha(): Promise<CitaMensual[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}api/citas/periodosmensuales`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) throw new Error("Error al obtener las citas del psicologo");

  return await res.json();
}

//Crear citas en el perfil del paciente
export async function CreateCitaParaPaciente(
  values: FormCita,
): Promise<FormCita> {
  const formatHora = (hora: string) => {
    if (hora.match(/^\d{2}:\d{2}:\d{2}$/)) return hora;
    return `${hora}:00`;
  };

  const payload = {
    ...values,
    idPaciente: parseInt(values.idPaciente, 10),
    duracion: parseInt(values.duracion, 10),
    hora_cita: formatHora(values.hora_cita),
  };

  console.log("Payload corregido:", payload);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/citas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    console.error("Error del backend:", errorData);
    throw new Error("Error al crear la cita");
  }

  return await res.json();
}

//Para que los mismos psicologos actualicen su perfil
export async function actualizarPsicologo(
  id: number | null,
  data: actulizarPsicologo,
): Promise<void> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}api/psicologos/update/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    },
  );

  if (!res.ok) throw new Error("Error al actualizar el psicologo");
}

//Para que los psicologos actualicen su perfil completo
export async function actualizarPerfilCompletoPsicologo(
  id: number | null,
  data: ActualizarPerfilCompletoPsicologo,
): Promise<void> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}api/psicologos/update/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    },
  );

  if (!res.ok) throw new Error("Error al actualizar el perfil del psicólogo");
}

export async function estadoPsicologo(id: number | null) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}api/psicologos/estado/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) throw new Error("Error al actualizar el estado del psicólogo");

    return await response.json();
  } catch (error) {
    console.error(error);
    return { result: {}, state: 0 };
  }
}

//Traer especialidades de los psicologos
export async function GetEspecialidadesPsicologos(
  id: number,
): Promise<EspecialidadesPsicologoResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}api/psicologos/especialidades/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    console.error("Error GetEspecialidadesPsicologos:", res.status, errorText);
    throw new Error("Error al obtener las especialidades de los psicologos");
  }

  return await res.json();
}

//Añadir especialidades nuevas
export async function addEspecialidad(nombre: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}api/especialidades`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nombre }),
    },
  );

  if (!res.ok) throw new Error("Error al agregar la especialidad");
}

//Remover especialidad
export async function removeEspecialidad(id: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}api/especialidades/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) throw new Error("Error al remover la especialidad");
}

//Crear personal
export async function CreatePersonal(values: Personal) {
  const payload = { ...values };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/personal`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    console.error("Error del backend:", errorData);
    throw errorData;
  }

  return await res.json();
}

// Obtener estadísticas de trabajadores por rol
export async function GetWorkersStats() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}api/users/workers/stats`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return await res.json();
}

// Obtener estadísticas de citas para dashboard admin
export async function GetCitasEstadisticas() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}api/citas/estadisticas`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return await res.json();
}

// Obtener citas sin pagar para dashboard
export async function GetCitasSinPagarDashboard() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}api/citas/sin-pagar`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return await res.json();
}

// Obtener citas pagadas para dashboard
export async function GetCitasPagadasDashboard() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}api/citas/pagadas`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return await res.json();
}

// Obtener lista de todos los trabajadores con paginación y filtros
export async function GetAllWorkers(filters?: {
  rol?: string;
  estado?: string;
  page?: number;
  perPage?: number;
}) {
  const params = new URLSearchParams();

  if (filters?.rol && filters.rol !== "all") params.append("rol", filters.rol);
  if (filters?.estado && filters.estado !== "all")
    params.append("estado", filters.estado);
  if (filters?.page) params.append("page", filters.page.toString());
  if (filters?.perPage) params.append("per_page", filters.perPage.toString());

  const queryString = params.toString();
  const url = `${process.env.NEXT_PUBLIC_API_URL}api/users/workers${queryString ? `?${queryString}` : ""
    }`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return await res.json();
}

// Cambiar rol de un trabajador
export async function ChangeWorkerRole(workerId: number, newRole: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}api/users/change-role`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ user_id: workerId, rol: newRole }),
    },
  );

  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return await res.json();
}

// Cambiar estado (activo/inactivo) de un trabajador
export async function ToggleWorkerStatus(workerId: number, newStatus: boolean) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}api/users/toggle-status`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ user_id: workerId, estado: newStatus }),
    },
  );

  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return await res.json();
}

// Agregar esta función para obtener especialidades
export async function GetEspecialidades(): Promise<Especialidad[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}api/especialidades`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    const data = await res.json();

    if (data.status_code === 200 && data.result) {
      return data.result.map((esp: any) => ({
        idEspecialidad: esp.idEspecialidad,
        nombre: esp.nombre,
        valor: esp.nombre.toLowerCase().replace(/\s+/g, "-"),
      }));
    }

    throw new Error("Formato de respuesta inesperado");
  } catch (error) {
    console.error("Error al obtener especialidades:", error);
    throw error;
  }
}

//crear funcion para idiomas disponibles
export async function GetIdiomas(): Promise<Idiomas[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/idiomas`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const data = await res.json();

    if (data.status_code === 200 && data.result) {
      return data.result.map((esp: any) => ({
        idIdioma: esp.idIdioma,
        nombre: esp.nombre,
        valor: esp.nombre.toLowerCase().replace(/\s+/g, "-"),
      }));
    }

    throw new Error("Formato de respuesta inesperado");
  } catch (error) {
    console.error("Error al obtener idiomas:", error);
    throw error;
  }
}

export async function AddIdioma(
  nombre: string,
): Promise<{ idIdioma?: number; nombre: string; valor: string }> {
  const toTitle = (s: string) =>
    s
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const slugify = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");

  const nombreNorm = toTitle((nombre || "").trim());
  if (!nombreNorm) throw new Error("El nombre del idioma es requerido.");

  let authToken = token;
  try {
    if (!authToken && typeof window !== "undefined") {
      authToken =
        localStorage.getItem("session") ||
        sessionStorage.getItem("session") ||
        (document.cookie.match(/session=([^;]+)/)?.[1] ?? "");
    }
  } catch {
    // no-op
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/idiomas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: JSON.stringify({ nombre: nombreNorm }),
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const backendMsg =
      data?.message ||
      data?.errors?.nombre?.[0] ||
      (res.status === 409 || res.status === 422
        ? "El idioma ya existe."
        : `Error ${res.status}: ${res.statusText}`);
    const err: any = new Error(backendMsg);
    err.status = res.status;
    err.payload = data;
    throw err;
  }

  const raw = data?.result ?? data ?? {};
  const nombreResp: string = raw?.nombre ?? nombreNorm;
  const idResp: number | undefined = raw?.idIdioma ?? raw?.id ?? undefined;
  const valorResp: string = raw?.valor ?? slugify(nombreResp);

  return { idIdioma: idResp, nombre: nombreResp, valor: valorResp };
}
