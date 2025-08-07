import React from "react";

interface PsicologoFilterSelectProps {
  filterStatus: 'activos' | 'inactivos';
  onFilterChange: (status: 'activos' | 'inactivos') => void;
}

const PsicologoFilterSelect: React.FC<PsicologoFilterSelectProps> = ({ filterStatus, onFilterChange }) => {
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === '1') {
      onFilterChange('activos');
    } else if (value === '2') {
      onFilterChange('inactivos');
    }
  };

  return (
    <div className="w-full h-16 bg-[#6364F4] dark:bg-primary flex items-center justify-between px-10">
      <div className="flex items-center">
        <h1 className="text-bold text-medium text-white dark:text-primary-foreground">
          Listado de Psicólogos {filterStatus === 'inactivos' ? 'Inactivos' : 'Activos'}
        </h1>
      </div>
      <select
        className="px-4 py-2 rounded-lg border-2 border-white/20 bg-white/10 text-white font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/30 transition-all duration-200 backdrop-blur-sm"
        value={filterStatus === 'activos' ? '1' : '2'}
        onChange={handleFilterChange}
      >
        <option value="1" className="bg-white text-gray-800 font-medium">Activos</option>
        <option value="2" className="bg-white text-gray-800 font-medium">Inactivos</option>
      </select>
    </div>
  );
};

export default PsicologoFilterSelect; 