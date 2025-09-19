export interface CitasValues {
  idCita: string | number;
  paciente: string;
  codigo?: string;
  motivo: string;
  estado: string;
  fecha_inicio: string;
  duracion: string;
}

export const isCodigoEmpty = (codigo?: string): boolean => {
  return !codigo || codigo.trim() === '';
};

export const shouldShowPacientButton = (cita: CitasValues): boolean => {
  return isCodigoEmpty(cita.codigo);
};

export const canEditCita = (cita: CitasValues): boolean => {
  return !isCodigoEmpty(cita.codigo);
};

export const formatCitaDate = (fecha: string): string => {
  return new Date(fecha).toLocaleDateString();
};

export const formatCitaTime = (fecha: string): string => {
  return new Date(fecha).toLocaleTimeString();
};