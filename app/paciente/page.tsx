"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import showToast from "@/components/ToastStyle";
import HeaderPaciente from "./components/HeaderPaciente";
import { useRouter } from "next/navigation";
import { GetCitas, GetEstadisticasCita, GetBouchers } from "./apiRoutes";
import { formatDate } from "./utils/formatDate";
import { Cita, Boucher } from "./types/pacienteInterfaces";
import { NoDataBox } from "./components/NoDataBox";
import Link from "next/link";

import {
  CalendarDays, // Ícono de calendario (día)
  Video, // Ícono de videollamada
  Clock, // Ícono de reloj
  CheckCircle, // Ícono de check/éxito
  Calendar, // Ícono de calendario genérico
  Activity, // Ícono de actividad/estadística
  History, // Ícono de historial
  Download, // Ícono de descarga
  Eye, // Ícono de ver/preview
  ChevronDown, // Ícono de desplegar hacia abajo
  ChevronUp, // Ícono de desplegar hacia arriba
  RefreshCw, // Ícono de recargar/rehacer (reagendar)
  ChevronRight,
} from "lucide-react"; // Paquete de íconos

// Componente de imagen optimizada de Next.js
import Image from "next/image"; // Gestiona lazy-loading y optimización
import usePaciente from "./hooks/usePaciente";

async function HandleGetEstadisticas() {
  const data = await GetEstadisticasCita();
  return data.data;
}

const citaDummy: Cita = {
  bouchers: null,
  colores: "",
  duracion: 10,
  estado_Cita: "Sin pagar",
  fecha_cita: "2025-10-10",
  hora_cita: "",
  idCanal: 0,
  idCita: 0,
  idEtiqueta: 0,
  idPaciente: 0,
  idPrepaciente: 0,
  idPsicologo: 0,
  idTipoCita: 0,
  jitsi_url: null,
  motivo_Consulta: "",
  nombrePsicologo: "",
  apellidoPsicologo: "",
  fecha_limite: "",
};

const getEstadoColor = (estado: string) => {
  switch (estado) {
    case "confirmada": // Cita confirmada
    case "aceptado":
    case "aprobado": // Pago aprobado
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"; // Verde
    case "pendiente":
    case "Pendiente": // En espera
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500"; // Amarillo
    case "rechazado":
    case "Sin pagar": // Rechazado
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-500"; // Rojo
    default: // Otro estado
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"; // Gris neutro
  }
};

const joinVideoCall = (link: string | undefined | null) => {
  if (link) window.open(link, "_blank");
};

type EstadosCita = {
  "Sin pagar": number;
  Pendiente: number;
  Cancelada: number;
  Realizada: number;
  Ausente: number;
  Reprogramada: number;
};

