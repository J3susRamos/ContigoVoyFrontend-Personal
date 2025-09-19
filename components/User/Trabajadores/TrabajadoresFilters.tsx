"use client";
import React from "react";
import { WorkerFilterOptions } from "@/interface";

interface TrabajadoresFiltersProps {
  filters: WorkerFilterOptions;
  onFilterChange: (filters: Partial<WorkerFilterOptions>) => void;
}

export default function TrabajadoresFilters({ filters, onFilterChange }: TrabajadoresFiltersProps) {
  return (
    <div className="w-full h-auto bg-[#6364F4] dark:bg-primary flex flex-col lg:flex-row items-center justify-between px-6 py-4 mb-6 rounded-lg shadow-sm">
      <div className="flex flex-col lg:flex-row items-center gap-4 w-full">
        <h1 className="text-bold text-lg text-white dark:text-primary-foreground whitespace-nowrap">
          Listado de Trabajadores
        </h1>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          {/* Filtro por Rol */}
          <div className="flex flex-col">
            <label className="text-white dark:text-primary-foreground text-sm mb-1">Rol:</label>
            <select
              value={filters.rol}
              onChange={(e) => onFilterChange({ rol: e.target.value })}
              className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm min-w-[140px] focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <option value="ALL">Todos los roles</option>
              <option value="ADMIN">Administradores</option>
              <option value="PSICOLOGO">Psicólogos</option>
              <option value="MARKETING">Marketing</option>
              <option value="COMUNICACION">Comunicación</option>
            </select>
          </div>

          {/* Filtro por Estado */}
          <div className="flex flex-col">
            <label className="text-white dark:text-primary-foreground text-sm mb-1">Estado:</label>
            <select
              value={filters.estado}
              onChange={(e) => onFilterChange({ estado: e.target.value })}
              className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm min-w-[120px] focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <option value="ALL">Todos</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </div>


        </div>
      </div>
    </div>
  );
}