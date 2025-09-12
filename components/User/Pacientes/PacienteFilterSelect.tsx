// components/User/Pacientes/Admin/PacienteFilterSelect.tsx
"use client";

interface PacienteFilterSelectProps {
  filterStatus: string;
  onFilterChange: (status: string) => void;
}

export default function PacienteFilterSelect({ filterStatus, onFilterChange }: PacienteFilterSelectProps) {
  return (
    <select
      value={filterStatus}
      onChange={(e) => onFilterChange(e.target.value)}
      className="px-4 py-2 border border-r-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600"
    >
      <option value="habilitados">Pacientes Habilitados</option>
      <option value="deshabilitados">Pacientes Deshabilitados</option>
    </select>
  );
}