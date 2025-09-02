"use client";

import { useEffect, useState, useRef } from "react";
import CerrarSesion from "@/components/CerrarSesion";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import showToast from "@/components/ToastStyle";
import { CitasConteo } from "@/interface";
import HeaderPaciente from "./components/HeaderPaciente";

import { GetCitas } from "./apiRoutes";
import { formatDate } from "./utils/formatDate";
import { Cita } from "./types/pacienteInterfaces";
import Link from "next/link";

import {
  CalendarDays, // Ícono de calendario (día)
  Video, // Ícono de videollamada
  UploadCloud, // Ícono de subir a la nube
  Clock, // Ícono de reloj
  CheckCircle, // Ícono de check/éxito
  FileImage, // Ícono de imagen/archivo
  Calendar, // Ícono de calendario genérico
  Activity, // Ícono de actividad/estadística
  History, // Ícono de historial
  Settings, // Ícono de ajustes
  Bell, // Ícono de notificaciones (no se usa en este snippet, pero disponible)
  Download, // Ícono de descarga
  Eye, // Ícono de ver/preview
  Phone, // Ícono de teléfono (no se usa aquí)
  Mail, // Ícono de correo (no se usa aquí)
  ChevronDown, // Ícono de desplegar hacia abajo
  ChevronUp, // Ícono de desplegar hacia arriba
  RefreshCw, // Ícono de recargar/rehacer (reagendar)
  Loader2, // Ícono spinner (cargando)
  X, // Ícono de cerrar/eliminar
  ChevronRight,
} from "lucide-react"; // Paquete de íconos

// Componente de imagen optimizada de Next.js
import Image from "next/image"; // Gestiona lazy-loading y optimización
import usePaciente from "./hooks/usePaciente";

// --------------------------
// Definición de tipos (TypeScript)
// --------------------------



// Interfaz de un pago
interface Pago {
  id: number; // ID del pago
  fecha: string; // Fecha del pago
  monto: number; // Monto en número
  voucher: string; // URL del comprobante (imagen/pdf)
  estado: "aprobado" | "pendiente" | "rechazado"; // Estado del pago
  descripcion: string; // Descripción (concepto)
  metodoPago: string; // Método (Yape, Plin, transferencia, etc.)
}

const getEstadoColor = (estado: string) => {
  switch (estado) {
    case "confirmada": // Cita confirmada
    case "aprobado": // Pago aprobado
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"; // Verde
    case "pendiente": // En espera
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500"; // Amarillo
    case "rechazado": // Rechazado
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-500"; // Rojo
    default: // Otro estado
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"; // Gris neutro
  }
};

