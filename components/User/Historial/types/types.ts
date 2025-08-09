import { ReactNode } from "react";

export type InfoItem = {
  label: string;
  value: string;
};

export interface PatientData {
  nombre: string;
  codigo: string;
}

export interface HistorialCardProps {
  paciente: PatientData;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  info?: InfoItem[];
  children?: ReactNode;
  className?: string;
}

export type ActionVariant = "default" | "primary" | "danger";