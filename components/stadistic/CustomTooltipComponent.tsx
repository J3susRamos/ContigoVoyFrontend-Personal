import { CustomizedLabelProps } from "@/interface";
import React from "react";

export const renderCustomizedLabel = ({
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

// Custom tooltip component for dark mode compatibility
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

export const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
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
