"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardFooter } from "@/components/ui/card";
import ReactCountryFlag from "react-country-flag";
import { Modal, ModalContent, ModalBody, Button } from "@heroui/react";
import { PrePaciente, PsicologoPreviewData } from "@/interface";
import React, { useState, useEffect } from "react";
import HorarioPsicologo from "./horariosPsicologo/horarioPsicologo";
import Image from "next/image";
import { User } from "lucide-react";
import { countryPrefixes } from "@/utils/CountryPrefixes";
import Script from "next/script";
import { useServiceFilter } from "@/hooks/useServiceFilter";

// Mapeo de título visible -> valor backend
const tituloToBackendMap: Record<string, string> = {
  "Pediatra": "niños",
  "Pedagogo": "adolescentes",
  "Psicoanalista": "familiar",
  "Terapeuta": "pareja",
  "Conductual": "adulto",
};


// Función para obtener el nombre del país a partir del código
const getNombrePais = (codigoPais: string): string => {
  const paises: Record<string, string> = {
    "MX": "Bandera de México",
    "AR": "Bandera de Argentina",
    "CO": "Bandera de Colombia",
    "PE": "Bandera de Perú",
    "CL": "Bandera de Chile",
    "EC": "Bandera de Ecuador"
  };

  return paises[codigoPais] || "Bandera del país del psicólogo";
};

