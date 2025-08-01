import { parseCookies } from "nookies";

async function pacientesDelete(idPaciente: number) {
    try{
        const cookies = parseCookies();
        const token = cookies["session"];
        const url = `${process.env.NEXT_PUBLIC_API_URL}api/pacientes/${idPaciente}`;
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
         });
        if(response.ok){
            const data = await response.json();
            return {result: data.result, state: 2};
        }else{
            return {result: {}, state: 1};
        }
    }catch (error) {
        console.error(error);
        return {result: {}, state: 0};  
    }
}

async function pacientesDesactivar(idPaciente: number) {
    try {
        const cookies = parseCookies();
        const token = cookies["session"];
        const url = `${process.env.NEXT_PUBLIC_API_URL}api/pacientes/desactivar/${idPaciente}`;

        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            return { result: data, state: 2 };
        } else {
            return { result: {}, state: 1 };
        }
    } catch (error) {
        console.error(error);
        return { result: {}, state: 0 };
    }
}

export {pacientesDelete, pacientesDesactivar};