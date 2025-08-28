import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { renderCustomizedLabel, CustomTooltip } from "../custom/CustomTooltipComponent";
import { DashboardResult } from "@/interface";

const COLORS = ["#BABAFF", "#58A6FF", "#9494F3", "#B158FF", "#b9cd38"];

type citasData = {
  name: string;
  Total: number;
};

function PieChartGrafic({ data }: { data: DashboardResult }) {
  const [citas, setCitas] = useState<citasData[]>([]);

  useEffect(() => {
    if (
      data.citas_realizadas > 0 ||
      data.citas_pendientes > 0 ||
      data.citas_canceladas > 0
    ) {
        setCitas([
          { name: "Citas realizadas", Total: data.citas_realizadas },
          { name: "Citas canceladas", Total: data.citas_canceladas },
          { name: "Citas pendientes", Total: data.citas_pendientes },
          { name: "Citas Sin Pagar", Total: data.citas_sin_pagar },
          { name: "Ausencias", Total: data.citas_ausentes },
        ]);
    }
  }, [data]);

  if (citas.length === 0) return null;

  return (
    <div className="w-full h-[200px] sm:h-[300px] md:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            dataKey="Total"
            data={citas}
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
            {citas.map((_, index) => (
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
  );
}

// Solo renderiza si los valores realmente cambian
function areEqual(
  prevProps: { data: DashboardResult },
  nextProps: { data: DashboardResult }
) {
  return (
    prevProps.data.citas_realizadas === nextProps.data.citas_realizadas &&
    prevProps.data.citas_pendientes === nextProps.data.citas_pendientes &&
    prevProps.data.citas_canceladas === nextProps.data.citas_canceladas
  );
}

export default React.memo(PieChartGrafic, areEqual);