const Paciente = () => {
  const paciente = usePaciente();
  const router = useRouter();
  const [citasDisponibles, setCitasDisponibles] = useState<Cita[] | null>(null);
  const [citasSinPagar, setCitasSinPagar] = useState<Cita[] | null>(null);
  const [bouchersPaciente, setBouchersPaciente] = useState<Boucher[] | null>(
    null
  );
  const [expandedCitas, setExpandedCitas] = useState<number[]>([]);
  const [expandedPagos, setExpandedPagos] = useState<string[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadosCita>({
    "Sin pagar": 0,
    Pendiente: 0,
    Cancelada: 0,
    Realizada: 0,
    Ausente: 0,
    Reprogramada: 0,
  });

  const HandleGetCitas = async (signal: AbortSignal) => {
    try {
      const [dataCitasSinPagar, dataCitasDisponibles, dataBouchers] =
        await Promise.allSettled([
          GetCitas(1, 5, "Sin pagar", "", null, null, signal),
          GetCitas(1, 5, "Pendiente", "", null, null, signal),
          GetBouchers(1, 5, "", null, null, signal),
        ]);
      if (dataBouchers.status == "fulfilled" && dataBouchers.value) {
        const bouchersResponse = dataBouchers.value.bouchers;
        const bouchersInfo = bouchersResponse.data as Boucher[];
        setBouchersPaciente(bouchersInfo);
        showToast("success", "Bouchers obtenidos correctamente");
        console.log(bouchersInfo);
      }
      if (dataCitasSinPagar.status == "fulfilled" && dataCitasSinPagar.value) {
        const citasResponse = dataCitasSinPagar.value.citas;
        const citasInfo = citasResponse.data as Cita[];
        const formatCitas = citasInfo.map((c) => ({
          ...c,
          fecha_cita: formatDate(c.fecha_cita),
        }));
        setCitasSinPagar(formatCitas);
        showToast("success", "Citas sin pagar obtenidas correctamente");
      }
      if (
        dataCitasDisponibles.status == "fulfilled" &&
        dataCitasDisponibles.value
      ) {
        const citasResponse = dataCitasDisponibles.value.citas;
        const citasInfo = citasResponse.data as Cita[];
        const formatCitas = citasInfo.map((c) => ({
          ...c,
          fecha_cita: formatDate(c.fecha_cita),
        }));
        setCitasDisponibles(formatCitas);
        showToast("success", "Citas disponibles obtenidas correctamente");
      }
    } catch (error) {
      showToast("error", `Error al obtener las citas: ${error}`);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    HandleGetCitas(signal);
    HandleGetEstadisticas().then((res) => setEstadisticas(res));

    return () => abortController.abort();
  }, []);

  const joinVideoCall = (citaId: number) => {
    window.open(`/videocall/${citaId}`, "_blank");
  };

  const handleReagendar = (cita: Cita) => {
    sessionStorage.setItem("miCita", JSON.stringify(cita));
    router.push("/paciente/citas/detalleCita");
  };

  const toggleExpandCita = (id: number) => {
    setExpandedCitas((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleExpandPago = (id: string) => {
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
                  Próximas Citas Sin Pagar
                </p>
                <p className="text-2xl font-bold">
                  {Number.isNaN(+estadisticas["Sin pagar"])
                    ? 0
                    : estadisticas["Sin pagar"]}
                </p>
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
                  {Number.isNaN(+estadisticas.Pendiente)
                    ? 0
                    : estadisticas.Pendiente}
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
                  Citas culminadas
                </p>
                <p className="text-2xl font-bold">
                  {Number.isNaN(+estadisticas.Realizada)
                    ? 0
                    : estadisticas.Realizada}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* -------------------- SECCIÓN: Citas -------------------- */}
        {!!citasDisponibles && citasDisponibles.length > 0 && (
          <section>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4 mt-7">
              <div className="flex gap-3 items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Calendar className="w-5 h-5 text-yellow-800 dark:text-yellow-600" />
                </div>
                <h2 className="text-xl font-bold">
                  Tus próximas citas disponibles
                </h2>
              </div>

              <Link href="/paciente/citas" className="sm:w-scv10">
                <button className=" flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 px-4 py-2">
                  Más citas
                  <ChevronRight strokeWidth={4} />
                </button>
              </Link>
            </div>

            <div className="space-y-3">
              {citasDisponibles?.map((cita) => (
                <Card key={cita.idCita} className="overflow-hidden">
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
                          {cita.apellidoPsicologo +
                            " " +
                            cita.apellidoPsicologo}
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
                          onClick={() => joinVideoCall(cita.jitsi_url)}
                          disabled={cita.estado_Cita !== "Pendiente"}
                        >
                          <Video className="w-4 h-4 mr-2" />
                          {cita.estado_Cita === "Pendiente"
                            ? "Ingresar a videollamada"
                            : "Cita pendiente"}
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </section>
        )}
        <Separator className="my-6" />

        <section>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4 mt-7">
            <div className="flex gap-3 items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Calendar className="w-5 h-5 text-red-800 dark:text-red-600" />
              </div>
              <h2 className="text-xl font-bold">
                Tus próximas citas sin pagar
              </h2>
            </div>

            <Link href="/paciente/citas" className="sm:w-scv10">
              <button className=" flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 px-4 py-2">
                Más citas
                <ChevronRight strokeWidth={4} />
              </button>
            </Link>
          </div>
          {citasSinPagar && citasSinPagar.length > 0 ? (
            <div className="space-y-3">
              {citasSinPagar?.map((cita) => (
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
                          {cita.apellidoPsicologo +
                            " " +
                            cita.apellidoPsicologo}
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

                      <div className="flex flex-col gap-2">
                        <Button
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
          ) : (
            <NoDataBox info="Usted no tiene citas pendientes a pagar" />
          )}
        </section>

        <Separator className="my-6" />

        {/* -------------------- SECCIÓN: Historial de pagos -------------------- */}
        <section>
          {/* Encabezado de sección */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <History className="w-5 h-5 text-green-800 dark:text-green-600" />
            </div>
            <h2 className="text-xl font-bold">Ùltimos pagos subidos</h2>
          </div>
          {bouchersPaciente && bouchersPaciente.length > 0 ? (
            <div className="space-y-3">
              {bouchersPaciente.map((pago) => (
                <Card key={pago.codigo}>
                  {/* Cabecera clickable del pago */}
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    onClick={() => toggleExpandPago(pago.codigo)}
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
                        <div>
                          <h3 className="font-medium">{pago.codigo}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Subido el: {pago.created_at}
                          </p>
                        </div>
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
                      {expandedPagos.includes(pago.codigo) ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </div>

                  {/* Contenido expandido del pago */}
                  {expandedPagos.includes(pago.codigo) && (
                    <CardContent className="p-4 pt-0 space-y-4">
                      <div className="relative w-full h-40 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                        <Image
                          src={pago.imagen}
                          alt={`Comprobante de pago - ${pago.codigo}`}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(pago.imagen, "_blank")}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Ver
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const link = document.createElement("a"); // Crea un elemento <a>
                              link.href = pago.imagen; // Asigna el origen del archivo
                              link.download = `comprobante-${
                                pago.codigo
                              }.${pago.imagen.split(".").pop()}`; // Sugiere nombre de descarga
                              link.click(); // Dispara la descarga
                            }}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Descargar
                          </Button>
                        </div>

                        <button
                          onClick={() =>
                            handleReagendar({
                              ...citaDummy,
                              idCita: parseInt(pago.idCita),
                            })
                          }
                          className="sm:w-scv10 flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 px-4 py-2"
                        >
                          Ver màs
                          <ChevronRight strokeWidth={4} />
                        </button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <NoDataBox info="Usted no ha subido bouchers de pago" />
          )}
        </section>
      </div>
    </div>
  );
};

export default Paciente;
