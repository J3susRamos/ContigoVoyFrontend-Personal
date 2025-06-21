import { CustomizedLabelProps } from "@/interface";
import React, { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

const fetchPorcentajeGenero = async () => {
  const cookies = parseCookies();
  const token = cookies.session;
  if (!token) throw new Error("No autenticated");
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/estadisticas/porcentaje-genero`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
  });
  const data = await response.json();
  return data.result;
};

const fetchEstadisticasEdad = async () => {
  const cookies = parseCookies();
  const token = cookies.session;
  if (!token) throw new Error("No autenticated");
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/pacientes/estadisticas/edad`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  return data.result;
};

// --- NUEVO: función para lugares usando localStorage ---
const fetchEstadisticasLugar = async () => {
  const token = localStorage.getItem('auth_token');
  if (!token) throw new Error("No autenticado");
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/pacientes/estadisticas/lugar`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data.result;
};

export default function Clients() {
  const [genero, setGenero] = useState([
    { name: "Masculino", Total: 0 },
    { name: "Femenino", Total: 0 },
  ]);
  const [edad, setEdad] = useState([
    { name: "0 - 12", Total: 0 },
    { name: "13 - 17", Total: 0 },
    { name: "18 - 24", Total: 0 },
    { name: "25 - 34", Total: 0 },
    { name: "35 - 44", Total: 0 },
    { name: "45 - 54", Total: 0 },
  ]);
  // --- NUEVO: estado para lugares ---
  const [lugar, setLugar] = useState([
    { name: "Surco", Total: 0 },
    { name: "Jesús María", Total: 0 },
    { name: "Surquillo", Total: 0 },
    { name: "Barranco", Total: 0 },
    { name: "San Borja", Total: 0 },
  ]);

  useEffect(() => {
    fetchPorcentajeGenero().then((result) => {
      const data = [
        { name: "Masculino", Total: result?.Masculino?.cantidad ?? 0 },
        { name: "Femenino", Total: result?.Femenino?.cantidad ?? 0},
      ];
      setGenero(data);
    });
  }, []);

  useEffect(() => {
    fetchEstadisticasEdad().then((result) => {
      setEdad([
        { name: "0 - 12", Total: result["0-12"] ?? 0 },
        { name: "13 - 17", Total: result["13-17"] ?? 0 },
        { name: "18 - 24", Total: result["18-24"] ?? 0 },
        { name: "25 - 34", Total: result["25-34"] ?? 0 },
        { name: "35 - 44", Total: result["35-44"] ?? 0 },
        { name: "45 - 54", Total: result["45-54"] ?? 0 },
      ]);
    });
  }, []);

  // --- NUEVO: useEffect para lugares ---
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      // Puedes mostrar un mensaje o redirigir si no hay token
      return;
    }
    fetchEstadisticasLugar().then((result) => {
      setLugar([
        { name: "Surco", Total: result["Surco"] ?? 0 },
        { name: "Jesús María", Total: result["Jesús María"] ?? 0 },
        { name: "Surquillo", Total: result["Surquillo"] ?? 0 },
        { name: "Barranco", Total: result["Barranco"] ?? 0 },
        { name: "San Borja", Total: result["San Borja"] ?? 0 },
      ]);
    });
  }, []);

  const COLORS = ["#7777FF", "#66A3FF", "#B3B3FF"];

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

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) => {
    if (active && payload && payload.length) {
      return (
          <div className="custom-tooltip bg-card dark:bg-card p-2 border border-border rounded shadow">
            <p className="label text-card-foreground dark:text-card-foreground mb-1 font-medium">
              {payload[0].name}
            </p>
            <p className="value text-card-foreground dark:text-card-foreground">
              <span className="font-medium">Total:</span> {payload[0].value}
            </p>
          </div>
      );
    }
    return null;
  };

  return (
      <div className="grid xl:grid-cols-2 lg:grid-cols-1 m-5 place-items-center gap-5 max-w-[920px] mx-auto">
        <div className="w-[401px] h-[600px] bg-card dark:bg-card text-card-foreground dark:text-card-foreground rounded-2xl flex flex-col">
          <div className="rounded-r-full w-[247px] h-[60px] bg-primary dark:bg-primary mt-6 flex items-center justify-center">
            <p className="text-primary-foreground dark:text-primary-foreground font-medium text-center mr-10 text-xl">Género:</p>
          </div>
          <div className="w-full h-[350px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                    dataKey="Total"
                    data={genero}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={140}
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
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid justify-start gap-5 mt-4 ml-14">
            {genero.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                  ></div>
                  <span className="text-primary dark:text-primary-foreground font-normal text-base">{entry.name}</span>
                </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col w-[502px] h-[600px] gap-5">
          <div className="w-full h-[300px] bg-card dark:bg-card text-card-foreground dark:text-card-foreground rounded-2xl flex flex-col">
            <div className="rounded-r-full w-[247px] h-[60px] bg-primary dark:bg-primary mt-6 flex items-center justify-center">
              <p className="text-primary-foreground dark:text-primary-foreground font-medium text-center mr-10 text-xl">Edad:</p>
            </div>
            <div className="flex-1 flex items-center justify-center ">
              <ResponsiveContainer width="90%" height="80%">
                <BarChart
                    data={edad}
                    margin={{ top: 15, right: 10, left: 5, bottom: 15 }}
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
                                {payload.value}
                              </tspan>
                              <tspan x={x} dy="15">
                                años
                              </tspan>
                              {" "}
                            </text>
                        );
                      }}
                  />
                  <YAxis
                      tick={{ fontSize: 12, fill: "hsl(var(--primary))" }}
                      tickLine={{ stroke: "hsl(var(--primary))" }}
                      axisLine={{ stroke: "hsl(var(--primary))" }}
                  />
                  <Tooltip
                      content={<CustomTooltip />}
                  />
                  <Bar
                      dataKey="Total"
                      fill="hsl(var(--primary))"
                      barSize={35}
                      radius={[5, 5, 0, 0]}
                      opacity={0.6}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="w-full h-[300px] bg-card dark:bg-card text-card-foreground dark:text-card-foreground rounded-2xl flex flex-col">
            <div className="rounded-r-full w-[247px] h-[60px] bg-primary dark:bg-primary mt-6 flex items-center justify-center">
              <p className="text-primary-foreground dark:text-primary-foreground font-medium text-center mr-10 text-xl">Lugar:</p>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <ResponsiveContainer width="90%" height="80%">
                <BarChart
                    data={lugar}
                    margin={{ top: 15, right: 10, left: 5, bottom: 15 }}
                >
                  <XAxis
                      dataKey="name"
                      tickLine={{ stroke: "hsl(var(--primary))" }}
                      axisLine={{ stroke: "hsl(var(--primary))" }}
                      tick={{ fontSize: 12, fill: "hsl(var(--primary))", fontWeight: "500" }}
                  />
                  <YAxis
                      tick={{ fontSize: 12, fill: "hsl(var(--primary))" }}
                      tickLine={{ stroke: "hsl(var(--primary))" }}
                      axisLine={{ stroke: "hsl(var(--primary))" }}
                  />
                  <Tooltip
                      content={<CustomTooltip />}
                  />
                  <Bar
                      dataKey="Total"
                      fill="hsl(var(--primary))"
                      barSize={35}
                      radius={[5, 5, 0, 0]}
                      opacity={0.6}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
  );
}