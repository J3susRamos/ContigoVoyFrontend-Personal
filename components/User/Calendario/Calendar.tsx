import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from 'dayjs';
import 'dayjs/locale/es'; 
dayjs.locale('es'); 
import "react-big-calendar/lib/css/react-big-calendar.css";

export default function Calendario() {
  const localizer = dayjsLocalizer(dayjs);
  const events = [
    {
      title: 'Evento 1',
      start: dayjs('2025-04-04').toDate(),
      end: dayjs('2025-04-04').toDate()
    },
  ];
  
  return (
    <div className="mx-auto mt-3"
      style={{
        height: "90vh",
        width: "80vw",
      }}
    >
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
          noEventsInRange: 'No hay eventos en este rango',
          showMore: total => `+ Ver más (${total})`
        }}
        className="calendar-component bg-background dark:bg-background text-primary dark:text-primary-foreground"
        localizer={localizer}
        events={events}
      />
    </div>
  );
}