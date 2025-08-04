"use client";
import React, { useEffect, useState } from "react";
import { Icons } from "@/icons";
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
    <div className="bg-white dark:bg-[#4B4B4B] w-full pt-8 rounded-2xl">
      <div className="flex rounded-r-full py-5 text-[#fff] bg-[#6364F4] justify-center font-normal text-2xl w-4/6">
        Citas del día
        <button
          className="ml-4 -mt-2 group cursor-pointer outline-none"
          dangerouslySetInnerHTML={{
            __html: Icons.plus.replace(/<svg /, '<svg fill="#E7E7FF" '),
          }}
          style={{
            width: "1.2em",
            height: "1.2em",
          }}
        />
      </div>
      <div className="flex rounded-r-full pl-8 py-2 mt-4 text-[#634AE2] bg-[#E7E7FF] justify-start font-bold text-lg w-4/12">
        Fecha:
        <span className="ml-4 justify-start font-light text-[#634AE2] text-lg">

          {fechaHoy}
        </span>
      </div>

      <div className="flex rounded-r-full pl-8 py-2 mt-3 text-[#634AE2] bg-[#E7E7FF] justify-start font-bold text-lg w-4/12">
        Hora:
      </div>

      <div className="h-[600px] overflow-y-auto p-6 custom-scrollbar">
        <table className="min-w-full table-auto">
          <tbody>
            {cita.map((item) => (
              <tr key={item.id} className="border-b-1 border-[#BABAFF]">
                <td className="font-light text-xl text-[#634AE2] dark:text-white border-r border-[#BABAFF] py-2 px-4">

                  {item.hora}
                </td>
                <td className="pr-32 font-light text-lg text-[#634AE2] dark:text-white py-2 px-4 ">

                  {citasPorHora[item.hora] && citasPorHora[item.hora].length > 0 ? (
                    citasPorHora[item.hora].map((cita, idx) => (
                      <div
                        key={cita.idCita || idx}
                        className="my-2 bg-[#E7E7FF] font-bold w-fit px-12 py-1 rounded-3xl cursor-pointer hover:bg-[#d6d6ff] transition"
                        onClick={() => handleOpenModal(cita)}
                      >
                        <div>
                          {new Date(cita.fecha_inicio).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} {cita.paciente}
                        </div>
                        <div>
                          ({cita.codigo}) {cita.edad} años
                        </div>
                      </div>
                    ))
                  ) : (
                    <span>{item.descripcion}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
