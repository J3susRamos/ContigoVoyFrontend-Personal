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
import { renderCustomizedLabel, CustomTooltip } from "../custom/CustomTooltipComponent";

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
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      
      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 bg-card dark:bg-card rounded-2xl p-4 lg:p-6 mb-6 lg:mb-8">
        
        {/* Rendimiento del equipo - LineChart */}
        <div className="flex flex-col">
          <div className="rounded-r-full w-full max-w-[350px] h-[50px] md:h-[60px] bg-primary dark:bg-primary mb-4 flex items-center justify-center">
            <p className="text-primary-foreground dark:text-primary-foreground font-medium text-center px-4 text-sm md:text-lg lg:text-xl">
              Rendimiento del equipo
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
                  tick={({ x, y, payload }) => {
                    return (
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
                        </tspan>{" "}
                        <tspan x={x} dy="12">
                          {payload.value}
                        </tspan>
                      </text>
                    );
                  }}
                />
                <YAxis
                  tickFormatter={(value: number) => Math.round(value / 1250).toString()}
                  tick={{ fill: "hsl(var(--primary))", fontSize: 10 }}
                  axisLine={{ stroke: "hsl(var(--primary))" }}
                  tickLine={{ stroke: "hsl(var(--primary))" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="uv"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
                />
                <Line
                  type="monotone"
                  dataKey="pv"
                  stroke="#58A6FF"
                  strokeWidth={2}
                  activeDot={{ r: 6, fill: "#58A6FF" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Citas atendidas - PieChart */}
        <div className="flex flex-col items-center">
          <div className="rounded-full w-full max-w-[300px] h-[50px] md:h-[60px] bg-primary dark:bg-primary mb-4 flex items-center justify-center">
            <p className="text-primary-foreground dark:text-primary-foreground font-medium text-center px-4 text-sm md:text-lg lg:text-xl">
              Citas atendidas por psicólogo
            </p>
          </div>
          
          <div className="w-full h-[250px] md:h-[300px] lg:h-[350px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  dataKey="Total"
                  data={genero}
                  cx="50%"
                  cy="50%"
                  innerRadius="30%"
                  outerRadius="70%"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full mt-4">
            {genero.map((entry, index) => (
              <div key={index} className="flex items-center gap-2 justify-center lg:justify-start">
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

      {/* Tabla de Rendimiento Detallado */}
      <div className="w-full bg-card dark:bg-card rounded-2xl overflow-hidden">
        <div className="w-full bg-primary dark:bg-primary p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="text-primary-foreground dark:text-primary-foreground font-medium text-sm md:text-lg lg:text-xl">
              Profesional
            </div>
            <div className="text-primary-foreground dark:text-primary-foreground font-medium text-sm md:text-lg lg:text-xl">
              Citas Atendidas
            </div>
          </div>
        </div>
        
        <div className="w-full">
          {genero.map((item, index) => (
            <div 
              key={index} 
              className={`grid grid-cols-2 gap-4 items-center p-4 hover:bg-muted/50 transition-colors ${
                index !== genero.length - 1 ? "border-b border-muted" : ""
              }`}
            >
              <div className="text-primary dark:text-primary-foreground font-medium text-center text-sm md:text-base">
                {item.name}
              </div>
              <div className="text-primary dark:text-primary-foreground font-medium text-center text-sm md:text-base">
                {item.Total}
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer con estadísticas adicionales */}
        <div className="bg-muted/30 dark:bg-muted/30 p-4">
          <div className="text-center text-muted-foreground text-xs md:text-sm">
            Total de citas atendidas: {genero.reduce((sum, item) => sum + item.Total, 0)}
          </div>
        </div>
      </div>
    </div>
  );
}