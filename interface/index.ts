import { DateValue } from "@heroui/react";
import React from "react";
import {GenericFilters} from "@/components/ui/Table/EmptyTable";

export interface CardServicesProps {
  title: string;
  description: string;
  imageUrl: string;
  color: string;
}

export interface QuestionInterface {
  Question: string;
  Answer?: React.ReactNode;
}

export interface PanelProps {
  estado: boolean;
  setEstado: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface UserInterface {
  name: string | null;
  email: string | null;
  lastname: string | null;
  photo: string | null;
  iniciales: string | null;
}

export interface UpdateUserProps {
  task: never;
}

export interface FAQ {
  Question: string;
  Answer: string;
}

// Definición de las propiedades del componente AccordionQuest
export interface AccordionQuestProps {
  faqs: FAQ[];
}
//interface Services para el componente ServicesStructure No le mueva nada caracho
export interface ServicesStructureProps {
  title: string;
  edad: string;
  motto: string;
  background: string;
  bgdown: string;
  bgup: string;
  description: string;
  tittleIcon: string;
  iconos: {
    id: number;
    title?: string;
    text: string;
    iconImage: string;
  }[];
  tittlecards: string;
  cards: {
    id: number;
    title?: string;
    text: string;
    icon: string;
  }[];
  textfooter: string;
  textfootermobile:string;
  promotionCards?: PromotionCardProps[];
}

export interface PromotionCardProps {
  id: number;
  title: string;
  preciounit: string;
  cents: string;
  regularprice: string;
  list: {
    id: number;
    text: string;
  }[]
}

//Quienes Somos
export interface QuienesSomos {
  quienesSomos: string;
  mision: string;
  vision: string;
  valor1: string;
  valor2: string;
  valor3: string;
}

export interface NavItem {
  name: string;
  link: string;
  isButton?: boolean;
}

export interface Genero {
  label: number;
  genero: string;
}

export interface FormData {
  name: string;
  apellido: string;
  fecha_nacimiento: DateValue | string;
  titulo: string;
  genero: string;
  pais: string;
  email: string;
  password: string;
  introduccion: string;
  imagen: string;
  experiencia: number;
  especialidades: number[];
  horario: { 
    [key: string]: string[][];
  };
}

export interface Especialidad {
  idEspecialidad: number;
  nombre: string;
}

export interface Contact {
  nombre: string,
  apellido: string,
  celular: string,
  email: string,
  comentario: string,
}

export interface BlogApi {

