export interface Paciente {
  id: number;
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  fechaNacimiento?: string;
  avatar?: string;
}

export interface Cita {
  boucher: null;
  colores: string;
  duracion: number;
  estado_Cita: string;
  fecha_cita: string;
  hora_cita: string;
  idCanal: number;
  idCita: number;
  idEtiqueta: number;
  idPaciente: number;
  idPrepaciente: number;
  idPsicologo: number;
  idTipoCita: number;
  jitsi_url: string | null;
  motivo_consulta: string;
  nombrePsicologo: string;
  apellidoPsicologo: string;
}