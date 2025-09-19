import { parseCookies } from "nookies";

// state 0: Error
// state 1: Successful
async function pacientesGet(
  page = 1,
  perPage = 10,
  paginate = true,
  filters: {
    genero?: string[];
    edad?: string[];
    fechaUltimaCita?: string[];
  } = {},
  nombre = ""
) {
  try {
    const cookies = parseCookies();
    const token = cookies["session"];
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}api/pacientes`);

    if (paginate) {
      url.searchParams.append("paginate", "true");
      url.searchParams.append("page", page.toString());
      url.searchParams.append("per_page", perPage.toString());
    }

    if (filters.genero?.length) {
      url.searchParams.append("genero", filters.genero.join(","));
    }

    if (filters.edad?.length) {
      url.searchParams.append("edad", filters.edad.join(",")); 
    }

    if (
      filters.fechaUltimaCita &&
      filters.fechaUltimaCita.length === 2
    ) {
      url.searchParams.append("fecha_inicio", filters.fechaUltimaCita[0]);
      url.searchParams.append("fecha_fin", filters.fechaUltimaCita[1]);
    }

    if (nombre !== "") {
      url.searchParams.append("nombre", nombre);
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return { result: data.result, state: 2 };
    } else {
      return { result: [], state: 1 };
    }
  } catch (error) {
    console.error(error);
    return { result: [], state: 0 };
  }
}

export default pacientesGet;
