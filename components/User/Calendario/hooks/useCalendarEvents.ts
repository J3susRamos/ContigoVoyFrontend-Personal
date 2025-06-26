import { useMemo } from 'react';
import dayjs from 'dayjs';
import { CALENDAR_CONFIG } from '../config/calendar.config';
import { Citas } from '@/interface';
import { CalendarEvent } from '../types/calendar.types';

export function useCalendarEvents(citasPorDia: Record<string, Citas[]>): CalendarEvent[] {
  return useMemo(() => {
    return Object.values(citasPorDia).flatMap((citas) =>
      citas.map((cita) => {
        const [dateStr, timeStr] = cita.fecha_inicio.split(" ");
        const start = dayjs(`${dateStr}T${timeStr}`);
        const end = start.add(Number(cita.duracion) || CALENDAR_CONFIG.defaultDuration, "minute");

        return {
          title: `${start.format("HH:mm")} ${cita.paciente}`,
          start: start.toDate(),
          end: end.toDate(),
          resource: cita,
        };
      })
    );
  }, [citasPorDia]);
}