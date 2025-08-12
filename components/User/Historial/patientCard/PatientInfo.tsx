import React from "react";
import { InfoItem } from "../types/types";

interface PatientInfoProps {
  info: InfoItem[];
}

export const PatientInfo: React.FC<PatientInfoProps> = ({ info }) => (
  <div className="space-y-3 sm:space-y-4 px-4 sm:px-6 pb-4">
    {info.map((item, index) => (
      <InfoRow key={`${item.label}-${index}`} label={item.label} value={item.value} />
    ))}
  </div>
);

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4">
    <span className="text-sm sm:text-base font-medium text-gray-600 dark:text-muted-foreground flex-shrink-0">
      {label}:
    </span>
    <span className="text-sm sm:text-base text-gray-900 dark:text-foreground sm:text-right break-words">
      {value}
    </span>
  </div>
);
