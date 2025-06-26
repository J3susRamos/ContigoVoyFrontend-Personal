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
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    
    <div className="pt-4 grid xl:grid-cols-2 lg:grid-cols-1 m-5 place-items-center gap-5 max-w-[920px] mx-auto">
     {/* citas reservadas y minutos ocupados */}
      <div className="col-span-2 flex items-center justify-between w-full mr-24  mb-4 font-normal">
        <div className="flex items-center text-base gap-6">
          <div className="bg-card dark:bg-card h-fit px-3 py-2 rounded-xl flex gap-6">
            <span
              dangerouslySetInnerHTML={{
                __html: Icons.calendario,
              }}
            />
            <span>{citasPsicologo["citas_confirmadas"]} citas reservadas</span>
          </div>
          <div className="bg-card dark:bg-card h-fit px-3 py-2 rounded-xl flex gap-6">
            <span
              dangerouslySetInnerHTML={{
                __html: Icons.estadisticas,
              }}
            />
            <span>
              {citasPsicologo["total_minutos_reservados"]} min. ocupados
            </span>
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
          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="80%">
              <LineChart
                  data={data}
                  margin={{ top: 5, right: 30, left: 20, bottom: 12 }}
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
                            fontSize={12}
                            fontWeight="500"
                        >
                          <tspan x={x} dy="0">
                            feb,
                          </tspan>
                          <tspan x={x} dy="15">
                            {payload.value}
                          </tspan>
                        </text>
                    )}
                />
                <YAxis
                    tickFormatter={(value: number) => `${value / 1250}`}
                    tick={{ fill: "hsl(var(--primary))" }}
                    axisLine={{ stroke: "hsl(var(--primary))" }}
                    tickLine={{ stroke: "hsl(var(--primary))" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                    type="monotone"
                    dataKey="pv"
                    stroke="hsl(var(--primary))"
                    activeDot={{ r: 8, fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
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
    </div>
  );
}
