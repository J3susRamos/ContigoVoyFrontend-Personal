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
      <div className="space-y-6 w-full xl:max-w-md 2xl:max-w-lg">
        {/* Tarjeta principal de resumen con diseño mejorado */}
        <div className="bg-gradient-to-br from-[#E7E7FF] to-[#F5F5FF] dark:from-[#19191a] dark:to-[#2a2a2b] rounded-3xl pt-6 shadow-lg border border-purple-100 dark:border-gray-700">
          <div className="flex items-center rounded-r-full py-4 px-6 text-[#fff] bg-gradient-to-r from-[#6364F4] to-[#7C7CF5] justify-between font-medium text-xl w-4/5 shadow-lg">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Resumen General</span>
            </div>
          </div>
          
          <div className="px-6 pb-6 mt-4">
            {/* Grid de estadísticas con iconos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Citas Pendientes */}
              <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-yellow-200 dark:border-yellow-700">
                <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pendientes</p>
                  <p className="text-xl font-bold text-yellow-700 dark:text-yellow-300">{citasPsicologo.citas_pendientes}</p>
                </div>
              </div>

              {/* Citas Canceladas */}
              <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-red-200 dark:border-red-700">
                <div className="bg-red-100 dark:bg-red-900 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Canceladas</p>
                  <p className="text-xl font-bold text-red-700 dark:text-red-300">{citasPsicologo.citas_canceladas}</p>
                </div>
              </div>

              {/* Minutos Reservados */}
              <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-blue-200 dark:border-blue-700">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Min. Reservados</p>
                  <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{citasPsicologo.total_minutos_reservados}</p>
                </div>
              </div>

              {/* Citas Sin Pagar */}
              <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-orange-200 dark:border-orange-700">
                <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Sin Pagar</p>
                  <p className="text-xl font-bold text-orange-700 dark:text-orange-300">{citasPsicologo.citas_sin_pagar}</p>
                </div>
              </div>

              {/* Citas Completadas */}
              <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-green-200 dark:border-green-700">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Completadas</p>
                  <p className="text-xl font-bold text-green-700 dark:text-green-300">{citasPsicologo.citas_realizadas}</p>
                </div>
              </div>

              {/* Citas Ausentes */}
              <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="bg-gray-100 dark:bg-gray-900 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Ausentes</p>
                  <p className="text-xl font-bold text-gray-700 dark:text-gray-300">{citasPsicologo.citas_ausentes}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjeta Total Pacientes con diseño mejorado */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-8 rounded-3xl text-center shadow-lg border border-purple-200 dark:border-purple-700">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-purple-200 dark:bg-purple-700 p-3 rounded-full">
              <svg className="w-8 h-8 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="font-medium text-lg text-purple-700 dark:text-purple-300 mb-2">Total Pacientes</div>
          <div className="font-bold text-5xl text-purple-800 dark:text-purple-200">{citasPsicologo.total_pacientes}</div>
        </div>

        {/* Tarjeta Nuevos Pacientes con diseño mejorado */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-8 rounded-3xl text-center shadow-lg border border-blue-200 dark:border-blue-700">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-blue-200 dark:bg-blue-700 p-3 rounded-full">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          </div>
          <div className="font-medium text-lg text-blue-700 dark:text-blue-300 mb-2">Nuevos Pacientes</div>
          <div className="font-bold text-5xl text-blue-800 dark:text-blue-200">{citasPsicologo.nuevos_pacientes}</div>
        </div>
      </div>
    </>
  );
}