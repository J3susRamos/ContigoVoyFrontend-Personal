import {
  ApiResponse,
  AuthorsApi,
  CategoriaApi,
  CitasPendientesApiResponse,
  PsicologoApiResponse,
  PsicologoApiResponseAlone,
  PsicologoPreviewData,
  DashboardApiResponse,
  GeneroEstadisticaApiResponse,
  CitasApiResponse,
  MarketingApiResponse,
  CitaMensual
} from "@/interface";
import {parseCookies} from "nookies";

export const token = parseCookies()["session"];

export async function BlogsWebSite(): Promise<ApiResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/blogs`);
  if (!res.ok) {
    throw new Error("Error al obtener los datos");
  }
  return await res.json();
}

export async function GetCagetories(): Promise<CategoriaApi> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}api/categorias`
  );
  if (!res.ok) {
    throw new Error("Error al obtener los datos");
  }
  return await res.json();
}

export async function GetBlogsPreviewApi(): Promise<AuthorsApi> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}api/blogs/authors`
  );
  if (!res.ok) {
    throw new Error("Error al obtener los datos");
  }
  return await res.json();
}

export async function GetPsicologos(): Promise<PsicologoApiResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}api/psicologos`
  );
  if (!res.ok) {
    throw new Error("Error al obtener los datos");
  }
  return await res.json();
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

/*Informacion de citas totales, citas completadas, citas pendientes, citas canceladas, 
total minutos reservados, total pacientes y nuevos pacientes */
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

export async function GetPacientesEstadisticasEdad(): Promise<GeneroEstadisticaApiResponse> {
  const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}api/pacientes/estadisticas/genero`,
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
    throw new Error("Error al obtener los datos de estadisticas de genero");
  }

  return await res.json();
}

//Traer citas del psicologo por mes
export async function GetCitasPsicologoPorMes(): Promise<CitasApiResponse>{
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}api/citas/`,
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

export async function GetPlantillas(): Promise<MarketingApiResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}api/marketing`,
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
    const errorText = await res.text();
    console.error("Error al obtener las plantillas:", res.status, errorText);
    throw new Error("Error al obtener las plantillas");
  }

  return await res.json();
}

//Traer citas totales por fecha
export async function GetCitasTotalesConFecha(): Promise<CitaMensual[]>{
  const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}api/citas/periodosmensuales/`,
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