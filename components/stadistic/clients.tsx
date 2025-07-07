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
import { AgeRangeFilter } from "@/components/ui/Filters/AgeRangeFilter";

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
  const cookies = parseCookies();
  const token = cookies.session;
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
    { name: "Otro", Total: 0 },
  ]);
  const [edad, setEdad] = useState([
    { name: "0 - 12", Total: 0 },
    { name: "13 - 17", Total: 0 },
    { name: "18 - 24", Total: 0 },
    { name: "25 - 34", Total: 0 },
    { name: "35 - 44", Total: 0 },
    { name: "45+", Total: 0 },
  ]);
  // --- NUEVO: estado para lugares ---
  const [lugar, setLugar] = useState<{ name: string; Total: number }[]>([
    { name: "Perú", Total: 0 },
    { name: "Argentina", Total: 0 },
    { name: "Colombia", Total: 0 },
    { name: "Ecuador", Total: 0 },
  ]);

  // Nuevo estado para el filtro de edad
  const [ageRange, setAgeRange] = useState<[number | null, number | null]>([null, null]);
  const [filteredEdad, setFilteredEdad] = useState([
    { name: "0 - 12", Total: 0 },
    { name: "13 - 17", Total: 0 },
    { name: "18 - 24", Total: 0 },
    { name: "25 - 34", Total: 0 },
    { name: "35 - 44", Total: 0 },
    { name: "45+", Total: 0 },
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
        { name: "55 - 64", Total: result["55-64"] ?? 0 },
        { name: "65+", Total: result["65+"] ?? result["65-99"] ?? 0 },
      ]);
    });
  }, []);

  // --- NUEVO: useEffect para lugares ---
  useEffect(() => {
    fetchEstadisticasLugar().then((result) => {
      // Países que siempre deben aparecer
      const paisesEsperados = ["Perú", "Argentina", "Colombia", "Ecuador"];

      // Crear un mapa con los países esperados
      const lugaresMap = new Map(paisesEsperados.map(pais => [pais, 0]));

      // Agregar los datos del resultado
      Object.entries(result).forEach(([key, value]) => {
        const pais = key.trim();
        const cantidad = typeof value === "number" ? value : Number(value) || 0;

        // Normalizar nombres de países
        const paisNormalizado =
          pais.toLowerCase().includes('peru') || pais.toLowerCase().includes('perú') ? 'Perú' :
          pais.toLowerCase().includes('argentina') ? 'Argentina' :
          pais.toLowerCase().includes('colombia') ? 'Colombia' :
          pais.toLowerCase().includes('ecuador') ? 'Ecuador' :
          pais;

        if (lugaresMap.has(paisNormalizado)) {
          lugaresMap.set(paisNormalizado, cantidad);
        } else if (paisesEsperados.includes(paisNormalizado)) {
          lugaresMap.set(paisNormalizado, cantidad);
        }
      });

      // Convertir el mapa a array y ordenar
      const lugares = Array.from(lugaresMap.entries())
        .map(([name, Total]) => ({ name, Total }))
        .sort((a, b) => b.Total - a.Total);

      setLugar(lugares);
    });
  }, []);

  // Nuevo useEffect para filtrar datos por edad
  useEffect(() => {
    if (ageRange[0] === null || ageRange[1] === null) {
      // Si no hay filtro, mostrar todos los datos
      setFilteredEdad(edad);
      return;
    }

    const minAge = ageRange[0];
    const maxAge = ageRange[1];

    // Filtrar los datos según el rango de edad seleccionado
    const filtered = edad.map(item => {
      let rangeMin: number;
      let rangeMax: number;

      if (item.name === "65+") {
        rangeMin = 65;
        rangeMax = 100;
      } else {
        [rangeMin, rangeMax] = item.name.split(' - ').map(num => parseInt(num));
      }

      // Verificar si el rango del grupo se solapa con el filtro seleccionado
      const overlaps = rangeMin <= maxAge && rangeMax >= minAge;

      return {
        ...item,
        Total: overlaps ? item.Total : 0
      };
    });

    setFilteredEdad(filtered);
  }, [edad, ageRange]);

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
      <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Filtros */}
        <div className="flex justify-end mb-4">
          <AgeRangeFilter ageRange={ageRange} setAgeRange={setAgeRange} />
        </div>

        {/* Layout responsivo - Una columna en móvil, dos en desktop */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Gráfico de Género - PieChart */}
          <div className="w-full bg-card dark:bg-card text-card-foreground dark:text-card-foreground rounded-2xl p-4 lg:p-6 flex flex-col">
            <div className="rounded-r-full w-full max-w-[280px] h-[50px] md:h-[60px] bg-primary dark:bg-primary mb-4 flex items-center justify-center">
              <p className="text-primary-foreground dark:text-primary-foreground font-medium text-center px-4 text-lg md:text-xl">Género</p>
            </div>
            
            {/* Container del gráfico */}
            <div className="w-full h-[300px] md:h-[350px] lg:h-[400px] flex items-center justify-center">
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
            
            {/* Leyenda */}
            <div className="flex justify-center gap-6 mt-4">
              {genero.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index] }}
                    ></div>
                    <span className="text-primary dark:text-primary-foreground font-normal text-sm md:text-base">{entry.name}</span>
                  </div>
              ))}
            </div>
          </div>

          {/* Columna derecha - Gráficos de Edad y Lugar */}
          <div className="flex flex-col gap-6">
            
            {/* Gráfico de Edad - BarChart */}
            <div className="w-full bg-card dark:bg-card text-card-foreground dark:text-card-foreground rounded-2xl p-4 lg:p-6 flex flex-col">
              <div className="rounded-r-full w-full max-w-[280px] h-[50px] md:h-[60px] bg-primary dark:bg-primary mb-4 flex items-center justify-center">
                <p className="text-primary-foreground dark:text-primary-foreground font-medium text-center px-4 text-lg md:text-xl">Edad</p>
              </div>
              
              <div className="w-full h-[250px] md:h-[280px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                      data={filteredEdad}
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
                                  {payload.value}
                                </tspan>
                                <tspan x={x} dy="12">
                                  años
                                </tspan>
                              </text>
                          );
                        }}
                    />
                    <YAxis
                        tick={{ fontSize: 10, fill: "hsl(var(--primary))" }}
                        tickLine={{ stroke: "hsl(var(--primary))" }}
                        axisLine={{ stroke: "hsl(var(--primary))" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                        dataKey="Total"
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                        opacity={0.8}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Gráfico de Lugar - BarChart */}
            <div className="w-full bg-card dark:bg-card text-card-foreground dark:text-card-foreground rounded-2xl p-4 lg:p-6 flex flex-col">
              <div className="rounded-r-full w-full max-w-[280px] h-[50px] md:h-[60px] bg-primary dark:bg-primary mb-4 flex items-center justify-center">
                <p className="text-primary-foreground dark:text-primary-foreground font-medium text-center px-4 text-lg md:text-xl">Ubicación</p>
              </div>
              
              <div className="w-full h-[250px] md:h-[280px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                      data={lugar}
                      margin={{ top: 20, right: 20, left: 10, bottom: 60 }}
                  >
                    <XAxis
                        dataKey="name"
                        tickLine={{ stroke: "hsl(var(--primary))" }}
                        axisLine={{ stroke: "hsl(var(--primary))" }}
                        tick={{ fontSize: 9, fill: "hsl(var(--primary))", fontWeight: "500" }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        interval={0}
                    />
                    <YAxis
                        tick={{ fontSize: 10, fill: "hsl(var(--primary))" }}
                        tickLine={{ stroke: "hsl(var(--primary))" }}
                        axisLine={{ stroke: "hsl(var(--primary))" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                        dataKey="Total"
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                        opacity={0.8}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      </div>
  );
}