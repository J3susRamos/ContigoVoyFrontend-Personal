import { Citas } from "@/interface";
import { View } from "react-big-calendar";

export interface CalendarioProps {
  citasPorDia: Record<string, Citas[]>;
  vista: View;
  date: Date;
}

export interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  resource: Citas;
}

export interface CustomEventProps {
  event: {
    title: string;
    resource: unknown;
  };
}

export interface CalendarClickEvent {
  resource: Citas;
  title?: string;
  start?: Date;
  end?: Date;
}