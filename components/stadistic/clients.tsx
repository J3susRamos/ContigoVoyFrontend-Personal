import React, { useEffect, useState } from "react";
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
import { renderCustomizedLabel, CustomTooltip } from "./CustomTooltipComponent";
import pacientesValues from "@/utils/pacientesCRUD/pacientesValues";

// Datos para el gráfico de pastel
const genero = [
  { name: "Desconocido", Total: 20 },
  { name: "Masculino", Total: 40 },
  { name: "Femenino", Total: 40 },
];

// Colors for light mode
const COLORS = ["#7777FF", "#66A3FF", "#B3B3FF"];

const edad = [
  { name: "0 - 12", Total: 10 },
  { name: "13 - 17", Total: 5 },
  { name: "18 - 24", Total: 17 },
  { name: "25 - 34", Total: 12 },
  { name: "35 - 44", Total: 6 },
  { name: "45 - 54", Total: 7 },
];

// const lugar = [
//   { name: "Surco", Total: 10 },
//   { name: "Jesús María", Total: 5 },
//   { name: "Surquillo", Total: 17 },
//   { name: "Barranco", Total: 12 },
//   { name: "San Borja", Total: 6 },
// ];

// Reusable BarChart Component
interface BarChartCardProps {
  title: string;
  data: Array<{ name: string; Total: number }>;
  showAgeLabel?: boolean;
}

const BarChartCard: React.FC<BarChartCardProps> = ({ title, data, showAgeLabel = false }) => (
  <div className="w-full h-[300px] bg-card dark:bg-card text-card-foreground dark:text-card-foreground rounded-2xl flex flex-col">
    <div className="rounded-r-full w-[247px] h-[60px] bg-primary dark:bg-primary mt-6 flex items-center justify-center">
      <p className="text-primary-foreground dark:text-primary-foreground font-medium text-center mr-10 text-xl">{title}:</p>
    </div>

    <div className="flex-1 flex items-center justify-center">
      <ResponsiveContainer width="90%" height="80%">
        <BarChart
          data={data}
          margin={{ top: 15, right: 10, left: 5, bottom: 15 }}
        >
          <XAxis
            dataKey="name"
            tickLine={{ stroke: "hsl(var(--primary))" }}
            axisLine={{ stroke: "hsl(var(--primary))" }}
            tick={showAgeLabel ? ({ x, y, payload }) => {
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
                </text>
              );
            } : { fontSize: 12, fill: "hsl(var(--primary))", fontWeight: "500" }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "hsl(var(--primary))" }}
            tickLine={{ stroke: "hsl(var(--primary))" }}
            axisLine={{ stroke: "hsl(var(--primary))" }}
          />
          <Tooltip content={<CustomTooltip />} />
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
);

interface ILugar {
  name: string;
  Total: number;
}

function Lugar(this: ILugar, name: string, Total: number) {
  this.name = name;
  this.Total = Total;
}

export default function Clients() {

  const [lugares,setLugares] = useState<Array<ILugar>>([]);

  useEffect(()=>{
    const lugarWrapperFunction = async () => {
      
      const dataPacients = await pacientesValues("lugar");
      if(dataPacients.state == 2){
        
        const data = dataPacients.result;

        let formattedLugar : Array<ILugar> = [];

        for(let lugar of Object.keys(data)){
          const newLugar = new (Lugar as any)(lugar,data[lugar]);
          formattedLugar.push(newLugar);
        }

        setLugares(formattedLugar);

      }else{
        setLugares([]);
      }

    }
    lugarWrapperFunction();
  },[]);

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

      {/* Segunda columna  */}
      <div className="flex flex-col w-[502px] h-[600px] gap-5">
        <BarChartCard title="Edad" data={edad} showAgeLabel={true} />
        <BarChartCard title="Lugar" data={lugares} showAgeLabel={false} />
      </div>
    </div>
  );
}