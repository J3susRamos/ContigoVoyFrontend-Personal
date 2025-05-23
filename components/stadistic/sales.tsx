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

const genero = [
  { name: "Citas completadas", Total: 40 },
  { name: "Citas pendientes", Total: 30 },
  { name: "Citas canceladas", Total: 20 },
  { name: "Ausencias", Total: 10 },
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

// Define a proper type for the tooltip props
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number;
    dataKey?: string;
    payload?: {
      name?: string;
      [key: string]: unknown;
    };
  }>;
  label?: string;
}

// Custom tooltip component for dark mode compatibility
const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-card dark:bg-card p-2 border border-border rounded shadow">
        <p className="label text-card-foreground dark:text-card-foreground mb-1 font-medium">
          {payload[0].name || label}
        </p>
        <p className="value text-card-foreground dark:text-card-foreground">
          <span className="font-medium">Total:</span> {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function Sales() {
  return (
    <div className="grid xl:grid-cols-2 lg:grid-cols-1 m-5 place-items-center gap-5 max-w-[950px] mx-auto">
      <div className="flex flex-col w-[547px] h-[660px] gap-5">

        {/* Primer cuadro con LineChart */}
        <div className="w-[547px] h-[459px] bg-card dark:bg-card rounded-2xl flex flex-col">
          <div className="rounded-r-full w-[247px] h-[60px] bg-primary dark:bg-primary mt-6 flex items-center justify-center">
            <p className="text-primary-foreground dark:text-primary-foreground font-medium text-center mr-10 text-xl">
              Ingresos del período <br /> seleccionado:
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
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Segundo cuadro con encabezados */}
        <div className="w-full h-[234px] bg-card dark:bg-card rounded-2xl flex flex-col">
          <div className="w-full h-[60px] bg-primary dark:bg-primary mt-6 flex items-center justify-between px-6">
            <div className="text-primary-foreground dark:text-primary-foreground font-medium text-center">
              Cliente
            </div>
            <div className="text-primary-foreground dark:text-primary-foreground font-medium text-center">
              Ingresos
            </div>
            <div className="text-primary-foreground dark:text-primary-foreground font-medium text-center">
              Pagos Pendientes
            </div>
            <div className="text-primary-foreground dark:text-primary-foreground font-medium text-center">
              Cancelaciones
            </div>
            <div className="text-primary-foreground dark:text-primary-foreground font-medium text-center">
              Ausencias
            </div>
          </div>
          <div className="flex-1 p-4">
            {/* Contenido de la tabla */}
          </div>
        </div>
      </div>

      {/* Tercer cuadro con PieChart */}
      <div className="w-[353px] h-[660px] bg-card dark:bg-card rounded-2xl">
        <div className="rounded-r-full w-[247px] h-[60px] bg-primary dark:bg-primary mt-6 flex items-center justify-center">
          <p className="text-primary-foreground dark:text-primary-foreground font-medium text-start mr-10 text-xl">
            Estado de <br />
            cita:
          </p>
        </div>

        <div className="w-full h-[380px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                dataKey="Total"
                data={genero}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={130}
                fill="#8884d8"
                label={renderCustomizedLabel}
                labelLine={false}
              >
                {genero.map((_entry, index) => (
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
        <div className="grid justify-start gap-5 grid-cols-2 w-[300px] ml-10 mt-6">
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
  );
}