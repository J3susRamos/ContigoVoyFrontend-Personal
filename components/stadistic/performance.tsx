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
import { renderCustomizedLabel, CustomTooltip } from "./CustomTooltipComponent";

// Datos para el LineChart
const data = [
  { name: "01", uv: 4000, pv: 2400 },
  { name: "02", uv: 3000, pv: 1398 },
  { name: "03", uv: 2000, pv: 9800 },
  { name: "04", uv: 2780, pv: 3908 },
  { name: "05", uv: 1890, pv: 4800 },
  { name: "06", uv: 2390, pv: 3800 },
];

const genero = [
  { name: "Psicólogo 1", Total: 30 },
  { name: "Psicólogo 2", Total: 50 },
  { name: "Psicólogo 3", Total: 20 },
];

const COLORS = ["#B158FF", "#7D7DFF", "#58A6FF"];

export default function Performance() {
  return (
    <div className="flex flex-col">
      <div className="grid xl:grid-cols-2 lg:grid-cols-1 m-5 gap-5 xl:w-[950px] w-[350px] mx-auto bg-card dark:bg-card rounded-2xl">
        {/*Rendimiento del equipo PieChart*/}
        <div className="flex flex-col">
          <div className="rounded-r-full w-[301px] h-[60px] bg-primary dark:bg-primary mt-6 flex items-center justify-center">
            <p className="text-primary-foreground dark:text-primary-foreground font-medium text-start mr-10 text-xl">
              Rendimiento del <br /> equipo:
            </p>
          </div>
          <div className="h-full flex items-center justify-center mt-4">
            <div className="w-full h-[350px]">
              <ResponsiveContainer width="100%" height="70%">
                <LineChart
                  data={data}
                  margin={{ top: 30, right: 30, left: 20, bottom: 12 }}
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
                          <tspan x={x} dy="0">
                            feb,
                          </tspan>{" "}
                          <tspan x={x} dy="15">
                            {payload.value}
                          </tspan>
                        </text>
                      );
                    }}
                  />
                  <YAxis
                    tickFormatter={(value: number) => (value / 1250).toString()}
                    tick={{ fill: "hsl(var(--primary))" }}
                    axisLine={{ stroke: "hsl(var(--primary))" }}
                    tickLine={{ stroke: "hsl(var(--primary))" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="uv"
                    stroke="hsl(var(--primary))"
                    activeDot={{ r: 8, fill: "hsl(var(--primary))" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="pv"
                    stroke="#58A6FF"
                    activeDot={{ r: 8, fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Rounded PieChart */}
        <div className="flex flex-col items-center">
          {/* Header for PieChart */}
          <div className="rounded-full w-[247px] h-[60px] bg-primary dark:bg-primary mt-6 flex items-center justify-center">
            <p className="text-primary-foreground dark:text-primary-foreground font-medium text-center text-xl">
              Citas atendidas
            </p>
          </div>
          
          <div className="w-full h-[200px] flex items-center justify-center mt-4">
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
          <div className="grid grid-cols-2 gap-4 w-full max-w-[300px] mx-auto mt-4">
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

      {/* Table for PieChart */}
      <div className="m-5 xl:w-[950px] w-[350px] mx-auto bg-card dark:bg-card rounded-2xl mb-10">
        <div className="w-full bg-primary dark:bg-primary h-[60px] rounded-t-2xl flex items-center">
          <div className="w-1/2 text-primary-foreground dark:text-primary-foreground font-medium text-center text-xl">
            Profesional
          </div>
          <div className="w-1/2 text-primary-foreground dark:text-primary-foreground font-medium text-center text-xl">
            Citas atendidas
          </div>
        </div>
        
        <div className="w-full">
          {genero.map((item, index) => (
            <div 
              key={index} 
              className={`flex items-center h-14 ${
                index !== genero.length - 1 ? "border-b border-muted" : ""
              }`}
            >
              <div className="w-1/2 text-primary dark:text-primary-foreground font-medium text-center">
                {item.name}
              </div>
              <div className="w-1/2 text-primary dark:text-primary-foreground font-medium text-center">
                {item.Total}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}