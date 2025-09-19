"use client";
import React from "react";
import { WorkerStatsResponse } from "@/interface";

interface TrabajadoresHeaderProps {
  stats: WorkerStatsResponse["result"] | null;
}

export default function TrabajadoresHeader({ stats }: TrabajadoresHeaderProps) {
  const roles = ["ADMIN", "PSICOLOGO", "MARKETING", "COMUNICACION"];

  const getRoleDisplayName = (role: string) => {
    const displayNames: { [key: string]: string } = {
      ADMIN: "Administradores",
      PSICOLOGO: "Psicólogos", 
      MARKETING: "Marketing",
      COMUNICACION: "Comunicación"
    };
    return displayNames[role] || role;
  };

  const getRoleColor = (role: string) => {
    const colors: { [key: string]: string } = {
      ADMIN: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
      PSICOLOGO: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
      MARKETING: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
      COMUNICACION: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300"
    };
    return colors[role] || "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Resumen de Trabajadores por Rol
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {roles.map((role) => {
          const roleStats = stats?.[role];
          const total = roleStats?.total || 0;
          const activos = roleStats?.activos || 0;
          const inactivos = roleStats?.inactivos || 0;
          
          return (
            <div key={role} className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  {getRoleDisplayName(role)}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(role)}`}>
                  {role}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total:</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{total}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-600 dark:text-green-400">Activos:</span>
                  <span className="font-semibold text-green-700 dark:text-green-400">{activos}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-red-600 dark:text-red-400">Inactivos:</span>
                  <span className="font-semibold text-red-700 dark:text-red-400">{inactivos}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}