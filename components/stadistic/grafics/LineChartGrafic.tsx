import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CitaMensual } from "@/interface";
import { CustomTooltip } from "../CustomTooltipComponent";

function LineChartGrafic({ datastadistics }: { datastadistics: CitaMensual[] }) {
  const data = datastadistics.map(item => ({
    name: item.fecha.slice(5),
    total: item.total,
  }));

  if (data.length === 0) return null;

  return (
    <div className="flex-1 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="80%">
              <LineChart
                  data={data}
                  margin={{ top: 5, right: 30, left: 20, bottom: 12 }}
              >
                <XAxis
                    dataKey="name"
                    tickLine={{ stroke: "hsl(var(--primary))" }}
                    axisLine={{ stroke: "hsl(var(--primary))" }}
                    tick={({ x, y, payload }) => (
                        <text
                            x={x}
                            y={y + 15}
                            fill="hsl(var(--primary))"
                            textAnchor="middle"
                            fontSize={12}
                            fontWeight="500"
                        >
                          <tspan x={x} dy="15">
                            {payload.value}
                          </tspan>
                        </text>
                    )}
                />
                <YAxis
                    tick={{ fill: "hsl(var(--primary))" }}
                    axisLine={{ stroke: "hsl(var(--primary))" }}
                    tickLine={{ stroke: "hsl(var(--primary))" }}
                />
                <Tooltip content={<CustomTooltip />} />

                <Line
                    type="monotone"
                    dataKey="total"
                    stroke="hsl(var(--primary))"
                    activeDot={{ r: 8, fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
    </div>
  );
}

function areEqual(
  prevProps: { datastadistics: CitaMensual[] },
  nextProps: { datastadistics: CitaMensual[] }
) {
  if (prevProps.datastadistics.length !== nextProps.datastadistics.length) return false;
  for (let i = 0; i < prevProps.datastadistics.length; i++) {
    if (
      prevProps.datastadistics[i].fecha !== nextProps.datastadistics[i].fecha ||
      prevProps.datastadistics[i].total !== nextProps.datastadistics[i].total
    ) {
      return false;
    }
  }
  return true;
}

export default React.memo(LineChartGrafic, areEqual);