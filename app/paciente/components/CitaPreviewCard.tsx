'use client'

import { Cita } from "../types/pacienteInterfaces";
import { CalendarClock, ChevronRight } from "lucide-react"; 
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import React from "react";

const getEstadoColor = (estado: string) => {
  switch (
    estado
  ) {
    case "realizado": 
    case "aprobado":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"; // Verde
    case "pendiente":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500"; // Amarillo
    case "Sin pagar":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-500"; // Rojo
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"; // Gris neutro
  }
};

const onClick = (cita: Cita, router : AppRouterInstance) => {
    sessionStorage.setItem("miCita",JSON.stringify(cita));
    router.push('/paciente/citas/detalleCita');
}

const CitaPreviewCard = ({cita, router} : {cita: Cita, router : AppRouterInstance}) => {
    return (
        <div
        key={cita.idCita}
        className="rounded-xl text-card-foreground shadow bg-card border flex flex-col h-full"
        style={{
            borderLeftColor: cita.colores,
            borderLeftWidth: "4px",
            // borderBottomColor: cita.colores,
            // borderBottomWidth: "4px",
        }}
        >
            <div className="grow p-5 box-border flex flex-col justify-between gap-y-3">
                <div className="flex flex-col gap-y-3 lg:flex-row justify-between lg:items-center">
                <div className="order-2 flex gap-x-scv3 items-center">
                    <div className={`p-2 rounded-lg ${getEstadoColor(cita.estado_Cita)}`}>
                    <CalendarClock />
                    </div>
                    <div>
                    <p className="font-medium text-[17px] xl:text-cv5">
                        {cita.fecha_cita}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {cita.hora_cita}
                    </p>
                    </div>
                </div>
                <div className={`order-1 lg:order-3 px-3 py-1 h- w-fit rounded-full text-nowrap  text-cv2 xltext-base ${getEstadoColor(cita.estado_Cita)}`}>
                    {cita.estado_Cita}
                </div>
                </div>
                <hr />
                <div className="flex flex-col lg:flex-row  gap-y-3 mt-3 justify-between lg:items-center">
                <div className="flex gap-x-6">
                    <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Duración
                    </p>
                    <p>{cita.duracion} minutos</p>
                    </div>
                    <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Especialista
                    </p>
                    <p>
                        {cita.nombrePsicologo} {cita.apellidoPsicologo}
                    </p>
                    </div>
                </div>

                <button onClick={() => onClick(cita,router)} className="h-[24px] lg:h-[44px] flex items-center justify-center gap-1 lg:gap-2 whitespace-nowrap rounded-md text-cv1 lg:text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 lg:px-4 lg:py-2">
                    Ver más  
                    <ChevronRight strokeWidth={4} />
                </button>
                </div>
            </div>
        </div>
    )
}


export default React.memo(CitaPreviewCard);