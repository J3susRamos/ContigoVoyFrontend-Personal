"use client";

import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from 'dayjs';
import 'dayjs/locale/es';
dayjs.locale('es');
import "react-big-calendar/lib/css/react-big-calendar.css";
import CalendarModal from "./modal/CalendarModal";
import { useCalendarModal } from "./hooks/useCalendarModal";
import { CalendarioProps } from "./types/calendar.types";
import { eventStyleGetter } from "./utils/calendar.utils";
import CustomEvent from "./CustomEvent";
import { CALENDAR_CONFIG, CALENDAR_MESSAGES } from "./config/calendar.config";
import { useCalendarEvents } from "./hooks/useCalendarEvents";


export default function Calendario({ citasPorDia, vista, date }: CalendarioProps) {
  const { selectedCita, isModalOpen, handleEventClick, closeModal } = useCalendarModal();

  const localizer = dayjsLocalizer(dayjs);
  const events = useCalendarEvents(citasPorDia);

  return (
    <>
      <div className="mx-auto mt-3" style={{ height: "90vh", width: "80vw" }}>
        {vista === "day" && (
          <div className="text-center text-2xl font-bold mb-2 text-primary">
            {date.toLocaleDateString("es-ES", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        )}
        <Calendar
          messages={CALENDAR_MESSAGES}
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
          popup
          popupOffset={CALENDAR_CONFIG.popupOffset}
          step={CALENDAR_CONFIG.step}
          timeslots={CALENDAR_CONFIG.timeslots}
          view={vista}
          onView={() => {}}
          date={date}
          onNavigate={() => {}}
          min={new Date(1970, 1, 1, 7, 0, 0)}   // 07:00
          max={new Date(1970, 1, 1, 20, 0, 0)}  // 18:00
       />
      </div>
      <CalendarModal
        isOpen={isModalOpen}
        onClose={closeModal}
        cita={selectedCita}
      />
    </>
  );
}