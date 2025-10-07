import { useState, useMemo } from "react";
import { ViewKey } from "../types";
import { UsuarioLocalStorage } from "@/interface";

export default function useStadistics() {
  const [view, setView] = useState<ViewKey>("clientes");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [isViewLoading, setIsViewLoading] = useState(false);

  // calcular vistas permitidas - CORREGIDO
  const allowedViews = useMemo(() => {
    try {
      const userJson = localStorage.getItem("user");
      if (!userJson) return [];

      const user: UsuarioLocalStorage = JSON.parse(userJson);

      // Definir allViews dentro del useMemo para evitar dependencia externa
      const allViews: ViewKey[] = ["clientes", "citas", "ventas", "rendimiento"];

      // Si es admin → todas las vistas
      if (user.rol === "ADMIN") {
        return allViews;
      }

      // Si tiene permiso "estadisticas" → todas las vistas
      if (user.permisos?.some((p) => p.name === "Estadisticas")) {
        return allViews;
      }

      // Si no cumple → ninguna
      return [];
    } catch (error) {
      console.error("Error parsing user data:", error);
      return [];
    }
  }, []); // ✅ Dependencias vacías porque solo usa localStorage

  // botones visibles en UI - memoizado para optimización
  const visibleButtons = useMemo(() => {
    return allowedViews.map((key) => ({
      key,
      name:
        key === "clientes"
          ? "Clientes"
          : key === "citas"
          ? "Citas"
          : key === "ventas"
          ? "Ventas"
          : "Rendimiento",
    }));
  }, [allowedViews]);

  const handleViewChange = (newView: ViewKey) => {
    setIsViewLoading(true);
    setTimeout(() => {
      setView(newView);
      setIsViewLoading(false);
    }, 300);
  };

  const getButtonClasses = (isActive: boolean) =>
    `px-4 py-2 rounded-xl font-medium transition-colors ${
      isActive
        ? "bg-white text-primary shadow-md"
        : "bg-primary/20 text-white hover:bg-primary/30"
    }`;

  return {
    view,
    setView,
    dateRange,
    setDateRange,
    isLoading,
    setIsLoading,
    isViewLoading,
    visibleButtons,
    handleViewChange,
    getButtonClasses,
    allowedViews,
  };
}