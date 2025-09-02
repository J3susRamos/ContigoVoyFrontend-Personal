import { CalendarDate } from "@internationalized/date";

export interface Horario {
  id: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  idPsicologo: number;
  disponible?: boolean;
  paciente?: string;
  estado?: "disponible" | "ocupado" | "bloqueado";
  motivo?: string;
  notas?: string;
}

export interface Psicologo {
  idPsicologo: number;
  nombre: string;
  apellido: string;
}

export interface DateRange {
  start: CalendarDate | null;
  end: CalendarDate | null;
}
