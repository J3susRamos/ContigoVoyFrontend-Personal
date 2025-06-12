import { parseCookies } from "nookies";

// state 0: Error
// state 1: Successful
async function pacientesGet() {
    try{
        const cookies = parseCookies();
        const token = cookies["session"];
        const url = `${process.env.NEXT_PUBLIC_API_URL}api/pacientes`;
        const response = await fetch(url, {
            method: "GET",
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
            return {result: [], state: 1};
        }
    }catch (error) {
        console.error(error);
        return {result: [], state: 0};  
    }
}

export default pacientesGet;
