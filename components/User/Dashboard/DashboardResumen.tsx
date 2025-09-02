"use client";
import { GetPsicologoDashboard } from "@/app/apiRoutes";
import { DashboardResult } from "@/interface";
import React, { useEffect, useState } from "react";

export default function DashboardResumen() {
  const [citasPsicologo, setCitasPsicologo] = useState<DashboardResult>({
      total_citas: 0,
      citas_pendientes: 0,
      citas_ausentes:0,
      citas_realizadas:0,
      citas_reprogramadas:0,
      citas_sin_pagar:0,
      citas_canceladas: 0,
      total_minutos_reservados: 0,
      total_pacientes: 0,
      nuevos_pacientes: 0,
    });
 
const fetchDashboard = async () => {
    try {
      const response = await GetPsicologoDashboard();
      return response.result;
    } catch (error) {
      console.error("Error al cargar el dashboard", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchDashboard();
      if (!result) return;

      setCitasPsicologo({
        total_citas: result?.total_citas ?? 0,
        citas_pendientes: result?.citas_pendientes ?? 0,
        citas_canceladas: result?.citas_canceladas ?? 0,
        total_minutos_reservados: result?.total_minutos_reservados ?? 0,
        total_pacientes: result?.total_pacientes ?? 0,
        nuevos_pacientes: result?.nuevos_pacientes ?? 0,
        citas_ausentes: result?.citas_ausentes ?? 0,
        citas_realizadas: result?.citas_realizadas ?? 0,
        citas_reprogramadas: result?.citas_reprogramadas ?? 0,
        citas_sin_pagar: result?.citas_sin_pagar ?? 0
      });
    };
    loadData();
  }, []);

  return (
    <>
      <div className="space-y-6 md:max-w-xl w-full">
        <div className="bg-white dark:bg-[#19191a] rounded-3xl pt-8">
          <div className="flex rounded-r-full py-6 text-[#fff] bg-[#6364F4] justify-center font-normal text-2xl w-3/4 ">
            Resumen
          </div>
          <div className="mx-10 sm:mx-14 md:mx-20 lg:mx-24">
            <ul className="list-disc pl-7 text-[#634AE2] dark:text-white text-xl font-normal p-6">
              <li>{citasPsicologo.citas_pendientes} citas pendientes</li>
              <li>{citasPsicologo.citas_canceladas} citas canceladas</li>
              <li>{citasPsicologo.total_minutos_reservados} minutos reservados</li>
            </ul>
          </div>
        </div>

        <div className="bg-white dark:bg-[#19191a] justify-items-center p-6 rounded-3xl text-[#634AE2] dark:text-white">
          <div className="font-normal text-xl">Total Pacientes</div>
          <div className="font-bold text-6xl">{citasPsicologo.total_pacientes}</div>
        </div>

        <div className="bg-white dark:bg-[#19191a] justify-items-center p-6 rounded-3xl text-[#634AE2] dark:text-white">
          <div className="font-normal text-xl">Nuevos Pacientes</div>
          <div className="font-bold text-6xl">{citasPsicologo.nuevos_pacientes}</div>
        </div>
      </div>
    </>
  );
}