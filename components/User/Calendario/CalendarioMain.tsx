"use client";
import { useState } from "react";
import CerrarSesion from "@/components/CerrarSesion";
import { View } from "react-big-calendar";
import {
  Button,
  useDisclosure,
} from "@heroui/react";
import { getLocalTimeZone, today } from "@internationalized/date";
import Week from "./SelectorDate";
import Calendario from "./Calendar";
import { Citas } from "@/interface";
import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ModalCitaExample from "./modal/ModalCitaExample";
import { addDays, addMonths, addWeeks, subDays, subMonths, subWeeks } from "date-fns";

interface CalProps {
  citas: Citas[];
}

export default function CalendarioMain({ citas }: CalProps) {
  const [vistaActual, setVistaActual] = useState("calendario");
  const [view, setView] = useState<View>("week");
  const [currentDate, setCurrentDate] = useState(new Date());

  // Funciones para navegación
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

  const Fecha = today(getLocalTimeZone());

  const nombreMes = new Date(Fecha.year, Fecha.month - 1).toLocaleString(
    "es-ES",
    {
      month: "long",
    }
  );

  const cambiarVista = (vista: string) => {
    setVistaActual(vista);
  };

  const cambiarVistaGlobal =(vistaActual: string, nuevaVista: View) => {
    setVistaActual(vistaActual);
    setView(nuevaVista);
  }

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const citasPorDia = useMemo(() => {
    const agrupadas: Record<string, Citas[]> = {};
    citas.forEach((cita) => {
      const fecha = cita.fecha_inicio.split(" ")[0]; // "2025-04-01"
      if (!agrupadas[fecha]) agrupadas[fecha] = [];
      agrupadas[fecha].push(cita);
    });
    return agrupadas;
  }, [citas]);

  return (
    <div className="bg-[#f8f8ff] dark:bg-background min-h-screen flex flex-col">
      <div className="flex justify-between w-full mt-10 mb-6">
        <div className="flex flex-col md:flex-row justify-evenly space-x-5">
          <h1 className="flex items-center font-bold text-[32px] leading-[40px] ml-11 text-primary dark:text-primary-foreground">
            Calendario de citas
          </h1>
          <Button
            onPress={onOpen}
            className="bg-primary dark:bg-primary text-primary-foreground rounded-full px-4 font-light"
          >
            Nueva cita
          </Button>
        </div>
        <CerrarSesion />
      </div>
      <div className="w-full h-16 bg-primary dark:bg-primary items-center justify-start flex px-8">
        <div className="flex gap-2 items-center w-full max-w-[530px]">
          <span
            className="w-10 h-10 p-0 shadow-lg border-0 flex items-center justify-center"
            onClick={goToPrev}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </span>

          <span
            className="w-10 h-10 p-0 shadow-lg border-0 flex items-center justify-center"
            onClick={goToNext}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </span>
          <Button
            radius="full"
            className={`text-[16px] leading-[20px] border-4 font-bold bg-transparent border border-background text-background dark:text-primary-foreground font-light`}
            onPress={goToToday}
          >
            Hoy
          </Button>
          <Button
            radius="full"
            className={`text-[16px] leading-[20px] border-4 font-bold ${vistaActual === "calendario"
              ? "text-primary dark:text-primary bg-background dark:bg-background"
              : "bg-transparent border border-background text-background dark:text-primary-foreground font-light"
              }`}
            onPress={() => cambiarVista("calendario")}
          >
            Calendario
          </Button>
          <Button
            radius="full"
            className={`text-[16px] leading-[20px] border-4 font-bold ${vistaActual === "horarios"
              ? "text-primary dark:text-primary bg-background dark:bg-background"
              : "bg-transparent border border-background text-background dark:text-primary-foreground font-light"
              }`}
            onPress={() => cambiarVista("horarios")}
          >
            Mis Horarios
          </Button>
        </div>
        <div className="text-primary-foreground font-semibold text-2xl hidden md:block mx-auto">
          {nombreMes[0].toUpperCase() + nombreMes.slice(1)} de {Fecha.year}
        </div>
        <div className="flex gap-2 items-center w-full max-w-[530px] justify-end">
          <Button
            radius="full"
            className={`text-[16px] leading-[20px] border-4 font-bold ${ vistaActual === "calendario" && view === "month"
              ? "text-primary dark:text-primary bg-background dark:bg-background"
              : "bg-transparent border border-background text-background dark:text-primary-foreground font-light"
              }`}
            onPress={() => cambiarVistaGlobal("calendario","month")}
          >
            Mes
          </Button>
          <Button
            radius="full"
            className={`text-[16px] leading-[20px] border-4 font-bold ${vistaActual === "calendario" && view === "week"
              ? "text-primary dark:text-primary bg-background dark:bg-background"
              : "bg-transparent border border-background text-background dark:text-primary-foreground font-light"
              }`}
            onPress={() => cambiarVistaGlobal("calendario","week")}
          >
            Semana
          </Button>
          <Button
            radius="full"
            className={`text-[16px] leading-[20px] border-4 font-bold ${vistaActual === "calendario" && view === "day"
              ? "text-primary dark:text-primary bg-background dark:bg-background"
              : "bg-transparent border border-background text-background dark:text-primary-foreground font-light"
              }`}
            onPress={() => cambiarVistaGlobal("calendario","day")}
          >
            Dia
          </Button>
        </div>
      </div>

      <div className="bg-[#f8f8ff] dark:bg-background">
        {vistaActual === "horarios" ?<Week /> : <Calendario vista={view} citasPorDia={citasPorDia} date={currentDate} />}
      </div>

      <ModalCitaExample isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
}