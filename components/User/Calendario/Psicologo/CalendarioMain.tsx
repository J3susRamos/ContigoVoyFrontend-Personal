"use client";

import { useState, useMemo } from "react";
import CerrarSesion from "@/components/CerrarSesion";
import { View } from "react-big-calendar";
import { Button, useDisclosure } from "@heroui/react";
import Week from "./SelectorDate";
import { Citas } from "@/interface";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ModalCitaExample from "./modal/ModalCitaExample";
import {
  addDays,
  addMonths,
  addWeeks,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import Calendario from "./Calendar";
import { useCitas } from "./hooks/useCitas";

//establecer constantes que van a ir cambiando de acuerdo a estados
export default function CalendarioMain() {
  const { citas } = useCitas();
  const [vistaActual, setVistaActual] = useState("calendario");
  const [view, setView] = useState<View>("week");
  const [currentDate, setCurrentDate] = useState(new Date());

  // Navegación
  const goToToday = () => setCurrentDate(new Date());
  const goToPrev = () => {
    if (view === "month") setCurrentDate(subMonths(currentDate, 1));
    else if (view === "week") setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(subDays(currentDate, 1));
  };
  const goToNext = () => {
    if (view === "month") setCurrentDate(addMonths(currentDate, 1));
    else if (view === "week") setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addDays(currentDate, 1));
  };

  const nombreMes = currentDate.toLocaleString("es-ES", { month: "long" });
  const anio = currentDate.getFullYear();

  const cambiarVista = (vista: string) => setVistaActual(vista);

  const cambiarVistaGlobal = (vistaActual: string, nuevaVista: View) => {
    setVistaActual(vistaActual);
    setView(nuevaVista);
  };

  const { isOpen, onOpenChange } = useDisclosure();

  const citasPorDia = useMemo(() => {
    const agrupadas: Record<string, Citas[]> = {};
    citas.forEach((cita) => {
      const fecha = cita.fecha_inicio.split(" ")[0];
      if (!agrupadas[fecha]) agrupadas[fecha] = [];
      agrupadas[fecha].push(cita);
    });
    return agrupadas;
  }, [citas]);

  return (
    // 🔧 CAMBIO: fondo usa tokens; mejor contraste en dark (no usar #000 directo)
    <div className="bg-background dark:bg-background min-h-screen flex flex-col">
      {/* Header principal */}
      <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center w-full mt-6 md:mt-10 mb-4 md:mb-6 px-4 md:px-8 gap-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <h1
            className="font-bold text-2xl md:text-[32px] leading-7 md:leading-[40px]
                       text-title dark:text-title" // 🔧 CAMBIO: usa --title para mayor consistencia
          >
            Calendario de citas
          </h1>
        </div>
        <div className="flex items-center gap-4 justify-center md:justify-end">
          <CerrarSesion />
        </div>
      </div>

      {/* 🔧 CAMBIO: Barra morada con mejor contraste, sticky ring para accesibilidad */}
      <div
        className="w-full h-auto md:h-16 bg-primary dark:bg-primary
                   items-center justify-start flex flex-col md:flex-row px-2 md:px-8 py-4 md:py-0 gap-2 md:gap-0"
      >
        {/* Mobile: flechas + mes */}
        <div className="flex w-full items-center justify-center md:hidden mb-2">
          {/* 🔧 CAMBIO: botones icon-only con feedback hover/active/focus y etiqueta accesible */}
          <Button
            isIconOnly
            size="sm"
            aria-label="Anterior"
            title="Anterior"
            className="
              bg-transparent text-primary-foreground
              hover:bg-primary/80
              active:scale-95
              transition-transform duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary
            "
            onPress={goToPrev}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <span className="flex-1 text-center text-primary-foreground font-semibold text-lg select-none">
            {nombreMes[0].toUpperCase() + nombreMes.slice(1)} de {anio}
          </span>

          <Button
            isIconOnly
            size="sm"
            aria-label="Siguiente"
            title="Siguiente"
            className="
              bg-transparent text-primary-foreground
              hover:bg-primary/80
              active:scale-95
              transition-transform duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary
            "
            onPress={goToNext}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        {/* Desktop: flechas a la izquierda */}
        <div className="hidden md:flex gap-2 items-center w-full max-w-full md:max-w-[230px] justify-center md:justify-start">
          {/* 🔧 CAMBIO: reemplazo <span> por Button para estados activos/hover accesibles */}
          <Button
            isIconOnly
            radius="full"
            aria-label="Anterior"
            title="Anterior"
            className="
              bg-transparent text-primary-foreground
              hover:bg-primary/80
              active:scale-95
              transition-transform duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary
              w-10 h-10
            "
            onPress={goToPrev}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <Button
            isIconOnly
            radius="full"
            aria-label="Siguiente"
            title="Siguiente"
            className="
              bg-transparent text-primary-foreground
              hover:bg-primary/80
              active:scale-95
              transition-transform duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary
              w-10 h-10
            "
            onPress={goToNext}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Botones de navegación de vista izquierda */}
        <div className="flex gap-2 items-center w-full max-w-full md:max-w-[730px] justify-center md:justify-start mt-2 md:mt-0">
          {/* 🔧 CAMBIO: botón “Hoy” con pastilla clara (alto contraste sobre bg morado) */}
          <Button
            radius="full"
            aria-label="Ir a hoy"
            className="
              text-[15px] md:text-[16px] leading-[20px] font-semibold
              bg-background text-primary
              hover:brightness-105
              active:scale-95 transition duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary
            "
            onPress={goToToday}
          >
            Hoy
          </Button>

          {/* 🔧 CAMBIO: los tabs usan estado seleccionado con pill clara y no-seleccionado transparente con borde legible */}
          <Button
            radius="full"
            className={`hidden text-[15px] md:text-[16px] leading-[20px] font-medium
              ${
                vistaActual === "calendario"
                  ? "bg-background text-primary"
                  : "bg-transparent border border-primary-foreground/60 text-primary-foreground"
              }
              hover:brightness-105 active:scale-95 transition duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary
            `}
            onPress={() => cambiarVista("calendario")}
          >
            Calendario
          </Button>

          <Button
            radius="full"
            className={`text-[15px] md:text-[16px] leading-[20px] font-medium
              ${
                vistaActual === "horarios"
                  ? "bg-background text-primary"
                  : "bg-transparent border border-primary-foreground/60 text-primary-foreground"
              }
              hover:brightness-105 active:scale-95 transition duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary
            `}
            onPress={() => cambiarVista("horarios")}
          >
            Mis Horarios
          </Button>
        </div>

        {/* Título de mes en desktop */}
        <div className="text-primary-foreground font-semibold text-[clamp(12px,2.5vw,18px)] text-left whitespace-nowrap md:ml-4 hidden md:block select-none">
          {nombreMes[0].toUpperCase() + nombreMes.slice(1)} de {anio}
        </div>

        {/* Botones de cambio de vista (Mes/Semana/Día) a la derecha */}
        <div className="flex gap-2 items-center w-full max-w-full md:max-w-[530px] justify-center md:justify-end mt-2 md:mt-0">
          <Button
            radius="full"
            aria-label="Vista mes"
            className={`
              text-[15px] md:text-[16px] leading-[20px] font-medium
              ${
                vistaActual === "calendario" && view === "month"
                  ? "bg-background text-primary"
                  : "bg-transparent border border-primary-foreground/60 text-primary-foreground"
              }
              hover:brightness-105 active:scale-95 transition duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary
            `}
            onPress={() => cambiarVistaGlobal("calendario", "month")}
          >
            Mes
          </Button>

          <Button
            radius="full"
            aria-label="Vista semana"
            className={`
              text-[15px] md:text-[16px] leading-[20px] font-medium
              ${
                vistaActual === "calendario" && view === "week"
                  ? "bg-background text-primary"
                  : "bg-transparent border border-primary-foreground/60 text-primary-foreground"
              }
              hover:brightness-105 active:scale-95 transition duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary
            `}
            onPress={() => cambiarVistaGlobal("calendario", "week")}
          >
            Semana
          </Button>

          <Button
            radius="full"
            aria-label="Vista día"
            className={`
              text-[15px] md:text-[16px] leading-[20px] font-medium
              ${
                vistaActual === "calendario" && view === "day"
                  ? "bg-background text-primary"
                  : "bg-transparent border border-primary-foreground/60 text-primary-foreground"
              }
              hover:brightness-105 active:scale-95 transition duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary
            `}
            onPress={() => cambiarVistaGlobal("calendario", "day")}
          >
            Día
          </Button>
        </div>
      </div>

      {/* Contenido */}
      <div className="bg-background dark:bg-background">
        {vistaActual === "horarios" ? (
          <Week />
        ) : (
          <Calendario
            vista={view}
            citasPorDia={citasPorDia}
            date={currentDate}
          />
        )}
      </div>

      <ModalCitaExample isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
}
