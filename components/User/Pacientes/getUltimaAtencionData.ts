import { parseCookies } from "nookies";
import showToast from "@/components/ToastStyle";

export async function getUltimaAtencion(idPaciente: number) {
  try {
    const cookies = parseCookies();
    const token = cookies["session"];
    const url = `${process.env.NEXT_PUBLIC_API_URL}api/atenciones/ultima/paciente/${idPaciente}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    
    if (response.ok) {
      return { success: true, data: data.result };
    } else {
      showToast("error", data.message || "No se pudo obtener la última atención");
      return { success: false, error: data.message };
    }
  } catch (error) {
    console.error(error);
    showToast("error", "Error al conectar con la API de atenciones.");
    return { success: false, error: "Error de conexión" };
  }
}
