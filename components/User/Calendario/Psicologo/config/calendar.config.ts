import dayjs from 'dayjs';
import 'dayjs/locale/es';

// Configurar dayjs
dayjs.locale('es');

export const CALENDAR_CONFIG = {
  step: 15, // Intervalos de 15 minutos
  timeslots: 4, // 4 slots por hora
  popupOffset: 30,
  defaultDuration: 60, // minutos
} as const;

export const CALENDAR_MESSAGES = {
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
} as const;

export const CALENDAR_STYLES = {
  event: {
    backgroundColor: '#ffffff',
    color: '#9e57e7',
    borderRadius: '8px',
    border: 'none',
    padding: '4px 8px',
    fontWeight: 500,
    fontSize: '1rem',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  dot: {
    display: "inline-block",
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "#f59b41",
    marginRight: 8,
    flexShrink: 0,
  }
} as const;