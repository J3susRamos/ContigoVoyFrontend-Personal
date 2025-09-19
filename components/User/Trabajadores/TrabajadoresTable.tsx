"use client";
import React, { useState } from "react";
import { Worker } from "@/interface";
import { ChangeWorkerRole, ToggleWorkerStatus } from "@/app/apiRoutes";
import showToast from "@/components/ToastStyle";

interface TrabajadoresTableProps {
  workers: Worker[];
  loading: boolean;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
}

export default function TrabajadoresTable({
  workers,
  loading,
  totalItems,
  totalPages,
  currentPage,
  onPageChange,
  onRefresh
}: TrabajadoresTableProps) {
  const [changingRole, setChangingRole] = useState<number | null>(null);
  const [togglingStatus, setTogglingStatus] = useState<number | null>(null);

  const handleRoleChange = async (workerId: number, newRole: string) => {
    try {
      setChangingRole(workerId);
      await ChangeWorkerRole(workerId, newRole);
      showToast("Rol actualizado correctamente", "success");
      onRefresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      showToast("Error al cambiar rol: " + message, "error");
    } finally {
      setChangingRole(null);
    }
  };

  const handleStatusToggle = async (workerId: number, newStatus: boolean) => {
    try {
      setTogglingStatus(workerId);
      await ToggleWorkerStatus(workerId, newStatus);
      const action = newStatus ? "habilitado" : "deshabilitado";
      showToast(`Usuario ${action} correctamente`, "success");
      onRefresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      showToast("Error al cambiar estado: " + message, "error");
    } finally {
      setTogglingStatus(null);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: { [key: string]: string } = {
      ADMIN: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
      PSICOLOGO: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300", 
      MARKETING: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
      COMUNICACION: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300"
    };
    return colors[role] || "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit", 
      year: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6364F4]"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando trabajadores...</span>
        </div>
      </div>
    );
  }

  if (workers.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="text-lg">No se encontraron trabajadores</p>
          <p className="text-sm">Intenta cambiar los filtros para ver más resultados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header con información */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Total: {totalItems} trabajadores
          </h3>
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-[#6364F4] text-white rounded-md hover:bg-[#5654E8] transition-colors duration-200 text-sm"
          >
            Actualizar
          </button>
        </div>
      </div>

      {/* Tabla Desktop */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Trabajador
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Rol Actual
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Fecha Creación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {workers.map((worker) => (
              <tr key={worker.user_id} className="hover:bg-gray-50 dark:hover:bg-gray-900/20">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {worker.name} {worker.apellido}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      ID: {worker.user_id}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    {worker.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(worker.rol)}`}>
                    {worker.rol}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    worker.estado
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                  }`}>
                    {worker.estado ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(worker.fecha_creacion)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-y-2">
                  {/* Verificar si es el super admin */}
                  {worker.email === 'admin@gmail.com' ? (
                    <div className="text-center">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
                        Super Admin
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Protegido
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Cambiar Rol */}
                      <select
                        value={worker.rol}
                        onChange={(e) => handleRoleChange(worker.user_id, e.target.value)}
                        disabled={changingRole === worker.user_id}
                        className="block w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-[#6364F4] disabled:opacity-50"
                      >
                        <option value="ADMIN">Admin</option>
                        <option value="PSICOLOGO">Psicólogo</option>
                        <option value="MARKETING">Marketing</option>
                        <option value="COMUNICACION">Comunicación</option>
                      </select>

                      {/* Toggle Estado */}
                      <button
                        onClick={() => handleStatusToggle(worker.user_id, !worker.estado)}
                        disabled={togglingStatus === worker.user_id}
                        className={`w-full px-2 py-1 text-xs font-medium rounded-md transition-colors duration-200 disabled:opacity-50 ${
                          worker.estado
                            ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-300"
                            : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-300"
                        }`}
                      >
                        {togglingStatus === worker.user_id ? "..." : (worker.estado ? "Deshabilitar" : "Habilitar")}
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards Mobile */}
      <div className="lg:hidden divide-y divide-gray-200 dark:divide-gray-700">
        {workers.map((worker) => (
          <div key={worker.user_id} className="p-6">
            <div className="flex flex-col space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    {worker.name} {worker.apellido}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">ID: {worker.user_id}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{worker.email}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(worker.rol)}`}>
                    {worker.rol}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    worker.estado
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                  }`}>
                    {worker.estado ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                Creado: {formatDate(worker.fecha_creacion)}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                {/* Verificar si es el super admin */}
                {worker.email === 'admin@gmail.com' ? (
                  <div className="text-center p-3 bg-red-50 dark:bg-red-900/10 rounded-md border border-red-200 dark:border-red-800">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
                      Super Administrador
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Este usuario está protegido y no puede ser modificado
                    </p>
                  </div>
                ) : (
                  <>
                    <select
                      value={worker.rol}
                      onChange={(e) => handleRoleChange(worker.user_id, e.target.value)}
                      disabled={changingRole === worker.user_id}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-[#6364F4] disabled:opacity-50"
                    >
                      <option value="ADMIN">Administrador</option>
                      <option value="PSICOLOGO">Psicólogo</option>
                      <option value="MARKETING">Marketing</option>
                      <option value="COMUNICACION">Comunicación</option>
                    </select>

                    <button
                      onClick={() => handleStatusToggle(worker.user_id, !worker.estado)}
                      disabled={togglingStatus === worker.user_id}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 disabled:opacity-50 ${
                        worker.estado
                          ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-300"
                          : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-300"
                      }`}
                    >
                      {togglingStatus === worker.user_id ? "..." : (worker.estado ? "Deshabilitar" : "Habilitar")}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Página {currentPage} de {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Anterior
              </button>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}