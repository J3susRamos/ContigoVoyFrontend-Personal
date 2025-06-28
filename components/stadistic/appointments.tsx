import React, { useEffect, useState } from "react";
import {
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";
import {  CustomTooltip } from "./CustomTooltipComponent";
import { GetPsicologoDashboard } from "@/app/apiRoutes";
import { Icons } from "@/icons";
import { DashboardResult } from "@/interface";
import PieChartGrafic from "./grafics/PieChartGrafic";

const COLORS = ["#BABAFF", "#58A6FF", "#9494F3", "#B158FF"];

// Datos para el LineChart
const data = [
  { name: "01", uv: 4000, pv: 2400 },
  { name: "02", uv: 3000, pv: 1398 },
  { name: "03", uv: 2000, pv: 9800 },
  { name: "04", uv: 2780, pv: 3908 },
  { name: "05", uv: 1890, pv: 4800 },
  { name: "06", uv: 2390, pv: 3800 },
];

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

  useEffect(() => {
    const loadData = async () => {
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
      setLoading(false);    };
    loadData();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      
      {/* Información de citas - Cards responsivos */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 lg:mb-8">
        <div className="flex-1 bg-card dark:bg-card rounded-xl p-4 flex items-center gap-3">
          <div className="flex-shrink-0">
            <span
              className="w-6 h-6 block"
              dangerouslySetInnerHTML={{
                __html: Icons.calendario,
              }}
            />
          </div>
          <span className="text-sm md:text-base font-medium text-card-foreground dark:text-card-foreground">
            {citasPsicologo["citas_confirmadas"]} citas reservadas
          </span>
        </div>
        
        <div className="flex-1 bg-card dark:bg-card rounded-xl p-4 flex items-center gap-3">
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
        <div className="w-full bg-card dark:bg-card rounded-2xl p-4 lg:p-6 flex flex-col">
          <div className="rounded-r-full w-full max-w-[300px] h-[50px] md:h-[60px] bg-primary dark:bg-primary mb-4 flex items-center justify-center">
            <p className="text-primary-foreground dark:text-primary-foreground font-medium text-center px-4 text-sm md:text-lg lg:text-xl">
              Citas totales del período
            </p>
          </div>
          
          <div className="w-full h-[300px] md:h-[350px] lg:h-[400px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                  data={data}
                  margin={{ top: 20, right: 20, left: 10, bottom: 40 }}
              >
                <XAxis
                    dataKey="name"
                    tickLine={{ stroke: "hsl(var(--primary))" }}
                    axisLine={{ stroke: "hsl(var(--primary))" }}
                    tick={({ x, y, payload }) => (
                        <text
                            x={x}
                            y={y + 15}
                            fill="hsl(var(--primary))"
                            textAnchor="middle"
                            fontSize={10}
                            fontWeight="500"
                        >
                          <tspan x={x} dy="0">
                            feb,
                          </tspan>
                          <tspan x={x} dy="12">
                            {payload.value}
                          </tspan>
                        </text>
                    )}
                />
                <YAxis
                    tickFormatter={(value: number) => `${Math.round(value / 1250)}`}
                    tick={{ fill: "hsl(var(--primary))", fontSize: 10 }}
                    axisLine={{ stroke: "hsl(var(--primary))" }}
                    tickLine={{ stroke: "hsl(var(--primary))" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                    type="monotone"
                    dataKey="pv"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* PieChart - Estado de citas */}
        <div className="w-full bg-card dark:bg-card rounded-2xl p-4 lg:p-6 flex flex-col">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
            {genero.map((entry, index) => (
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