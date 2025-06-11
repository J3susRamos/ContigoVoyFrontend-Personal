"use client";
import React, { useEffect, useState } from "react";

export default function DashboardResumen() {
  const [datos, setDatos] = useState({
    citas_completadas: 0,
    citas_pendientes: 0,
    citas_canceladas: 0,
    total_minutos_reservados: 0,
    total_pacientes: 0,
    nuevos_pacientes: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token usado:", "2|vBqJWZdysEz5EJ7S0Zi2pxk4gwd4lTRXm6SF5mD55450f717"); // 🔍 Verifica si está bien

        const response = await fetch("http://127.0.0.1:8000/api/dashboard/psicologo", {
          headers: {
            Authorization: `Bearer ${token}`, 
            Accept: "application/json",
          },
        });
        const result = await response.json();
        console.log("Respuesta del backend:", result);

        if (result.success) {
          setDatos(result.data);
        } else {
          console.warn("Error en datos del dashboard:", result.message);
        }
      } catch (error) {
        console.error("Error al conectar con el dashboard:", error);
      }
    };

    fetchData().catch(error => {
      console.error("Error fetching dashboard data:", error);
    });
  }, []);

  return (
    <>
      <div className="space-y-6 md:max-w-xl w-full">
        <div className="bg-card rounded-3xl pt-8">
          <div className="flex rounded-r-full py-6 text-[#fff] bg-[#6364F4] justify-center font-normal text-2xl w-3/4 ">
            Resumen
          </div>
          <div className="mx-10 sm:mx-14 md:mx-20 lg:mx-24">
            <ul className="list-disc pl-7 text-[#634AE2] text-xl font-normal   p-6">
              <li>{datos.citas_completadas} citas completadas</li>
              <li>{datos.citas_pendientes} citas pendientes</li>
              <li>{datos.citas_canceladas} citas canceladas</li>
              <li>{datos.total_minutos_reservados} minutos reservados</li>
            </ul>
          </div>
        </div>

        <div className="bg-card justify-items-center p-6 rounded-3xl text-[#634AE2]">
          <div className="font-normal text-xl">Total Paciente</div>
          <div className="font-bold text-6xl">{datos.total_pacientes}</div>
        </div>

        <div className="bg-card justify-items-center p-6 rounded-3xl text-[#634AE2]">
          <div className="font-normal text-xl">Nuevos Pacientes</div>
          <div className="font-bold text-6xl">{datos.nuevos_pacientes}</div>
        </div>
      </div>
    </>
  );
}