export default function ReservarPsiPreview({
  psicologo,
}: {
  psicologo: PsicologoPreviewData;
}) {

  // Obtener información del servicio para el precio dinámico
  const serviceInfo = useServiceFilter();

  // Estados para seleccionar el monto a pagar por la consulta
  const [isAmountOpen, setIsAmountOpen] = useState(false);
  // Estados para seleccionar el método de pago (Culqi: tarjeta, Yape o Plin)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  // Monto seleccionado para el pago de la consulta (en soles)
  const [monto, setMonto] = useState(50);
  // ====== ESTADOS PARA QR CULQI ======
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [chargeId, setChargeId] = useState<string | null>(null);
  const [isQrOpen, setIsQrOpen] = useState(false);


  // ✅ Define estas constantes
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/";
  const CULQI_PUBLIC_KEY = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY || "pk_test_EViBHEbdc08k7dQc";

  // Efecto para actualizar el monto según el servicio
  useEffect(() => {
    if (serviceInfo?.precio) {
      setMonto(serviceInfo.precio);
    }
  }, [serviceInfo]);

  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [horaSeleccionada, setHoraSeleccionada] = useState("");
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  // Estados para los campos del formulario
  const [prefix, setPrefix] = useState(countryPrefixes[0].code);
  const [error, setError] = useState<string | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<PrePaciente>({
    nombre: "",
    celular: "",
    correo: "",
    fecha_cita: "",
    hora_cita: "",
    idPsicologo: psicologo.idPsicologo,
    enfoque: psicologo.titulo
  });

  const handleSelectHorario = (hora: string, fecha: string) => {
    setHoraSeleccionada(hora);
    setFechaSeleccionada(fecha);

    setFormData((prevData) => ({
      ...prevData,
      fecha,
      hora,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formDataEntries = new FormData(e.currentTarget);
    const data = Object.fromEntries(formDataEntries) as unknown as PrePaciente;

    data.fecha_cita = fechaSeleccionada;
    data.hora_cita = horaSeleccionada;
    data.idPsicologo = psicologo.idPsicologo;
    data.enfoque = tituloToBackendMap[psicologo.titulo] || psicologo.titulo;

    if (!data.nombre || !data.celular || !data.correo) {
      setError("Por favor, completa todos los campos del formulario.");
      setLoading(false);
      return;
    }

    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoRegex.test(data.correo)) {
      setError("Por favor, ingresa un correo electrónico válido.");
      setLoading(false);
      return;
    }

    if (data.celular) {
      const cleanNumber = data.celular.replace(/\D/g, "");
      data.celular = `${prefix} ${cleanNumber}`;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/pre-pacientes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result: { message?: string } = await response.json();
      if (!response.ok) {
        setError(result.message || "Error al enviar el formulario");
        setLoading(false);
        return;
      }

      // Continuar con el flujo
      setFormData({
        nombre: "",
        celular: "",
        correo: "",
        fecha_cita: "",
        hora_cita: "",
        idPsicologo: psicologo.idPsicologo,
        enfoque: psicologo.titulo
      });
      setIsConfirmOpen(false);

      //construimos nuestro propio parametros para api/send-message
      const parametros = {
        phone: data.celular,
        templateOption: 'cita_gratis',
        psicologo: `${psicologo.nombre} ${psicologo.apellido}`,
        fecha: data.fecha_cita,
        hora: data.hora_cita
      }

      // llamamos a la api de whatsapp para enviarle el mensaje
      /*  const resp = await fetch(
         `${process.env.NEXT_PUBLIC_WHATS_BACK}api/send-messageNHL`,
         {
           method: "POST",
           headers: {
             "Content-Type": "application/json",
             Accept: "application/json",
           },
           body: JSON.stringify(parametros),
         }
       ); */

      /*       const resultadoWhats = await resp.json(); */

      /*   if (resultadoWhats.success) {
          alert('Se envió mensaje de WhatsApp tambien. Si llego hasta aqui debe de haber llegado el mensaje realmente, caso contrario, debugear para saber porque no.');
        } */

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "No se pudo enviar el formulario.");
      } else {
        setError("No se pudo enviar el formulario.");
      }
    } finally {
      setLoading(false);
    }
  };
  // ======= CALBACK GLOBAL DE CUlQI =======
  useEffect(() => {

    // @ts-ignore
    window.culqi = async function () {
      // @ts-ignore
      if (window.Culqi.token) {
        console.log("✅ Token recibido:", window.Culqi.token);
        console.log("📧 Email:", formData.correo);
        console.log("💰 Monto:", monto * 100);
        console.log("🌐 API URL:", process.env.NEXT_PUBLIC_API_URL);

        try {
          const url = `${process.env.NEXT_PUBLIC_API_URL}api/pagos/culqi/cargo`;
          console.log("📍 URL completa:", url); // 🔥 Ver la URL exacta

          const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token: window.Culqi.token.id,
              amount: monto * 100,
              email: formData.correo,
            }),
          });

          console.log("📡 Response status:", response.status); // 🔥 Ver el código HTTP

          const result = await response.json();
          console.log("📦 Respuesta del servidor:", result);

          if (!result.success) {
            alert(`Error: ${result.message}`);
            return;
          }

          // CIERRE DE LOS MODALS
          setIsAmountOpen(false);
          setIsPaymentOpen(false);
          setIsConfirmOpen(false);
          setIsSuccessOpen(true);

        } catch (e) {
          console.error("❌ Error completo:", e);
          alert(`Error procesando el pago: ${e instanceof Error ? e.message : 'Error desconocido'}`);
        }
      } else {
        // @ts-ignore
        console.error("❌ Error de Culqi:", window.Culqi.error);
        // @ts-ignore
        alert(window.Culqi.error.user_message);
      }
    };
  }, [monto, formData.correo]);


  return (
    <>

      <Script
        src="https://checkout.culqi.com/js/v4"
        strategy="afterInteractive"
      />




      <Card className="flex h-full flex-col group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 min-h-[320px]">
        {/* Gradiente de fondo sutil */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-white to-indigo-50/30 dark:from-gray-800/50 dark:via-gray-800 dark:to-gray-700/30"></div>

        {/* Elemento decorativo animado */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-full opacity-20 transform translate-x-16 -translate-y-16 group-hover:scale-110 transition-transform duration-700"></div>

        <div className="relative z-10 p-6 min-h-0 flex-1 flex flex-col justify-between">
          {/* Header con avatar y info básica */}
          <div>
            <div className="flex items-start gap-4 mb-4">
              <div className="relative">
                <Avatar className="w-20 h-20 ring-4 ring-white dark:ring-gray-600 shadow-lg">
                  <AvatarImage
                    src={psicologo.imagen}
                    className="object-cover"
                  />{" "}
                  <AvatarFallback className="bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-800 dark:to-indigo-800">
                    <User className="w-10 h-10 text-purple-600 dark:text-purple-300" />
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full overflow-hidden border-2 border-white dark:border-gray-600 shadow-md">
                  <ReactCountryFlag
                    svg
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    countryCode={psicologo.pais}
                    alt={getNombrePais(psicologo.pais)}
                    title={getNombrePais(psicologo.pais)}
                    aria-label={getNombrePais(psicologo.pais)}
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="mb-1">
                  <span className="inline-block px-3 py-1 text-xs font-medium text-purple-600 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                    {psicologo.titulo}
                  </span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">
                  Dr. {psicologo.nombre} {psicologo.apellido}
                </span>
              </div>
            </div>
            {/* Línea divisoria con gradiente */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-600 to-transparent mb-4"></div>
            {/* Descripción */}
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 line-clamp-3 md:h-[67px]">
              {psicologo.introduccion ? `${psicologo.introduccion.slice(0, 120)}...` : "Sin descripción disponible"}
            </p>
            {/* Especialidades */}
          </div>
          <div>
            <div className="mb-2">
              <div className="flex overflow-x-auto gap-2 pb-2">
                {(psicologo.especialidades || []).slice(0, 3).map((especialidad, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 flex-shrink-0 text-xs font-medium text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 rounded-full border border-indigo-100 dark:border-indigo-700"
                  >
                    {especialidad}
                  </span>
                ))}
                {psicologo.especialidades && psicologo.especialidades.length > 3 && (
                  <span className="px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full">
                    +{psicologo.especialidades.length - 3}
                  </span>
                )}
              </div>
            </div>
            {/* Botones de acción */}
            <CardFooter className="flex gap-3 p-0 mt-auto">
              <Button
                onPress={() => setIsScheduleOpen(true)}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Agendar
              </Button>{" "}
              <Button
                onPress={() => setIsProfileOpen(true)}
                className="flex-1 bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-300 font-semibold py-3 rounded-xl border-2 border-purple-200 dark:border-purple-600 hover:border-purple-300 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Ver perfil
              </Button>
            </CardFooter>
          </div>
        </div>
      </Card>
      {/*modal de profile */}
      <Modal
        isOpen={isProfileOpen}
        onOpenChange={setIsProfileOpen}
        size={"4xl"}
        backdrop="opaque"
        classNames={{
          body: "py-6",
          backdrop: "bg-[#d8dceb]/50 dark:bg-black/60 backdrop-blur-sm",
          base: "border-[#d8dceb] bg-white dark:bg-gray-900 text-[#a8b0d3]",
          header: "border-b-[1px] border-[#d8dceb]",
          footer: "border-t-[1px] border-[#d8dceb]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent className="max-w-[90vw] md:w-[695px] h-auto md:h-[416px] bg-background rounded-3xl overflow-hidden my-4 md:mt-8">
          <div className="grid grid-cols-1 md:grid-cols-[0.8fr_1.6fr] items-start md:items-center gap-4 md:gap-0">
            {/* Sección de Avatar */}
            <div className="w-full flex justify-center md:justify-start md:h-full">
              <Avatar className="w-full max-w-[250px] h-[250px] md:w-[208px] md:h-[416px] rounded-2xl overflow-hidden shadow-lg">
                <AvatarImage
                  src={psicologo.imagen}
                  className="w-full h-full object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-800 dark:to-indigo-800 w-full h-full flex items-center justify-center">
                  <User className="w-24 h-24 text-purple-600 dark:text-purple-300" />
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Sección de Información */}
            <div className="px-4 md:px-6 text-[#634AE2]">
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold text-[#634AE2] dark:text-purple-400">
                  {psicologo.nombre} {psicologo.apellido}
                </h2>
                <hr className="border-t border-[#9494F3] w-full md:w-64" />
              </div>

              <ModalBody className="py-2 px-0 space-y-4">
                {/* Especialidades */}
                <div>
                  <p className="text-[#634AE2] dark:text-purple-300 font-semibold text-base mb-2">
                    Especialidades:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(psicologo.especialidades || []).map((item, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[#E7E7FF] dark:bg-purple-900/30 text-[#634AE2] dark:text-purple-300 rounded-full text-xs md:text-sm font-medium shadow-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <hr className="border-t border-[#9494F3]/50 w-full" />

                {/* Introducción */}
                <div>
                  <p className="text-[#634AE2] dark:text-purple-200 text-sm md:text-base leading-relaxed">
                    {psicologo.introduccion}
                  </p>
                </div>
              </ModalBody>
            </div>
          </div>
        </ModalContent>
      </Modal>
      {/* Horarios */}
      <Modal
        isOpen={isScheduleOpen}
        onOpenChange={setIsScheduleOpen}
        size={"5xl"}
        backdrop="opaque"
        classNames={{
          body: "py-6",
          backdrop: "bg-[#d8dceb]/50 dark:bg-black/60 backdrop-blur-sm",
          base: "border-[#d8dceb] bg-white dark:bg-gray-900 text-[#a8b0d3]",
          header: "border-b-[1px] border-[#d8dceb]",
          footer: "border-t-[1px] border-[#d8dceb]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent>
          <ModalBody>
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-[#634AE2] text-2xl font-bold">
                Agendar cita
              </h1>
              <HorarioPsicologo
                idPsicologo={psicologo.idPsicologo}
                horario={psicologo.horario}
                onClose={() => setIsScheduleOpen(false)}
                onOpenConfirm={() => setIsConfirmOpen(true)}
                onSelectHorario={handleSelectHorario}
              />
              <div className="w-full flex justify-center">
                <Button
                  onPress={() => setIsScheduleOpen(false)}
                  className="rounded-3xl px-6 sm:px-8 py-1 sm:py-0 transition-colors duration-200 font-bold
                              bg-[#E7E7FF] text-[#634AE2] hover:bg-[#3d1fd1] hover:text-white
                              dark:bg-[#2A2A38] dark:text-[#634AE2] dark:hover:bg-[#634AE2] dark:hover:text-[#111827] "
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      {/* Modal de confirmación */}
      <Modal
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        size={"2xl"}
        backdrop="opaque"
        classNames={{
          body: "py-6",
          backdrop: "bg-[#d8dceb]/50 dark:bg-black/60 backdrop-blur-sm",
          base: "bg-[#F5F5FF] dark:bg-[#1E1E2F] text-[#634AE2] dark:text-[#ffffff]",
        }}
      >
        <ModalContent>
          <ModalBody>
            <h2 className="text-xl font-bold text-center text-[#634AE2]">
              ¡Bríndanos tus datos para agendar la cita!
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-[#634AE2] text-sm mb-1">
                  Nombres y apellidos
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-full px-4 py-2 outline-none focus:border-[#634AE2]"
                  placeholder="Nombres y apellidos"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-[#634AE2] text-sm mb-1">
                  Número de celular
                </label>
                <div className="flex">
                  <select
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    className="rounded-l-full border border-gray-300 px-2 py-2  focus:border-[#634AE2] outline-none"
                    style={{ minWidth: 80 }}
                  >
                    {countryPrefixes.map((prefix, index) => (
                      <option key={index} value={prefix.code}>
                        {prefix.name} ({prefix.code})
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-r-full px-4 py-2 outline-none focus:border-[#634AE2]"
                    placeholder="Número de celular"
                    name="celular"
                    value={formData.celular}
                    onChange={handleChange}
                    style={{ borderLeft: "none" }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[#634AE2] text-sm mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-full px-4 py-2 outline-none focus:border-[#634AE2]"
                  placeholder="Correo electrónico"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                />
              </div>
              <p className="text-sm text-center text-[#634AE2] mt-2">
                Has seleccionado: <strong>{fechaSeleccionada}</strong> a las{" "}
                <strong>{horaSeleccionada}</strong>
              </p>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex justify-center mt-6">
                <Button
                  type="button"
                  onPress={() => setIsAmountOpen(true)}
                  className="rounded-3xl bg-[#634AE2] text-white px-6 py-1 font-light"
                  disabled={loading}
                >
                  {loading ? "Procesando..." : "Pagar"}
                </Button>

              </div>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>


      {/* Modal de selección de monto */}
      <Modal
        isOpen={isAmountOpen}
        onOpenChange={setIsAmountOpen}
        size="md"
        backdrop="opaque"
        classNames={{
          body: "py-6",
          backdrop: "bg-[#d8dceb]/50 dark:bg-black/60 backdrop-blur-sm",
          base: "bg-[#F5F5FF] dark:bg-[#1E1E2F] text-[#634AE2]",
        }}
      >
        <ModalContent>
          <ModalBody className="text-center space-y-4">
            <h2 className="text-xl font-bold">
              Selecciona el monto de la consulta
            </h2>

            <div className="flex justify-center gap-4">
              {/* Monto del servicio actual */}
              <Button
                onPress={() => setMonto(serviceInfo?.precio || 80)}
                className={`rounded-3xl px-6 py-2 ${monto === (serviceInfo?.precio || 80)
                  ? "bg-[#634AE2] text-white"
                  : "bg-[#E7E7FF] text-[#634AE2]"
                  }`}
              >
                S/ {serviceInfo?.precio || 80}
                {serviceInfo && (
                  <span className="ml-2 text-xs opacity-75">
                    ({serviceInfo.displayName})
                  </span>
                )}
              </Button>

              {/* Monto estándar para consultas generales */}
              <Button
                onPress={() => setMonto(80)}
                className={`rounded-3xl px-6 py-2 ${monto === 80
                  ? "bg-[#634AE2] text-white"
                  : "bg-[#E7E7FF] text-[#634AE2]"
                  }`}
              >
                S/ 80
                <span className="ml-2 text-xs opacity-75">
                  (Consulta general)
                </span>
              </Button>
            </div>

            <Button
              onPress={() => {
                setIsAmountOpen(false);
                setIsPaymentOpen(true);
              }}
              className="rounded-3xl bg-[#634AE2] text-white px-8 py-2"
            >
              Continuar pago
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Modal de método de pago */}
      <Modal
        isOpen={isPaymentOpen}
        onOpenChange={setIsPaymentOpen}
        size="md"
        backdrop="opaque"
        classNames={{
          body: "py-6",
          backdrop: "bg-[#d8dceb]/50 dark:bg-black/60 backdrop-blur-sm",
          base: "bg-[#F5F5FF] dark:bg-[#1E1E2F] text-[#634AE2]",
        }}
      >
        <ModalContent>
          <ModalBody className="space-y-6 text-center">

            <h2 className="text-xl font-bold text-[#634AE2]">
              Selecciona un método de pago
            </h2>

            {/* ===== BOTÓN TARJETA (CULQI CHECKOUT) ===== */}
            <Button
              className="w-full rounded-2xl bg-[#634AE2] text-white py-3 font-medium"
              onPress={() => {
                setIsPaymentOpen(false);
                setIsConfirmOpen(false);
                setIsAmountOpen(false);

                setTimeout(() => {
                  // @ts-ignore
                  window.Culqi.publicKey =
                    process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY!;
                  // @ts-ignore
                  window.Culqi.settings({
                    title: "Contigo Voy",
                    currency: "PEN",
                    amount: monto * 100,
                  });
                  // @ts-ignore
                  window.Culqi.open();
                }, 300);
              }}
            >
              💳 Pagar con tarjeta
            </Button>

            {/* ===== BOTÓN YAPE / PLIN (QR BACKEND) ===== */}
            <Button
              className="w-full rounded-2xl bg-gradient-to-r from-[#95D5B2] to-[#00A86B] text-white py-3 font-medium hover:from-[#7BA742] hover:to-[#008C5A]"
              onPress={async () => {
                try {
                  setIsPaymentOpen(false);
                  setIsConfirmOpen(false);
                  setIsAmountOpen(false);

                  // Usa la constante API_URL definida al inicio del archivo
                  const url = `${API_URL}api/pagos/culqi/qr`;
                  console.log("🔍 URL completa:", url);
                  console.log("💰 Monto:", monto * 100);

                  const res = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      amount: monto * 100,
                      description: "Pago Contigo Voy",
                    }),
                  });

                  console.log("📊 Status:", res.status);

                  if (!res.ok) {
                    const errorText = await res.text();
                    console.error("❌ Error backend:", errorText);
                    alert(`Error al generar QR: ${res.status}`);
                    return;
                  }

                  const data = await res.json();
                  console.log("✅ Respuesta completa:", data);
                  console.log("✅ QR recibido:", data.qr);
                  console.log("✅ Charge ID:", data.chargeId);

                  setQrImage(data.qr);
                  setChargeId(data.chargeId);
                  setIsQrOpen(true);
                } catch (error) {
                  console.error("❌ Error de red:", error);
                  alert("Error de conexión. Verifica que el servidor Laravel esté corriendo.");
                }
              }}
            >
              📱 Pagar con Yape / Plin
            </Button>

            <p className="text-sm text-[#634AE2]/80">
              Monto a pagar: <strong>S/ {monto}</strong>
            </p>

          </ModalBody>
        </ModalContent>

      </Modal >


      <Modal
        isOpen={isSuccessOpen}
        onOpenChange={setIsSuccessOpen}
        size={"2xl"}
        backdrop="opaque"
        classNames={{
          body: "py-6",
          backdrop: "bg-[#d8dceb]/50 dark:bg-black/60 backdrop-blur-sm",
          base: "bg-[#F5F5FF] dark:bg-[#1E1E2F] text-[#634AE2] dark:text-[#ffffff]",
          header: "border-b-[1px] border-[#d8dceb]",
          footer: "border-t-[1px] border-[#d8dceb]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent>
          <ModalBody className="text-center">
            <Image
              src="/send-mail.svg"
              alt="Icono de correo enviado"
              width={128}
              height={128}
              className="mx-auto mb-4"
            />
            <h2 className="text-2xl font-semibold mb-4">
              ¡LISTO! Tu cita ha sido reservada
            </h2>
            <p className="mb-6">
              En unos minutos te enviaremos un correo de confirmación.
            </p>
            <div className="flex justify-center mb-4"></div>
            <Button
              onPress={() => setIsSuccessOpen(false)}
              className="inline-block rounded-3xl bg-[#E7E7FF] px-6 sm:px-8 py-1 sm:py-0 text-[#634AE2] font-light"
            >
              Cerrar
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}