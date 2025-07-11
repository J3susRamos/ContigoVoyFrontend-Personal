import {
  ApiResponse,
  AuthorsApi,
  CategoriaApi,
  CitasPendientesApiResponse,
  PsicologoApiResponseAlone,
  PsicologoPreviewData,
  DashboardApiResponse,
  CitasApiResponse,
  MarketingApiResponse,
  CitaMensual,
} from "@/interface";
import { parseCookies } from "nookies";

export const token = parseCookies()["session"];

export async function BlogsWebSite(): Promise<ApiResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/blogs`);
  if (!res.ok) {
    throw new Error("Error al obtener los datos");
  }
  return await res.json();
}

export async function GetCagetories(): Promise<CategoriaApi> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/categorias`);
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
) => {
  const params = new URLSearchParams();
  if (filters){
    if (filters.pais.length) params.append("pais", filters.pais.join(","));
  if (filters.genero.length) params.append("genero", filters.genero.join(","));
  if (filters.idioma.length) params.append("idioma", filters.idioma.join(","));
  if (filters.enfoque.length)
    params.append("enfoque", filters.enfoque.join(","));
  }
  

  if (search) params.append("search", search);
  params.append("paginate", "true");

  if(perPage && page){
    params.append("per_page", perPage.toString());
    params.append("page", page.toString());
  }

  const url = `${
    process.env.NEXT_PUBLIC_API_URL
  }api/psicologos?${params.toString()}`;

  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });
    const data = await res.json();

    if (data.status_message === "OK") {
      return data.result;
    } else {
      console.error("Error:", data.message);
    }
  } catch (error) {
    console.error("Error al obtener psicólogos:", error);
  }
};

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
