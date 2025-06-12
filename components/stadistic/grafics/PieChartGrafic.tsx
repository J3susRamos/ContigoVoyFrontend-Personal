import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { renderCustomizedLabel, CustomTooltip } from "../CustomTooltipComponent";
import { DashboardResult } from "@/interface";

const COLORS = ["#BABAFF", "#9494F3", "#58A6FF", "#B158FF"];

function PieChartGrafic({ data }: { data: DashboardResult }) {
  const [genero, setGenero] = useState<any[]>([]);

  useEffect(() => {
    if (
      data.citas_completadas > 0 ||
      data.citas_pendientes > 0 ||
      data.citas_canceladas > 0
    ) {
 
      const timer = setTimeout(() => {
        setGenero([
          { name: "Citas completadas", Total: data.citas_completadas },
          { name: "Citas pendientes", Total: data.citas_pendientes },
          { name: "Citas canceladas", Total: data.citas_canceladas },
          { name: "Ausencias", Total: 0 },
        ]);
      }, 380);

      return () => clearTimeout(timer);
    }
  }, [data]);

  if (genero.length === 0) return null;

  return (
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
          isAnimationActive={true}
          animationDuration={1200}
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
  );
}

export default PieChartGrafic;