  idCategoria: number | null,
  tema: string,
  contenido: string,
  imagenes: string[], // Array de imágenes
  idPsicologo: number | null;

}

export interface BlogApiGEt {
  idBlog: number | null,
  categoria: string,
  tema: string,
  contenido: string,
  imagen: string, // Mantener para compatibilidad
  imagenes?: string[], // Nuevo campo opcional
  idPsicologo: number,
}
//BLogs Preview Data
export interface BlogPreviewData {
  idBlog: number,
  tema: string,
  contenido: string,
  imagen: string, // Mantener para compatibilidad
  imagenes?: string[], // Nuevo campo opcional
  psicologo: string,
  psicologApellido: string,
  psicologoImagenId: string,
  categoria: string,
  fecha: string,
}

export interface ApiResponseBLogAlone {
  result: BlogPreviewData;
}

export interface ApiResponse {
  result: BlogPreviewData[];
}

export interface PsicologoPreviewData {
  idPsicologo: number,
  titulo:string,
  nombre: string,
  apellido: string,
  pais: string,
  introduccion: string,
  genero: string,
  experiencia: number,
  correo: string,
  contrasena: string,
  fecha_nacimiento: string,
  especialidades: string[],
  imagen: string,
  horario: {
    [key: string]: [string, string][];
  };
}

export interface PsicologoApiResponse {
  status_code: number;
  status_message: string;
  description: string;
  errorBag: never[];
  result: PsicologoPreviewData[];
}

export interface PsicologoApiResponseAlone {
  status_code: number;
  status_message: string;
  description: string;
  errorBag: never[];
  result: PsicologoPreviewData;
}

export interface UsuarioLocalStorage {
  id: number,
  nombre: string,
  apellido: string,
  email: string,
  rol: string,
  imagen: string,
  idpsicologo?: number,
}

//Usuario LocalStorage
export interface UserInterface {
  name: string | null;
  email: string | null;
  lastname: string | null;
  photo: string | null;
  iniciales: string | null;
}

export interface Categoria {
  idCategoria: number;
  nombre: string;
}
export interface CategoriaApi {
  status_code: number;
  status_message: string;
  description: string;
  errorBag: never[];
  result: Categoria[];
}

export interface Authors {
  id: number;
  name: string;
  lastname: string;
  photo: string;
}

export interface AuthorsApi {
  status_code: number;
  status_message: string;
  description: string;
  errorBag: never[];
  result: Authors[];
}

export interface NavItems {
  name: string;
  link: string;
  icono: string;
}

// Interface for horarios psicologos
export interface Horarios {
  [dia: string]: [string, string][];
}

export interface BotonHorarioProps {
  hora: string;
  ocupada: boolean;
  onClick: () => void;
}

export interface CitasPendientes {
  fecha: string;
  hora: string;
}

export interface CitasPendientesApiResponse {
  status_code: number;
  status_message: string;
  description: string;
  errorBag: never[];
  result: CitasPendientes[]; 
}

export interface PrePaciente {
  nombre: string,
  celular: string,
  correo: string,
  fecha_cita: string,
  hora_cita: string,
  idPsicologo: number,
}

export interface Paciente {
  idPaciente: number,
  DNI: string,
  codigo: string,
  nombre: string,
  apellido:string,
  email: string,
  celular: string,
  fecha_nacimiento: Date,
  edad: number,
  imagen: string,
  genero: string,
  ocupacion: string,
  estadoCivil: string,
  direccion: string,
  idPsicologo: number
  ultima_cita_fecha: Date
}

export interface Paciente2 {
  idPaciente: number,
  DNI: string,
  nombre: string,
  apellido:string,
  email: string,
  celular: string,
  fecha_nacimiento: string,
  imagen: string,
  genero: string,
  ocupacion: string,
  estadoCivil: string,
  direccion: string,
  pais: string | null,
  provincia: string | null,
  departamento: string | null,
}

export interface FormPaciente {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  DNI: string;
  email: string;
  imagen: string;
  celular: string;
  fecha_nacimiento: string;
  genero: string;
  estadoCivil: string;
  ocupacion: string;
  direccion: string;
  departamento: string| null;
  provincia: string| null;
  pais: string| null;
  antecedentesMedicos: string;
  medicamentosPrescritos: string;
}

export interface FormFamilia {
  nombre_madre: string,
  estado_madre: string,
  nombre_padre: string,
  estado_padre: string,
  nombre_apoderado: string,
  estado_apoderado: string,
  cantidad_hijos: number,
  cantidad_hermanos: number,
  integracion_familiar: string,
  historial_familiar: string,
  paciente?: {
      idPaciente: string,
      nombre: string,
      apellido: string,
      codigo: string,
  } 
}

export interface DatosPacienteProps {
  idPaciente: number | null;
}

export interface Country {
  id: number;
  name: string;
}

export interface State {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
}

export interface Cita {
  idCita: number;
  idPaciente: number;
  idPsicologo: number;
  idTipoCita: number;
  idCanal: number;
  idEtiqueta: number;
  motivo_Consulta: string;
  estado_Cita: string;
  colores: string;
  duracion: number;
  fecha_cita: string;
  hora_cita: string;
}

export interface Citas {
  idCita: string;
  idPaciente: string;
  idPsicologo: string;
  paciente: string;
  codigo: string;
  fecha_inicio: string;
  estado: string;
  edad: number;
  motivo: string;
  duracion: string;
  genero: string;
  fecha_nacimiento: string;
}
export interface CitasApiResponse {
  status_code: number;
  status_message: string;
  description: string;
  errorBag: never[];
  result: Citas[];
}

export interface CitasConteo {
  pendientes: number;
  canceladas: number;
  confirmadas: number;
}

export interface DatePacienteProps {
  idPaciente: number;
}

export interface HistorialPacienteProps {
  idPaciente: number;
  ultimaAtencion : UltimaAtencion | null;
}

export interface AtencionFormData {
  MotivoConsulta: string;
  FormaContacto: string;
  Diagnostico: string;
  Tratamiento: string;
  Observacion: string;
  idEnfermedad: string;
  UltimosObjetivos: string;
  FechaAtencion: string;
  DocumentosAdicionales: string;
  Comentario: string;
  descripcion: string;
  idCita?: number;
}

export interface ListaAtencion{
  hora_inicio: string;
  nombre_completo: string;
  diagnostico: string;
  idCita: string;
  fecha_inicio: string;
  idAtencion: string;
  idPaciente: string;
  codigo: string;
  age:string;
}

export interface Enfermedad {
  idEnfermedad: number;
  nombreEnfermedad: string;
  DSM5: string;
  CEA10: string;
}

export interface DetallesAtencionProps {
  idAtencion: string;
}

export interface CustomizedLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}

