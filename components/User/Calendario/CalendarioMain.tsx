"use client";

import {useState} from "react";
import CerrarSesion from "@/components/CerrarSesion";
import {View} from "react-big-calendar";
import {Button, useDisclosure} from "@heroui/react";
import Week from "./SelectorDate";
import Calendario from "./Calendar";
import {Citas} from "@/interface";
import {useMemo} from "react";
import {ChevronLeft, ChevronRight} from "lucide-react";
import ModalCitaExample from "./modal/ModalCitaExample";
import {addDays, addMonths, addWeeks, subDays, subMonths, subWeeks} from "date-fns";

interface CalProps {
    citas: Citas[];
}

export default function CalendarioMain({citas}: CalProps) {
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



    const nombreMes = currentDate.toLocaleString(
        "es-ES",
        {
            month: "long"});
        const anio = currentDate.getFullYear(
    );

    const cambiarVista = (vista: string) => {
        setVistaActual(vista);
    };

    const cambiarVistaGlobal = (vistaActual: string, nuevaVista: View) => {
        setVistaActual(vistaActual);
        setView(nuevaVista);
    }

    const {isOpen, onOpen, onOpenChange} = useDisclosure();

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
            {/* Header principal */}
      <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center w-full mt-6 md:mt-10 mb-4 md:mb-6 px-4 md:px-8 gap-4">
        {/* Título y botón juntos */}
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <h1 className="font-bold text-2xl md:text-[32px] leading-7 md:leading-[40px] text-primary dark:text-primary-foreground text-center md:text-left">
                        Calendario de citas
                    </h1><div className="">
                    <Button
                        onPress={onOpen}
                        className="bg-primary dark:bg-primary text-primary-foreground rounded-full px-6 font-light mt-2 md:mt-0"
                    >
                        Nueva cita
                    </Button>
                </div></div>
        {/* Otros controles a la derecha */}
        <div className="flex items-center gap-4 justify-center md:justify-end">
          {/* Aquí puedes poner el switch de tema, avatar, etc */}
                <CerrarSesion/>
            </div>
            </div>
      {/* Barra de navegación */}
      <div className="w-full h-auto md:h-16 bg-primary dark:bg-primary items-center justify-start flex flex-col md:flex-row px-2 md:px-8 py-4 md:py-0 gap-2 md:gap-0">
        {/* Título y navegación en mobile */}
                <div className="flex w-full items-center justify-center md:hidden mb-2">
          <Button
            isIconOnly
            size="sm"
            className="bg-transparent hover:bg-primary-foreground"
            onPress={goToPrev}
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </Button>
          <span className="flex-1 text-center text-primary-foreground font-semibold text-lg">
            {nombreMes[0].toUpperCase() + nombreMes.slice(1)} de {anio}
          </span>
          <Button
            isIconOnly
            size="sm"
            className="bg-transparent hover:bg-primary-foreground"
            onPress={goToNext}
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </Button>
        </div>
        <div className="flex ">
          {/* Navegación en desktop */}
          <div className="hidden md:flex gap-2 items-center w-full max-w-full md:max-w-[230px] justify-center md:justify-start">
          <span
              className="w-10 h-10 p-0 shadow-lg border-0 flex items-center justify-center"
              onClick={goToPrev}
          >
            <ChevronLeft className="w-5 h-5 text-white"/>
          </span>

                    <span
                        className="w-10 h-10 p-0 shadow-lg border-0 flex items-center justify-center"
                        onClick={goToNext}
                    >
            <ChevronRight className="w-5 h-5 text-white"/>
          </span>
                    </div>
          {/* Botones de navegación de vista */}
          <div className="flex gap-2 items-center w-full max-w-full md:max-w-[730px] justify-center md:justify-start mt-2 md:mt-0">
            <Button
                        radius="full"
                        className="text-[15px] md:text-[16px] leading-[20px] border-4 font-bold bg-transparent border border-background text-background dark:text-primary-foreground font-light"
                        onPress={goToToday}
                    >
                        Hoy
                    </Button>
                    <Button
                        radius="full"
                        className={`hidden text-[15px] md:text-[16px] leading-[20px] border-4 font-bold ${vistaActual === "calendario"
                            ? "text-primary dark:text-primary bg-background dark:bg-background"
                            : "bg-transparent border border-background text-background dark:text-primary-foreground font-light"
                        }`}
                        onPress={() => cambiarVista("calendario")}
                    >
                        Calendario
                    </Button>
                    <Button
                        radius="full"
                        className={`text-[15px] md:text-[16px] leading-[20px] border-4 font-bold ${vistaActual === "horarios"
                            ? "text-primary dark:text-primary bg-background dark:bg-background"
                            : "bg-transparent border border-background text-background dark:text-primary-foreground font-light"
                        }`}
                        onPress={() => cambiarVista("horarios")}
                    >
                        Mis Horarios
                    </Button>
                </div>
                </div>
        {/* Título en desktop */}
        <div className="text-primary-foreground font-semibold text-lg md:text-2xl mx-auto hidden md:block">
                    {nombreMes[0].toUpperCase() + nombreMes.slice(1)} de {currentDate.getFullYear()}
                </div>{/* Botones de cambio de vista */}
                <div className="flex gap-2 items-center w-full max-w-full md:max-w-[530px] justify-center md:justify-end mt-2 md:mt-0">
                    <Button
                        radius="full"
                        className={`text-[15px] md:text-[16px] leading-[20px] border-4 font-bold ${vistaActual === "calendario" && view === "month"
                            ? "text-primary dark:text-primary bg-background dark:bg-background"
                            : "bg-transparent border border-background text-background dark:text-primary-foreground font-light"
                        }`}
                        onPress={() => cambiarVistaGlobal("calendario", "month")}
                    >
                        Mes
                    </Button>
                    <Button
                        radius="full"
                        className={`text-[15px] md:text-[16px] leading-[20px] border-4 font-bold ${vistaActual === "calendario" && view === "week"
                            ? "text-primary dark:text-primary bg-background dark:bg-background"
                            : "bg-transparent border border-background text-background dark:text-primary-foreground font-light"
                        }`}
                        onPress={() => cambiarVistaGlobal("calendario", "week")}
                    >
                        Semana
                    </Button>
                    <Button
                        radius="full"
                        className={`text-[15px] md:text-[16px] leading-[20px] border-4 font-bold ${vistaActual === "calendario" && view === "day"
                            ? "text-primary dark:text-primary bg-background dark:bg-background"
                            : "bg-transparent border border-background text-background dark:text-primary-foreground font-light"
                        }`}
                        onPress={() => cambiarVistaGlobal("calendario", "day")}
                    >
                        Dia
                    </Button>
                </div>
            </div>

            <div className="bg-[#f8f8ff] dark:bg-background ">
                {vistaActual === "horarios"
          ? <Week/>
          :
                    <Calendario vista={view} citasPorDia={citasPorDia} date={currentDate}/>}
            </div>

            <ModalCitaExample isOpen={isOpen} onOpenChange={onOpenChange}/>
        </div>
    );
}
