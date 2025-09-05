import React, { useEffect, useState } from "react";

import { GetCitasTotalesConFecha, GetPsicologoDashboard } from "@/app/apiRoutes";
import { Icons } from "@/icons";
import { CitaMensual, DashboardResult } from "@/interface";
import PieChartGrafic from "../grafics/PieChartGrafic";
import LineChartGrafic from "../grafics/LineChartGrafic";

const COLORS = ["#BABAFF", "#58A6FF", "#9494F3", "#B158FF", "#197a50", "#b9cd38"];


// Datos para el LineChart


export default function Appointments() {
  const [citasPsicologo, setCitasPsicologo] = useState<DashboardResult>({
    total_citas: 0,
    citas_sin_pagar: 0,
    citas_realizadas: 0,
    citas_pendientes: 0,
    citas_canceladas: 0,
    citas_reprogramadas: 0,
    total_minutos_reservados: 0,
    total_pacientes: 0,
    nuevos_pacientes: 0,
    citas_ausentes: 0
  });

  const [citasMensuales, setCitasMensuales] = useState<CitaMensual[]>([]);
  //Estado de carga para
  const [loading, setLoading] = useState<boolean>(true);
  // Datos para el gráfico de pastel
  const estados = [
    { name: "Citas realizadas"},
    { name: "Citas canceladas"},
    { name: "Citas pendientes"},
    { name: "Citas sin pagar"},
    { name: "Citas Reprogramadas"},
    { name: "Ausencias"},
  ];
  const fetchDashboard = async () => {
    try {
      const response = await GetPsicologoDashboard();
      return response.result;
    } catch (error) {
      console.error(error);
    }
  };
  const fetchCitas = async (): Promise<CitaMensual[] | undefined> => {
  try {
    const response = await GetCitasTotalesConFecha();
    return response;
  } catch (error) {
    console.log(error);
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
        citas_sin_pagar: result?.citas_sin_pagar ?? 0,
        citas_realizadas: result?.citas_realizadas ?? 0,
        citas_pendientes: result?.citas_pendientes ?? 0,
        citas_canceladas: result?.citas_canceladas ?? 0,
        citas_ausentes: result?.citas_ausentes ?? 0,
        citas_reprogramadas: result?.citas_reprogramadas ?? 0,
        total_minutos_reservados: result?.total_minutos_reservados ?? 0,
        total_pacientes: result?.total_pacientes ?? 0,
        nuevos_pacientes: result?.nuevos_pacientes ?? 0
      });
      setLoading(false);    };
    loadData();
  }, []);
console.log(citasMensuales)
  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      
      {/* Información de citas - Cards responsivos */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 lg:mb-8">
        <div className="flex-1 bg-card dark:bg-card rounded-xl p-4 flex items-center gap-6">
          <div className="flex-shrink-0">
            <span
              className="w-6 h-6 block"
              dangerouslySetInnerHTML={{
                __html: Icons.calendario,
              }}
            />
          </div>
          <span className="text-sm md:text-base font-medium text-card-foreground dark:text-card-foreground ">
            {citasPsicologo["citas_pendientes"]} citas reservadas
          </span>
        </div>
        
        <div className="flex-1 bg-card dark:bg-card rounded-xl p-4 flex items-center gap-6">
          <div className="flex-shrink-0">
            <span
              className="w-6 h-6 block"
              dangerouslySetInnerHTML={{
                __html: Icons.estadisticas,
              }}
            />
          </div>
          <span className="text-sm md:text-base font-medium text-card-foreground dark:text-card-foreground">
            {citasPsicologo["total_minutos_reservados"]} min. ocupados
          </span>
        </div>
      </div>

      {/* Gráficos - Layout responsivo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        
        {/* LineChart - Citas del período */}
        <div className="w-full bg-card dark:bg-card rounded-2xl p-4 lg:p-6 flex flex-col border border-gray-200 dark:border-gray-700">
          <div className="rounded-r-full w-full max-w-[300px] h-[50px] md:h-[60px] bg-primary dark:bg-primary mb-4 flex items-center justify-center">
            <p className="text-primary-foreground dark:text-primary-foreground font-medium text-center px-4 text-sm md:text-lg lg:text-xl">
              Citas totales del período
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
        
        {/* PieChart - Estado de citas */}
       <div className="w-full bg-card dark:bg-card rounded-2xl p-4 lg:p-6 flex flex-col border border-gray-200 dark:border-gray-700">
          <div className="rounded-r-full w-full max-w-[300px] h-[50px] md:h-[60px] bg-primary dark:bg-primary mb-4 flex items-center justify-center">
            <p className="text-primary-foreground dark:text-primary-foreground font-medium text-center px-4 text-sm md:text-lg lg:text-xl">
              Estado de citas
            </p>
          </div>
          
          <div className="w-full h-[250px] md:h-[300px] lg:h-[350px] flex items-center justify-center">
            {loading ? (
                <div className="w-[150px] md:w-[200px] h-[150px] md:h-[200px] rounded-full bg-muted animate-pulse relative">
                  <div className="absolute top-0 left-0 w-full h-full border-[4px] border-primary/20 rounded-full animate-spin-slow"></div>
                  <div className="absolute top-[25%] left-[25%] w-[75px] md:w-[100px] h-[75px] md:h-[100px] bg-background rounded-full"></div>
                </div>
            ) : (
                <PieChartGrafic data={citasPsicologo} />
            )}
          </div>
            {/* Leyenda */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 place-items-center">
            {estados.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: COLORS[index] }}
                  ></div>
                  <span className="text-primary dark:text-primary-foreground font-normal text-xs md:text-sm truncate">
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