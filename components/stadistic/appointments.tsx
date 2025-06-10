import React, {useState, useEffect} from "react";
import { parseCookies } from "nookies";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";
import { renderCustomizedLabel, CustomTooltip } from "./CustomTooltipComponent";

// Datos para el gráfico de pastel
const genero = [
  { name: "Citas completadas", Total: 40 },
  { name: "Citas pendientes", Total: 30 },
  { name: "Citas canceladas", Total: 20 },
  { name: "Ausencias", Total: 10 },
];

const COLORS = ["#BABAFF", "#9494F3", "#58A6FF", "#B158FF"];

// Datos para el LineChart
const data = [
  { name: "01", uv: 4000, pv: 2400 },
  { name: "02", uv: 3000, pv: 1398 },
  { name: "03", uv: 2000, pv: 9800 },
  { name: "04", uv: 2780, pv: 3908 },
  { name: "05", uv: 1890, pv: 4800 },
  { name: "06", uv: 2390, pv: 3800 },
];


const fetchCitas = async () => {
  const cookies = parseCookies();
  const token = cookies.session;
  if (!token) throw new Error("No autenticated");
  const response = await fetch("http://127.0.0.1:8000/api/citas/dashboard/psicologo", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  return data.result;
};

let horas

function StatisticCard(props : any){
  return (
    <div className="bg-card dark:bg-card  text-primary-foreground dark:text-primary-foreground font-semibold py-2 px-4 rounded-xl">
      <p>{props.value} {props.msg}</p>
    </div>
  )
}

export default function Appointments() {
  const handleAddNewCita = () => {
    console.log("Agregar nueva cita");
  };

  const [tiempoTotalCitas,setTiempoTotalCitas] = useState(0);
  const [citasReservadas,setCitasReservadas] = useState(0);

  useEffect(() => {
      const cookies = parseCookies();
      const token = cookies.session;
      console.log("wa")
      if (!token) throw new Error("No autenticated");
      fetchCitas().then((result) => {
        setTiempoTotalCitas(result.total_minutos_reservados);
        setCitasReservadas(result.total_citas)
      });
  }, []);


  return (
    <div className="grid xl:grid-cols-2 lg:grid-cols-1 m-5 place-items-center gap-5 max-w-[920px] mx-auto">
      
      <div className="col-span-2 flex justify-between w-full">
        {/* Conjunto de cuadros de estadisticas */}
        <div className="flex gap-[46px]">
          <StatisticCard value = {citasReservadas} msg = {"citas reservadas"}/>
          <StatisticCard value = {tiempoTotalCitas} msg = {"min. ocupados"}/>
        </div>
        {/* Botón para agregar nueva cita */}
        <button
          onClick={handleAddNewCita}
          className="bg-primary dark:bg-primary hover:bg-primary/90 dark:hover:bg-primary/90 text-primary-foreground dark:text-primary-foreground font-semibold py-2 px-4 rounded-xl"
        >
          + Nueva cita
        </button>
      </div>
      <div className="flex">
        {/* Primer cuadro con LineChart */}
        <div className="w-[547px] h-[459px] bg-card dark:bg-card rounded-2xl flex flex-col">
          <div className="rounded-r-full w-[247px] h-[60px] bg-primary dark:bg-primary mt-6 flex items-center justify-center">
            <p className="text-primary-foreground dark:text-primary-foreground font-medium text-center mr-10 text-xl">
              Citas totales <br /> del período:
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="90%" height="80%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 12 }}
              >
                <XAxis
                  dataKey="name"
                  tickLine={{ stroke: "hsl(var(--primary))" }}
                  axisLine={{ stroke: "hsl(var(--primary))" }}
                  tick={({ x, y, payload }) => {
                    return (
                      <text
                        x={x}
                        y={y + 15}
                        fill="hsl(var(--primary))"
                        textAnchor="middle"
                        fontSize={12}
                        fontWeight="500"
                      >
                        <tspan x={x} dy="0">feb,</tspan>
                        <tspan x={x} dy="15">{payload.value}</tspan>
                      </text>
                    );
                  }}
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

        {/* Segundo cuadro con PieChart */}
        <div className="h-[459px] w-[353px] bg-card dark:bg-card rounded-2xl">
          <div className="rounded-r-full w-[247px] h-[60px] bg-primary dark:bg-primary mt-6 flex items-center justify-center">
            <p className="text-primary-foreground dark:text-primary-foreground font-medium text-start mr-10 text-xl">
              Estado de <br /> cita:
            </p>
          </div>

          <div className="w-full h-[240px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  dataKey="Total"
                  data={genero}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={100}
                  fill="#8884d8"
                  label={renderCustomizedLabel}
                  labelLine={false}
                >
                  {genero.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Leyenda del PieChart */}
          <div className="grid justify-start gap-5 grid-cols-2 w-[300px] ml-10">
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
