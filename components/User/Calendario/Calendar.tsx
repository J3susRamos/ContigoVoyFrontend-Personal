"use client";

import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Citas } from "@/interface";
import { useEffect, useState } from "react";
import CalendarModal from "./CalendarModal";

interface CalendarioProps {
  citasPorDia: Record<string, Citas[]>;
}

// Componente personalizado para el evento
function CustomEvent({ event }: any) {
  return (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        width: "100%",
        minWidth: 0, // importante para truncar
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "#f59b41", // color algo naranja
          marginRight: 8,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          display: "block",
          width: "100%",
        }}
      >
        {event.title}
      </span>
    </span>
  );
}

export default function Calendario({ citasPorDia }: CalendarioProps) {
  const [selectedCita, setSelectedCita] = useState<Citas | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const localizer = dayjsLocalizer(dayjs);
  const events = Object.entries(citasPorDia).flatMap(([fecha, citas]) =>
    citas.map((cita) => {
      const [dateStr, timeStr] = cita.fecha_inicio.split(" ");
      const start = dayjs(`${dateStr}T${timeStr}`);
      const end = start.add(Number(cita.duracion) || 60, "minute");
      return {
        title: `${start.format("HH:mm")} ${cita.paciente}`,
        start: start.toDate(),
        end: end.toDate(),
        resource: cita,
      };
    })
  );

  // Handler para clicks en eventos - abre el modal
  const handleEventClick = (event: any) => {
    setSelectedCita(event.resource); // event.resource contiene la cita original
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCita(null);
  };

  // Manejar cierre del modal con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const eventStyleGetter = () => ({
    style: {
      backgroundColor: '#ffffff',
      color: '#9e57e7', // color algo lila
      borderRadius: '8px',
      border: 'none',
      padding: '4px 8px',
      fontWeight: 500,
      fontSize: '1rem',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
    }
  })

  return (
    <>
      <div className="mx-auto mt-3" style={{ height: "90vh", width: "80vw" }}>
        <Calendar
          messages={{
            allDay: 'Todo el día',
            previous: 'Anterior',
            next: 'Siguiente',
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana',
            day: 'Día',
            agenda: 'Agenda',
            date: 'Fecha',
            time: 'Hora',
            event: 'Evento',
            noEventsInRange: 'No hay eventos en este rango'
          }}
          className="calendar-component bg-background dark:bg-background text-primary dark:text-primary-foreground"
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          titleAccessor="title"
          components={{
            event: CustomEvent
          }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleEventClick}
          // Configuración adicional
          popup // Mostrar popup para eventos que no caben
          popupOffset={30}
          step={15} // Intervalos de 15 minutos
          timeslots={4} // 4 slots por hora (15min cada uno)
        />
      </div>
      {
        <CalendarModal isOpen={isModalOpen} onClose={closeModal} cita={selectedCita} />
      }
    </>
  );
}