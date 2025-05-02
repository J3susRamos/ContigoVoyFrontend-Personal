import { CustomizedLabelProps } from "@/interface";
import React from "react";
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

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: CustomizedLabelProps) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={14}
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function Appointments() {
  const handleAddNewCita = () => {
    console.log("Agregar nueva cita");
    // Aquí puedes abrir un modal, navegar a otra página, etc.
  };

  return (
    <div className="grid xl:grid-cols-2 lg:grid-cols-1 m-5 place-items-center gap-5 max-w-[920px] mx-auto">
      {/* Botón para agregar nueva cita */}
      <div className="col-span-2 flex justify-end w-full">
        <button
          onClick={handleAddNewCita}
          className="bg-[#6364F4] hover:bg-[#4e4ff0] text-white font-semibold py-2 px-4 rounded-xl mb-4"
        >
          + Nueva cita
        </button>
      </div>

      {/* Primer cuadro con LineChart */}
      <div className="w-[547px] h-[459px] bg-white rounded-2xl flex flex-col">
        <div className="rounded-r-full w-[247px] h-[60px] bg-[#6364F4] mt-6 flex items-center justify-center">
          <p className="text-white font-medium text-center mr-10 text-xl">
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
                tickLine={{ stroke: "#634AE2" }}
                axisLine={{ stroke: "#634AE2" }}
                tick={({ x, y, payload }) => {
                  return (
                    <text
                      x={x}
                      y={y + 15}
                      fill="#634AE2"
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
                tick={{ fill: "#634AE2" }}
                axisLine={{ stroke: "#634AE2" }}
                tickLine={{ stroke: "#634AE2" }}
              />
              <Line
                type="monotone"
                dataKey="pv"
                stroke="#634AE2"
                activeDot={{ r: 8, fill: "#634AE2" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Segundo cuadro con PieChart */}
      <div className="h-[459px] w-[353px] bg-white rounded-2xl">
        <div className="rounded-r-full w-[247px] h-[60px] bg-[#6364F4] mt-6 flex items-center justify-center">
          <p className="text-white font-medium text-start mr-10 text-xl">
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
                {genero.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
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
              <span className="text-[#634AE2] font-normal text-base">
                {entry.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