export interface UltimaAtencion {
  idPaciente: number;
  nombre: string;
  apellido: string;
  DNI: string;
  codigo: string;
  celular: string;
  edad: number;
  fecha_completa: string;
  fecha_atencion: string;
  diagnostico: string;
  observacion: string;
  ultimosObjetivos: string;
  comentario: string;
  idAtencion: number;
  tratamiento: string;
}

export interface DashboardResult {
  total_citas: number;
  citas_completadas: number;
  citas_pendientes: number;
  citas_canceladas: number;
  total_minutos_reservados: number | string;
  total_pacientes: number;
  nuevos_pacientes: number;
  citas_confirmadas: number;
}

export interface DashboardApiResponse {
  status_code: number;
  status_message: string;
  description: string;
  errorBag: never[];
  result: DashboardResult;
}

export interface CitaMensual {
  fecha: string,
  total: number
}
export interface CitaMensualResponse {
  result: CitaMensual;
}

export interface GeneroEstadisticaDetalle {
  cantidad: number;
  porcentaje: number;
}

export interface GeneroEstadisticaResult {
  Masculino: GeneroEstadisticaDetalle;
  Femenino: GeneroEstadisticaDetalle;
}

export interface GeneroEstadisticaApiResponse {
  status_code: number;
  status_message: string;
  description: string;
  result: GeneroEstadisticaResult;
  errorBag: never[];
}

export interface FiltersPaciente extends GenericFilters {
  genero: string[];
  edad: string[];
  fechaUltimaCita: string[];
}

export const FiltersInitialState: FiltersPaciente = {
  genero: [],
  edad: [],
  fechaUltimaCita: [],
};

export interface FiltersCitas extends GenericFilters {
  genero: string[];
  estado: string[];
  edad: string[];
  fechaInicio: string[];
}

export interface EmailBlock {
    id: string;
    type: "divider" | "image" | "header" | "text" | "columns";
    imageUrl?: string;
    imageUrls?: string[];
    content?: string;
    styles?: { color?: string; bold?: boolean; italic?: boolean };
}

export interface Plantilla {
    id: number;
    nombre: string;
    asunto: string;
    remitente: string;
    destinatarios: string;
    bloques: EmailBlock[];
}

export interface MarketingApiResponse {
    result: Plantilla[];
}

export interface SelectItemI {
  textValue: string,
  showLabel: string,
}