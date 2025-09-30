"use client";
import React, { useState, useEffect, useCallback } from "react";
import { GetAllWorkers, GetWorkersStats } from "@/app/apiRoutes";
import { Worker, WorkerStatsResponse, WorkerFilterOptions } from "@/interface";
import TrabajadoresHeader from "./TrabajadoresHeader";
import TrabajadoresFilters from "./TrabajadoresFilters";
import TrabajadoresTable from "./TrabajadoresTable";
import showToast from "@/components/ToastStyle";
import { parseCookies } from "nookies";

export default function TrabajadoresSection() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<WorkerStatsResponse["result"] | null>(null);
  const [filters, setFilters] = useState<WorkerFilterOptions>({
    rol: "ALL",
    estado: "true",
    page: 1,
    perPage: 20,
  });
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchWorkers = useCallback(async () => {
    try {
      setLoading(true);
      const token = parseCookies()["session"];
      console.log("Fetching workers with filters:", filters);
      console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
      console.log("Token:", token ? "Token exists" : "No token found");
      
      const response = await GetAllWorkers({
        perPage: filters.perPage,
        estado: filters.estado === "ALL" ? undefined : filters.estado,
        rol: filters.rol === "ALL" ? undefined : filters.rol,
        page: filters.page,
      });

      console.log("Workers response:", response);

      if (response.result?.data) {
        setWorkers(response.result.data.data);
        setTotalPages(response.result.data.last_page);
        setTotalItems(response.result.data.total);
      }
    } catch (error) {
      console.error("Error fetching workers:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      showToast("Error al cargar trabajadores", "error");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = async () => {
    try {
      const token = parseCookies()["session"];
      console.log("Fetching stats...");
      console.log("Token for stats:", token ? "Token exists" : "No token found");
      
      const response = await GetWorkersStats();
      console.log("Stats response:", response);
      setStats(response.result);
    } catch (error) {
      console.error("Error fetching stats:", error);
      console.error("Stats error details:", JSON.stringify(error, null, 2));
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleFilterChange = (newFilters: Partial<WorkerFilterOptions>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.rol !== prev.rol || newFilters.estado !== prev.estado ? 1 : prev.page,
    }));
  };

  const refreshData = () => {
    fetchWorkers();
    fetchStats();
  };

  return (
    <div className="bg-[#f6f7f7] dark:bg-background min-h-screen flex flex-col">
      <TrabajadoresHeader stats={stats} />
      
      <TrabajadoresFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      
      <TrabajadoresTable
        workers={workers}
        loading={loading}
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={filters.page}
        onPageChange={(page: number) => handleFilterChange({ page })}
        onRefresh={refreshData}
      />
    </div>
  );
}