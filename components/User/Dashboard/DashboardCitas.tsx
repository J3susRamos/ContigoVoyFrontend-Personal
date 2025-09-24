"use client";
import React, { useEffect, useState } from "react";
import { GetCitasPsicologoPorMes } from "@/app/apiRoutes";
import { Citas } from "@/interface";
import CalendarModal from "./CitasModal";

type Cita = {
  id: number;
  hora: string;
  descripcion: string;
};

const DEFAULT_APPOINTMENT_DESCRIPTION = "No hay cita programada";

const generateDefaultAppointments = (startHour: number = 1, endHour: number = 24): Cita[] => {
    return Array.from({length: endHour - startHour + 1}, (_, index) => {
        const hour = startHour + index;
        const displayHour = hour === 24 ? 0 : hour;

        return {
            id: hour,
            hora: `${displayHour.toString().padStart(2, '0')}:00`,
            descripcion: DEFAULT_APPOINTMENT_DESCRIPTION
        };
    });
};

const cita: Cita[] = generateDefaultAppointments();

const fechaHoy = new Date().toLocaleDateString('es-ES', {
  day: 'numeric',
  month: 'long'
});

export default function DashboardCitas() {
  const [citasDelDia, setCitasDelDia] = useState<Citas[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState<Citas | null>(null);

  useEffect(() => {
      
        GetCitasPsicologoPorMes().then(res => {
          const hoy = new Date();
          const citasHoy = res.result.filter((cita: Citas) => {
            const fecha = new Date(cita.fecha_inicio);
            return (
              fecha.getDate() === hoy.getDate() &&
              fecha.getMonth() === hoy.getMonth() &&
              fecha.getFullYear() === hoy.getFullYear() &&
              (cita.estado === "Confirmada" || cita.estado === "Pendiente")
            );
          });
          setCitasDelDia(citasHoy);
        }).catch(err => console.log(err));
      }, []);

  // Agrupar citas por hora y minutos
  const citasPorHora: { [hora: string]: Citas[] } = {};
  cita.forEach((slot) => {
    citasPorHora[slot.hora] = [];
  });

  citasDelDia.forEach((cita) => {
    const fecha = new Date(cita.fecha_inicio);
    const horaSlot = `${fecha.getHours().toString().padStart(2, '0')}:00`;
    if (citasPorHora[horaSlot]) {
      citasPorHora[horaSlot].push(cita);
    } else {
      const horas = Object.keys(citasPorHora).map(h => parseInt(h));
      const closest = horas.reduce((prev, curr) =>
        Math.abs(curr - fecha.getHours()) < Math.abs(prev - fecha.getHours()) ? curr : prev
      );
      const closestSlot = `${closest.toString().padStart(2, '0')}:00`;
      citasPorHora[closestSlot].push(cita);
    }
  });

  const handleOpenModal = (cita: Citas) => {
    setCitaSeleccionada(cita);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCitaSeleccionada(null);
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-[#222223] dark:to-[#1a1a1b] w-full rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">

      {/* Header mejorado */}
      <div className="flex items-center justify-between rounded-t-2xl py-4 px-6 text-[#fff] bg-gradient-to-r from-[#6364F4] to-[#7C7CF5] shadow-md">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="font-medium text-xl">Citas del Día</span>
        </div>
        <button
          className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all duration-200 hover:scale-105"
          title="Agregar nueva cita"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
      
      {/* Información de fecha con diseño mejorado */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <div className="bg-purple-200 dark:bg-purple-700 p-2 rounded-lg">
            <svg className="w-5 h-5 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Fecha de Hoy</p>
            <p className="text-lg font-semibold text-purple-700 dark:text-purple-300">{fechaHoy}</p>
          </div>
        </div>
      </div>

      {/* Lista de horarios con scroll personalizado */}
      <div className="h-[400px] md:h-[500px] lg:h-[600px] overflow-y-auto p-4 md:p-6" style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#6364F4 #f1f1f1'
      }}>
        <div className="space-y-2 md:space-y-3">
          {cita.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200">
              <div className="flex flex-col sm:flex-row sm:items-start p-3 md:p-4 gap-3">
                {/* Columna de hora - responsive */}
                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-24 md:w-28 flex-shrink-0">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                    <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="font-semibold text-blue-600 dark:text-blue-400 text-base md:text-lg">
                    {item.hora}
                  </span>
                </div>

                {/* Columna de contenido - responsive */}
                <div className="flex-1 min-w-0">
                  {citasPorHora[item.hora] && citasPorHora[item.hora].length > 0 ? (
                    <div className="space-y-2">
                      {citasPorHora[item.hora].map((cita, idx) => (
                        <div
                          key={cita.idCita || idx}
                          className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-3 md:p-4 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.01]"
                          onClick={() => handleOpenModal(cita)}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                            <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full flex-shrink-0">
                                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-gray-800 dark:text-white text-sm md:text-base truncate">
                                  {cita.paciente}
                                </p>
                                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 break-words">
                                  {new Date(cita.fecha_inicio).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} • 
                                  ({cita.codigo}) • {cita.edad} años
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 self-start sm:self-center flex-shrink-0">
                              {/* Badge de estado */}
                              <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                                cita.estado === 'Confirmada' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              }`}>
                                {cita.estado}
                              </span>
                              <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 py-2">
                      <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg flex-shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </div>
                      <span className="italic text-sm md:text-base">{item.descripcion}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Modal para la cita */}
      <CalendarModal
        cita={citaSeleccionada}
        isOpen={modalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
