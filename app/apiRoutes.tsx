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
  PacienteDisabled,
} from "@/interface";
import { parseCookies } from "nookies";

export const token = parseCookies()["session"];

export async function BlogsWebSite(): Promise<ApiResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/blogs`, {
    cache: 'force-cache' // Cache para generación estática
  });
  if (!res.ok) {
    throw new Error("Error al obtener los datos");
  }
  return await res.json();
}

export async function GetCagetories(): Promise<CategoriaApi> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/categorias`, {
    cache: 'force-cache' // Cache para generación estática
  });
  if (!res.ok) {
    throw new Error("Error al obtener los datos");
  }
  return await res.json();
}

export async function GetBlogsPreviewApi(): Promise<AuthorsApi> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}api/blogs/authors`,
    {
      cache: 'force-cache' // Cache para generación estática
    }
  );
  if (!res.ok) {
    throw new Error("Error al obtener los datos");
  }
  return await res.json();
}

export const GetPsicologos = async (
  filters?: {
    pais: string[];
    genero: string[];
    idioma: string[];
    enfoque: string[];
  },
  search?: string,
  page?: number,
  perPage?: number
): Promise<PsicologoApiResponse> => {
  const params = new URLSearchParams();
  if (filters) {
    if (filters.pais && filters.pais.length) params.append("pais", filters.pais.join(","));
    if (filters.genero && filters.genero.length) params.append("genero", filters.genero.join(","));
    if (filters.idioma && filters.idioma.length) params.append("idioma", filters.idioma.join(","));
    if (filters.enfoque && filters.enfoque.length)
      params.append("enfoque", filters.enfoque.join(","));
  }


  if (search) params.append("search", search);
  params.append("paginate", "true");

  if (perPage && page) {
    params.append("per_page", perPage.toString());
    params.append("page", page.toString());
  } const url = `${process.env.NEXT_PUBLIC_API_URL
    }api/psicologos?${params.toString()}`;

  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    if (data.status_message === "OK") {
      return data; // Retornar toda la respuesta
    } else {
      throw new Error(data.message || "Error al obtener psicólogos");
    }
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
  },
  search?: string,
  page?: number,
  perPage?: number
): Promise<PsicologoApiResponse> => {
  const params = new URLSearchParams();
  if (filters) {
    if (filters.pais && filters.pais.length) params.append("pais", filters.pais.join(","));
    if (filters.genero && filters.genero.length) params.append("genero", filters.genero.join(","));
    if (filters.idioma && filters.idioma.length) params.append("idioma", filters.idioma.join(","));
    if (filters.enfoque && filters.enfoque.length)
      params.append("enfoque", filters.enfoque.join(","));
  }


  if (search) params.append("search", search);
  params.append("paginate", "true");

  if (perPage && page) {
    params.append("per_page", perPage.toString());
    params.append("page", page.toString());
  } const url = `${process.env.NEXT_PUBLIC_API_URL
    }api/psicologos/inactivo?${params.toString()}`;

  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    if (data.status_message === "OK") {
      return data; // Retornar toda la respuesta
    } else {
      throw new Error(data.message || "Error al obtener psicólogos");
    }
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
    }
  );

  if (!res.ok) {
    throw new Error("Error al obtener los pacientes deshabilitados");
  }
  return await res.json().then((data) => {
    if (data.status_message === "OK") {
      return data.result;
    }
  });
}

export async function ActivarPaciente(
  id: number | null,
  idPsicologo: number | null
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
      body: JSON.stringify({ idPsicologo })
    },
  );

  if (!res.ok) {
    throw new Error("Error al activar el paciente");
  }
}

export async function DeletePsycologo(id: number | null): Promise<void> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}api/psicologos/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error("Error al eliminar el psicologo");
  }
}

export async function GetPsicologosById(
  id: number | null
): Promise<PsicologoApiResponseAlone> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}api/psicologos/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Error al obtener el psicologo");
  }
  return await res.json();
}

export async function UpdatePsicologo(
  id: number | null,
  data: PsicologoPreviewData
): Promise<void> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}api/psicologos/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    throw new Error("Error al actualizar el psicologo");
  }
}

export async function GetCitasPendientes(
  id: number | null
): Promise<CitasPendientesApiResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}api/citas/pendientes/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Error al obtener el psicologo");
  }
  return await res.json();
}

/* Información de citas totales, citas completadas, citas pendientes, citas canceladas,
total de minutos reservados, total de pacientes y nuevos pacientes */
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
    }
  );

  if (!res.ok) {
    throw new Error("Error al obtener los datos del dashboard");
  }

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

  if (!res.ok) {
    throw new Error("Error al obtener las citas del psicologo");
  }

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
    }
  );

  if (!res.ok) {
    throw new Error("Error al obtener las citas del psicologo");
  }

  return await res.json();
}


//Crear citas en el perfil del paciente
export async function CreateCitaParaPaciente(values: FormCita): Promise<FormCita> {
  const formatHora = (hora: string) => {
    // Si ya tiene segundos, la dejamos igual
    if (hora.match(/^\d{2}:\d{2}:\d{2}$/)) return hora;
    // Si no, le agregamos ":00"
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

//Para que los mismos psicologos actualicen su perfil, solo el nombre apellido, foto y especialidades
export async function actualizarPsicologo(
  id: number | null,
  data: actulizarPsicologo
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
    }
  );

  if (!res.ok) {
    throw new Error("Error al actualizar el psicologo");
  }
}

//Para que los psicologos actualicen su perfil completo con todos los datos profesionales
export async function actualizarPerfilCompletoPsicologo(
  id: number | null,
  data: ActualizarPerfilCompletoPsicologo
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
    }
  );

  if (!res.ok) {
    throw new Error("Error al actualizar el perfil del psicólogo");
  }
}

export async function estadoPsicologo(
  id: number | null,
) {
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
      }
    );

    if (!response.ok) {
      throw new Error("Error al actualizar el estado del psicólogo");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return { result: {}, state: 0 };
  }
}

//Obtener las especialidades de los psicologos
export async function GetEspecialidadesPsicologos(id: number): Promise<EspecialidadesPsicologoResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/psicologos/especialidades/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error al obtener las especialidades de los psicologos");
  }

  return await res.json();
}
