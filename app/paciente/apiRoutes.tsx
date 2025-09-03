import { DateValue } from "@heroui/react";
import { parseCookies } from "nookies";

const token = parseCookies()["session"];

export const GetCita = async (id: number) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}api/citas/paciente/${id}`;
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
      return data;
    } else {
      throw new Error(data.message || "Error al obtener cita");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.name != "AbortError") {
        console.error("Error al obtener cita:", error);
        throw error;
      }
    }
    
  }
};

export const GetCitas = async (
  currentPage: number,
  pageSize: number,
  estado_cita: string,
  estado_boucher: string,
  fecha_inicio: DateValue | null,
  fecha_fin: DateValue | null,
  signal: AbortSignal
) => {
  const params = new URLSearchParams();
  if (estado_cita) params.append("estado_cita", estado_cita);
  if (estado_boucher) params.append("estado_boucher", estado_boucher);
  if (fecha_inicio && fecha_fin) {
    if (fecha_inicio.compare(fecha_fin) <= 0) {
      params.append("fecha_inicio", fecha_inicio.toString());
      params.append("fecha_fin", fecha_fin.toString());
    }
  } else {
    if (fecha_inicio) params.append("fecha_inicio", fecha_inicio.toString());
    if (fecha_fin) params.append("fecha_fin", fecha_fin.toString());
  }

  params.append("paginate", "true");

  if (currentPage) {
    params.append("page", currentPage.toString());
  }
  if (pageSize) params.append("per_page", pageSize.toString());

  const url = `${
    process.env.NEXT_PUBLIC_API_URL
  }api/citas/enlaces?${params.toString()}`;

  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      signal,
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    if (data.status_message === "OK") {
      return data;
    } else {
      throw new Error(data.message || "Error al obtener psicólogos");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.name != "AbortError") {
        console.error("Error al obtener cita:", error);
        throw error;
      }
    }
    
  }
};

export const PostBoucher = async (
  idCita: number | undefined,
  image64: string
) => {
  if (!idCita) return;

  const payload = {
    idCita,
    imagen: image64,
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}api/boucher/enviar`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    throw new Error("Error al crear la cita");
  }
  return true;
};
