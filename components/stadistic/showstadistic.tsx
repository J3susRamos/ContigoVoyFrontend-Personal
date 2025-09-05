"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DateRangeFilter } from "../ui/Filters/DateRangeFilter";
import LoadingSkeleton from "./skeletons/LoadingSkeleton";
import ViewLoadingSkeleton from "./skeletons/ViewLoadingSkeleton";
import ClientesSection from "./sections/ClientesSection";
import CitasSection from "./sections/CitasSection";
import VentasSection from "./sections/VentasSection";
import RendimientoSection from "./sections/RendimientoSection";
import useStadistics from "./hooks/useStadistics";
import { ViewKey } from "./types";

export default function ShowStadistic() {
  const {
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
  } = useStadistics();

  useEffect(() => {
    try {
      const userJson = localStorage.getItem("user");
      if (userJson) {
        // ✅ Solo verificamos que exista el usuario, no necesitamos parsearlo
        // ya que la lógica de permisos está en el hook useStadistics
        
        // ✅ Vista inicial → la primera permitida
        if (allowedViews.length > 0) {
          setView(allowedViews[0] as ViewKey);
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error parsing user data:", error);
      setIsLoading(false);
    }
  }, [setIsLoading, allowedViews, setView]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // ✅ si no tiene vistas permitidas → sin permisos
  if (allowedViews.length === 0) {
    return <div>No tienes permisos para ver estadísticas 🚫</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:bg-none dark:bg-[#020202]">

      {/* Header con botones de navegación */}
      <header className="w-full bg-gradient-to-r from-primary to-primary/90 dark:from-primary dark:to-primary/80 shadow-lg">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Botones de navegación */}
            <nav className="flex flex-wrap justify-center md:justify-start items-center gap-2 md:gap-3">
              {visibleButtons.map((btn) => (
                <Button
                  key={btn.key}
                  className={getButtonClasses(view === btn.key)}
                  onClick={() => handleViewChange(btn.key)}
                  aria-pressed={view === btn.key}
                  role="button"
                >
                  {btn.name}
                </Button>
              ))}
            </nav>

            {/* Filtro de fechas */}
            <div className="flex justify-center md:justify-end">
              <DateRangeFilter
                dateRange={dateRange}
                setDateRange={setDateRange}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="px-4 md:px-6 py-6 md:py-8 max-w-7xl mx-auto">
        <div className="bg-white dark:bg-[#020202] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 min-h-[600px] overflow-hidden">
          <div role="tabpanel" className="p-6 md:p-8">
            <div className="relative min-h-[500px]">
              {/* Skeleton */}
              <div
                className={`absolute inset-0 transition-opacity duration-300 ${
                  isViewLoading
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <ViewLoadingSkeleton viewKey={view} />
              </div>

              {/* Contenido real */}
              <div
                className={`transition-opacity duration-300 ${
                  isViewLoading ? "opacity-0" : "opacity-100 delay-100"
                }`}
              >
                {view === "clientes" && <ClientesSection />}
                {view === "citas" && <CitasSection />}
                {view === "ventas" && <VentasSection />}
                {view === "rendimiento" && <RendimientoSection />}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}