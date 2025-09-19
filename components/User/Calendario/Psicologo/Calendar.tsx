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
import CustomEvent from "./custom/CustomEvent";
import { CALENDAR_CONFIG, CALENDAR_MESSAGES } from "./config/calendar.config";
import { useCalendarEvents } from "./hooks/useCalendarEvents";
import CustomMonthHeader from "./custom/CustomMonthHeader";
import CustomWeekHeader from "./custom/CustomWeekHeader";
import CustomDayHeader from "./custom/CustomDayHeader";
import "./styles/calendar-styles.css"; // agregado


export default function Calendario({ citasPorDia, vista, date }: CalendarioProps) {
  const { selectedCita, isModalOpen, handleEventClick, closeModal } = useCalendarModal();

  const localizer = dayjsLocalizer(dayjs);
  const events = useCalendarEvents(citasPorDia);

  return (
    <>
      <div className="mt-3" style={{ height: "90vh", width: "100%" }}>
        {vista === "day" && (
          <CustomDayHeader date={date} />
        )}

        <Calendar
          messages={CALENDAR_MESSAGES}
          className="calendar-component bg-background dark:bg-background text-primary dark:text-primary-foreground  "
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          titleAccessor="title"
          components={{
            event: CustomEvent,
            month: {
              header: CustomMonthHeader,
            },
            week: {
              header: CustomWeekHeader,
            },
          }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleEventClick}
          popup
          popupOffset={CALENDAR_CONFIG.popupOffset}
          step={CALENDAR_CONFIG.step}
          timeslots={CALENDAR_CONFIG.timeslots}
          view={vista}
          onView={() => { }}
          date={date}
          onNavigate={() => { }}
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



//AGREGADO