const Paciente = () => {
  const [loading, setLoading] = useState(true);
  const paciente = usePaciente();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState<string | null>(
    null
  );
  const [citas, setCitas] = useState<Cita[] | null>(null);
  const [expandedCitas, setExpandedCitas] = useState<number[]>([]);
  const [expandedPagos, setExpandedPagos] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const HandleGetCitas = async (signal: AbortSignal) => {
    try {
      const dataCitas = await GetCitas(1, 5, "", "", null, null, signal);
      console.log(dataCitas);
      const citasResponse = dataCitas.citas;
      const citasInfo = citasResponse.data as Cita[];
      const formatCitas = citasInfo.map((c) => ({
        ...c,
        fecha_cita: formatDate(c.fecha_cita),
      }));
      setCitas(formatCitas);
      showToast("success", "Citas obtenidas correctamente");
    } catch (error: any) {
      if (error.name != "AbortError")
        showToast("error", "Error al obtener las citas");
    } finally {
      setLoading(false);
    }
  };


  // Historial de pagos de ejemplo (simulado)
  const historialPagos: Pago[] = [
    {
      id: 1,
      fecha: "2025-07-20",
      monto: 120.0,
      voucher:
        "https://res.cloudinary.com/dp6slcmoi/image/upload/v1753067666/ljcukcivg7qgetcn80z4.png",
      estado: "aprobado",
      descripcion: "Consulta psicológica",
      metodoPago: "Transferencia bancaria",
    },
    {
      id: 2,
      fecha: "2025-07-15",
      monto: 150.0,
      voucher:
        "https://res.cloudinary.com/dp6slcmoi/image/upload/v1701525535/cld-sample.jpg",
      estado: "aprobado",
      descripcion: "Terapia de pareja",
      metodoPago: "Yape",
    },
  ];

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    HandleGetCitas(signal);

    return () => abortController.abort();
  }, []);


  const joinVideoCall = (citaId: number) => {
    window.open(`/videocall/${citaId}`, "_blank");
  };

  const handleReagendar = (cita: Cita) => {
    alert(
      `Preparando para reagendar cita con ${
        cita.apellidoPsicologo + " " + cita.nombrePsicologo
      } el ${cita.fecha_cita} a las ${cita.hora_cita}`
    );
  };

  const toggleExpandCita = (id: number) => {
    setExpandedCitas((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleExpandPago = (id: number) => {
    setExpandedPagos((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6 lg:py-8 space-y-6">
        <HeaderPaciente paciente={paciente} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Próximas Citas
                </p>
                <p className="text-2xl font-bold">{citas?.length}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pagos Aprobados
                </p>
                <p className="text-2xl font-bold">
                  {historialPagos.filter((p) => p.estado === "aprobado").length}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Invertido
                </p>
                <p className="text-2xl font-bold">
                  S/{" "}
                  {historialPagos
                    .filter((p) => p.estado === "aprobado")
                    .reduce((sum, p) => sum + p.monto, 0)
                    .toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* -------------------- SECCIÓN: Citas -------------------- */}
        <section>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4 mt-7">
            <div className="flex gap-3 items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-bold">Tus próximas citas</h2>
            </div>

            <Link href="/paciente/citas" className="sm:w-scv10">
              <button className=" flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 px-4 py-2">
                Más citas
                <ChevronRight strokeWidth={4} />
              </button>
            </Link>
          </div>

          <div className="space-y-3">
            {citas?.map((cita) => (
              <Card key={cita.idCita} className="overflow-hidden">
                {/* Cabecera clickable del acordeón */}
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  onClick={() => toggleExpandCita(cita.idCita)}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-lg ${getEstadoColor(
                        cita.estado_Cita
                      )}`}
                    >
                      <CalendarDays className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{cita.fecha_cita}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {cita.apellidoPsicologo + " " + cita.apellidoPsicologo}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${getEstadoColor(
                        cita.estado_Cita
                      )}`}
                    >
                      {cita.estado_Cita.charAt(0).toUpperCase() +
                        cita.estado_Cita.slice(1)}
                    </span>
                    {expandedCitas.includes(cita.idCita) ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </div>

                {/* Contenido expandido de la cita */}
                {expandedCitas.includes(cita.idCita) && (
                  <CardContent className="p-4 pt-3 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarDays className="w-4 h-4 text-blue-500" />
                        <span>{cita.fecha_cita}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-green-500" />
                        <span>{cita.hora_cita}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Video className="w-4 h-4 text-purple-500" />
                      <span>Videollamada en línea</span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        className="w-full"
                        //onClick={() => joinVideoCall(cita.id)}
                        disabled={cita.estado_Cita !== "confirmada"}
                      >
                        <Video className="w-4 h-4 mr-2" />
                        {cita.estado_Cita === "confirmada"
                          ? "Ingresar a videollamada"
                          : "Cita pendiente"}
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleReagendar(cita)}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Subir voucher
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-6" />

        {/* -------------------- SECCIÓN: Historial de pagos -------------------- */}
        <section>
          {/* Encabezado de sección */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <History className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-xl font-bold">Historial de pagos</h2>
          </div>

          <div className="space-y-3">
            {historialPagos.map((pago) => (
              <Card key={pago.id}>
                {/* Cabecera clickable del pago */}
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  onClick={() => toggleExpandPago(pago.id)}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-lg ${getEstadoColor(
                        pago.estado
                      )}`}
                    >
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{pago.descripcion}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(pago.fecha)} • {pago.metodoPago}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${getEstadoColor(
                        pago.estado
                      )}`}
                    >
                      {pago.estado.charAt(0).toUpperCase() +
                        pago.estado.slice(1)}
                    </span>
                    {expandedPagos.includes(pago.id) ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </div>

                {/* Contenido expandido del pago */}
                {expandedPagos.includes(pago.id) && (
                  <CardContent className="p-4 pt-0 space-y-4">
                    <div className="relative w-full h-40 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                      <Image
                        src={pago.voucher}
                        alt={`Comprobante de pago - ${pago.descripcion}`}
                        fill
                        className="object-contain"
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-green-600 dark:text-green-400">
                        S/ {pago.monto.toFixed(2)}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(pago.voucher, "_blank")}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Ver
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const link = document.createElement("a"); // Crea un elemento <a>
                            link.href = pago.voucher; // Asigna el origen del archivo
                            link.download = `comprobante-${
                              pago.id
                            }.${pago.voucher.split(".").pop()}`; // Sugiere nombre de descarga
                            link.click(); // Dispara la descarga
                          }}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Descargar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Paciente; 
