import { parseCookies } from "nookies";
import showToast from "@/components/ToastStyle";

export async function getPaciente(idPaciente: number) {
  try {
    const cookies = parseCookies();
    const token = cookies["session"];
    const url = `${process.env.NEXT_PUBLIC_API_URL}api/pacientes/${idPaciente}`;
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
      showToast("success", "Paciente obtenido correctamente");
      return { success: true, data: data.result };
    } else {
      showToast("error", data.message || "Error al obtener el paciente");
      return { success: false, error: data.message };
    }
  } catch (error) {
    console.error(error);
    showToast("error", "Error de conexión. Intenta nuevamente.");
    return { success: false, error: "Error de conexión" };
  }
}
