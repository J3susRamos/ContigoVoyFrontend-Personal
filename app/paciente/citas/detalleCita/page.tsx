"use client";
import { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { useRouter } from "next/navigation";

const redirectToPaciente = (idPaciente: number) => {
  localStorage.setItem("idPaciente", String(idPaciente));
  window.location.href = "/user/pacientes/DetallePaciente";
};

const detalleCita = () => {
    const router = useRouter();
    const [cita, setCita] = useState(null);
    const fetchPaciente = async (id: number) => {
    try {
      const token = parseCookies().session;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/pacientes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) setCita(data.result);
    } catch (err) {
      console.error("Error al obtener paciente:", err);
    }
  };


  useEffect(() => {
    const loadPaciente = async () => {
      const id = localStorage.getItem("idPaciente");
      if (!id) {
        router.push("/user/pacientes");
      } else {
        const idParsed = parseInt(id);
        try {
          await fetchPaciente(idParsed);
        } catch (error) {
          console.error("Error fetching paciente:", error);
        }
      }
    };

    loadPaciente().catch((error) => {
      console.error("Error in loadPaciente:", error);
    });
  }, [router]);

    return (
        <>
        </>
    )

}