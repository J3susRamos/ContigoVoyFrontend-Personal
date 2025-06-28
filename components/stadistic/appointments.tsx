import React, { useEffect, useState } from "react";

import { GetCitasTotalesConFecha, GetPsicologoDashboard } from "@/app/apiRoutes";
import { Icons } from "@/icons";
import { CitaMensual, DashboardResult } from "@/interface";
import PieChartGrafic from "./grafics/PieChartGrafic";
import LineChartGrafic from "./grafics/LineChartGrafic";

const COLORS = ["#BABAFF", "#58A6FF", "#9494F3", "#B158FF"];

// Datos para el LineChart


export default function Appointments() {
  const [citasPsicologo, setCitasPsicologo] = useState<DashboardResult>({
    total_citas: 0,
    citas_completadas: 0,
    citas_pendientes: 0,
    citas_canceladas: 0,
    total_minutos_reservados: 0,
    total_pacientes: 0,
    nuevos_pacientes: 0,
    citas_confirmadas: 0,
  });

  const [citasMensuales, setCitasMensuales] = useState<CitaMensual[]>([]);
  //Estado de carga para
  const [loading, setLoading] = useState<boolean>(true);
  // Datos para el gráfico de pastel
  const genero = [
    { name: "Citas completadas"},
    { name: "Citas canceladas"},
    { name: "Citas pendientes"},
    { name: "Ausencias"},
  ];
  const fetchDashboard = async () => {
    try {
      const response = await GetPsicologoDashboard();
      return response.result;
    } catch (error) {
      console.error("Error al cargar el dashboard", error);
    }
  };
  const fetchCitas = async (): Promise<CitaMensual[] | undefined> => {
  try {
    const response = await GetCitasTotalesConFecha();
    return response;
  } catch (error) {
    console.log("Error al cargar las citas con fecha");
  }
};
  useEffect(() => {
    const loadData = async () => {

      const citasResult = await fetchCitas();
      setCitasMensuales(citasResult ?? [])
      
      const result = await fetchDashboard();
      if (!result) return;

      setCitasPsicologo({
        total_citas: result?.total_citas ?? 0,
        citas_completadas: result?.citas_completadas ?? 0,
        citas_pendientes: result?.citas_pendientes ?? 0,
        citas_canceladas: result?.citas_canceladas ?? 0,
        total_minutos_reservados: result?.total_minutos_reservados ?? 0,
        total_pacientes: result?.total_pacientes ?? 0,
        nuevos_pacientes: result?.nuevos_pacientes ?? 0,
        citas_confirmadas: result?.citas_confirmadas ?? 0,
      });
      setLoading(false);
    };
    loadData();
  }, []);
console.log(citasMensuales)
  return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 max-w-5xl mx-auto w-full p-4">
        {/* Header */}
        <div className="col-span-2 flex flex-col md:flex-row items-center justify-between w-full mb-4 font-normal gap-4">
          <div className="flex flex-col md:flex-row items-center text-base gap-4 md:gap-6 w-full">
            <div className="bg-card dark:bg-card h-fit px-3 py-2 rounded-xl flex gap-3 items-center w-full md:w-auto">
              <span dangerouslySetInnerHTML={{ __html: Icons.calendario }} />
              <span>{citasPsicologo["citas_confirmadas"]} citas reservadas</span>
            </div>
            <div className="bg-card dark:bg-card h-fit px-3 py-2 rounded-xl flex gap-3 items-center w-full md:w-auto">
              <span dangerouslySetInnerHTML={{ __html: Icons.estadisticas }} />
              <span>
              {citasPsicologo["total_minutos_reservados"]} min. ocupados
            </span>
            </div>
          </div>
        </div>
  <div className="max-xl:flex max-xl:flex-col max-xl:gap-8 flex gap-10 max-sm:max-w-[300px]">
        {/* LineChart */}
        <div className="w-full min-h-[400px] bg-card dark:bg-card rounded-2xl flex flex-col min-w-[480px] ">
          <div className="rounded-r-full w-[247px] h-[60px] bg-primary dark:bg-primary mt-6 flex items-center justify-center">
            <p className="text-primary-foreground dark:text-primary-foreground font-medium text-center mr-0 sm:mr-10 text-lg sm:text-xl">
              Citas totales <br /> del período:
            </p>
          </div>
          {/* Gráfico para las citas totales del periodo */}
         {loading? <div className="flex-1 flex items-center justify-center">
          <div className="w-full h-[80%] flex flex-col justify-center px-6">
            <div className="h-4 w-24 bg-muted rounded mb-2 animate-pulse" />
            <div className="flex-1 w-full bg-muted/30 rounded animate-pulse" />
            <div className="flex justify-between mt-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-6 h-4 bg-muted rounded animate-pulse" />
              ))}
              </div>
            </div>
          </div>: <LineChartGrafic datastadistics={citasMensuales}/>}
        </div>
        
        {/* PieChart */}
        <div className="w-full h-fit bg-card dark:bg-card rounded-2xl min-w-[480px] flex flex-col min-h-[400px] max-sm:max-w-[300px]">
          <div className="rounded-r-full w-[247px] h-[60px] bg-primary dark:bg-primary mt-6 flex items-center justify-center">
            <p className="text-primary-foreground dark:text-primary-foreground font-medium text-start mr-0 sm:mr-10 text-lg sm:text-xl">
              Estado de <br /> cita:
            </p>
          </div>
          <div className="w-full h-[180px] sm:h-[240px] flex items-center justify-center">
            {loading ? (
                <div className="w-[120px] sm:w-[200px] h-[120px] sm:h-[200px] rounded-full bg-muted animate-pulse relative">
                  <div className="absolute top-0 left-0 w-full h-full border-[4px] border-primary/20 rounded-full animate-spin-slow"></div>
                  <div className="absolute top-[25%] left-[25%] w-[50px] sm:w-[100px] h-[50px] sm:h-[100px] bg-background rounded-full"></div>
                </div>
            ) : (
                <PieChartGrafic data={citasPsicologo} />
            )}
          </div>
          <div className="grid grid-cols-2 m-auto gap-x-3 h-[80px]">
            {genero.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                  ></div>
                  <span className="text-primary dark:text-primary-foreground font-normal text-base">
                {entry.name}
              </span>
                </div>
            ))}
          </div>
          </div>
        </div>
      </div>
  );
}