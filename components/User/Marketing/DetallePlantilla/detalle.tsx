"use client";

import React, { useEffect, useState } from "react";
import CerrarSesion from "@/components/CerrarSesion";
import { ArrowLeft, Send, Cloud, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import Image from "next/image";
import {
  processEmailBlocks,
  isBase64Image
} from "@/utils/cloudinaryUtils";
import LoadingSpinner from "../LoadingSpinner";

type EmailBlock =
  | { type: "divider" }
  | { type: "image"; imageUrl: string; styles?: Record<string, unknown> }
  | { type: "columns"; imageUrls: string[]; styles?: Record<string, unknown> }
  | { type: "header" | "text"; content: string; styles?: { color?: string; bold?: boolean; italic?: boolean } };

type Paciente = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
};

const DetalleCampania = () => {
  const router = useRouter();
  const [emailBlocks, setEmailBlocks] = useState<EmailBlock[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [campaignName, setCampaignName] = useState("Campaña sin título");
  const [emailSubject, setEmailSubject] = useState("Asunto sin definir");
  const [sender, setSender] = useState<string>("");
  const [recipients, setRecipients] = useState<string[]>([]);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Función para procesar imágenes antes del envío
  const processImagesBeforeSend = async (blocks: EmailBlock[]): Promise<EmailBlock[]> => {
    setIsProcessingImages(true);
    setUploadProgress({ current: 0, total: 0 });

    try {
      const processedBlocks = await processEmailBlocks(
        blocks,
        'email-marketing',
        (current: number, total: number) => {
          setUploadProgress({ current, total });
        }
      );
      return processedBlocks;
    } catch (error) {
      console.error('Error al procesar imágenes:', error);
      throw error;
    } finally {
      setIsProcessingImages(false);
      setUploadProgress(null);
    }
  };

  const defaultStyles = { bold: false, italic: false, color: "#000000" };
  const formatearBloquesParaEnvio = (blocks: EmailBlock[]) => {
    return blocks.map((block) => {
      if (block.type === "divider") {
        return { type: "divider", styles: defaultStyles };
      }

      if (block.type === "image") {
        return {
          type: "image",
          imageUrl: block.imageUrl,
          styles: defaultStyles,
        };
      }

      if (block.type === "columns") {
        return {
          type: "columns",
          imageUrls: block.imageUrls,
          styles: {
            ...defaultStyles,
            ...(block.styles || {}),
          },
        };
      }

      if (block.type === "header" || block.type === "text") {
        return {
          type: block.type,
          content: block.content,
          styles: {
            bold: block.styles?.bold || false,
            italic: block.styles?.italic || false,
            color: block.styles?.color || "#000000",
          },
        };
      }

      return block;
    });
  };

  // Función para verificar si hay imágenes base64
  const hasBase64Images = (blocks: EmailBlock[]): boolean => {
    return blocks.some(block => {
      if (block.type === 'image' && block.imageUrl) {
        return isBase64Image(block.imageUrl);
      }
      if (block.type === 'columns' && block.imageUrls) {
        return block.imageUrls.some(url => isBase64Image(url));
      }
      return false;
    });
  };

  // Función para contar imágenes base64
  const countBase64Images = (blocks: EmailBlock[]): number => {
    return blocks.reduce((count, block) => {
      if (block.type === 'image' && block.imageUrl && isBase64Image(block.imageUrl)) {
        return count + 1;
      }
      if (block.type === 'columns' && block.imageUrls) {
        return count + block.imageUrls.filter(url => url && isBase64Image(url)).length;
      }
      return count;
    }, 0);
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) setSender(storedEmail);

    const storedPlantilla = localStorage.getItem("emailBlocks");
    if (storedPlantilla) {
      try {
        const parsed = JSON.parse(storedPlantilla);
        if (Array.isArray(parsed.blocks)) {
          setEmailBlocks(parsed.blocks);
        } else {
          setEmailBlocks([]);
        }
      } catch (e) {
        setEmailBlocks([]);
        console.error(e)
      }
    } else {
      setEmailBlocks([]);
    }

    const fetchPacientes = async () => {
      const cookies = parseCookies();
      const token = cookies["session"];
      if (!token) return;

      try {
        const response = await fetch(`${apiUrl}api/pacientes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok && Array.isArray(data.result)) {
          setPacientes(data.result);
        } else {
          console.error("❌ Error en respuesta de pacientes:", data);
          setPacientes([]);
        }
      } catch (error) {
        console.error("❌ Error de red al cargar pacientes:", error);
        setPacientes([]);
      }
    };

    fetchPacientes();
  }, [apiUrl]);

  const handleSend = async () => {
    if (!campaignName || !emailSubject || recipients.length === 0) {
      alert("Completa todos los campos obligatorios y selecciona al menos un destinatario.");
      return;
    }

    const cookies = parseCookies();
    const token = cookies["session"];
    if (!token) {
      alert("No se encontró token de sesión. Por favor vuelve a iniciar sesión.");
      return;
    }

    setIsSending(true);

    try {
      let processedBlocks = emailBlocks;
      if (hasBase64Images(emailBlocks)) {
        processedBlocks = await processImagesBeforeSend(emailBlocks);
      }

      const bloquesParaEnviar = formatearBloquesParaEnvio(processedBlocks);

      const responseEnvio = await fetch(`${apiUrl}api/marketing/enviar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: campaignName,
          asunto: emailSubject,
          remitente: sender,
          destinatarios: recipients,
          bloques: bloquesParaEnviar,
          fecha: new Date().toISOString(),
        }),
      });

      const dataEnvio = await responseEnvio.json();

      if (!responseEnvio.ok) {
        console.error("❌ Error al enviar:", dataEnvio);
        alert(dataEnvio.message || "Error al enviar el correo.");
        return;
      }      console.log("💾 Guardando plantilla con datos:", {
        nombre: campaignName,
        asunto: emailSubject,
        remitente: sender,
        destinatarios: recipients.join(","),
        cantidadBloques: bloquesParaEnviar.length,
        tiposBloques: bloquesParaEnviar.map(b => b.type),
        tokenLength: token.length,
        apiUrl: apiUrl
      });     
      if (!campaignName.trim()) {
        alert("El nombre de la campaña es requerido para guardar la plantilla.");
        return;
      }
      if (!emailSubject.trim()) {
        alert("El asunto del email es requerido para guardar la plantilla.");
        return;
      }
      if (!bloquesParaEnviar || bloquesParaEnviar.length === 0) {
        alert("Debe haber al menos un bloque de contenido para guardar la plantilla.");
        return;
      }


      console.log("🔍 Estructura detallada de bloques:", JSON.stringify(bloquesParaEnviar, null, 2));

      let responseGuardado;
      try {
        responseGuardado = await fetch(`${apiUrl}api/marketing`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nombre: campaignName,
            asunto: emailSubject,
            remitente: sender,
            destinatarios: recipients.join(","),
            bloques: bloquesParaEnviar,
          }),
        });
      } catch (networkError) {
        console.error("❌ Error de red al guardar plantilla:", networkError);
        alert("El correo fue enviado, pero hubo un error de conexión al guardar la plantilla.");
        return;
      }const dataGuardado = await responseGuardado.json().catch(async () => {
     
        const textResponse = await responseGuardado.text();
        console.error("❌ Respuesta no es JSON válido:", textResponse);
        return { error: "Respuesta no válida del servidor", raw: textResponse };
      });

      if (!responseGuardado.ok) {
        console.error("❌ Error al guardar como enviada:", dataGuardado);
        console.error("❌ Status:", responseGuardado.status);
        console.error("❌ Status Text:", responseGuardado.statusText);
        console.error("❌ Response Headers:", Object.fromEntries(responseGuardado.headers.entries()));
        
        let errorMessage = 'Error desconocido';
        if (dataGuardado.message) {
          errorMessage = dataGuardado.message;
        } else if (dataGuardado.raw) {
          errorMessage = `Error del servidor: ${responseGuardado.status}`;
        }
        
        alert(`El correo fue enviado, pero hubo un error al guardar la plantilla: ${errorMessage}`);
        return;
      }

      console.log("✅ Plantilla guardada correctamente:", dataGuardado);

      if (processedBlocks !== emailBlocks) {
        localStorage.setItem("emailBlocks", JSON.stringify({ blocks: processedBlocks }));
        setEmailBlocks(processedBlocks);
      }

      alert("Correo enviado y plantilla guardada correctamente.");
      router.push("/user/marketing/crear/plantillasGuardadas");

    } catch (error) {
      console.error("❌ Error general:", error);
      alert("Error al conectar con el servidor.");
    } finally {
      setIsSending(false);
    }
  };

  const base64ImageCount = countBase64Images(emailBlocks);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Navbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Email marketing</h1>
        <div className="mt-2 sm:mt-0">
          <CerrarSesion />
        </div>
      </div>

      {/* Título */}
      <div className="flex gap-4 text-center py-6 items-center max-w-[600px] pl-4">
        <ArrowLeft
          className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-gray-800 dark:hover:text-gray-100"
          onClick={() => router.back()}
        />
        <h2 className="text-2xl sm:text-3xl font-bold text-purple-400">Configuración de la campaña</h2>
      </div>

      {/* Estado de procesamiento */}
      {(isProcessingImages || isSending) && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 px-4 sm:px-6 py-3 sm:py-4 mb-4 mx-4 sm:mx-6 rounded-lg">
          <LoadingSpinner
            text={
              isProcessingImages
                ? "Subiendo imágenes a Cloudinary..."
                : isSending
                  ? "Enviando correo..."
                  : "Procesando..."
            }
            progress={uploadProgress || undefined}
          />
        </div>
      )}

      {/* Botones */}
      <div className="bg-primary text-white dark:bg-purple-700 px-4 sm:px-6 py-3 sm:py-4 mb-4">
        <div className="flex justify-center items-center gap-3 sm:gap-4">
          <button
            onClick={handleSend}
            disabled={isProcessingImages || isSending}
            className={`flex items-center space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded transition-all duration-300 ${isProcessingImages || isSending
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-[#8338ea] dark:bg-purple-500 hover:scale-110 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 dark:hover:shadow-purple-600/30"
            }`}
          >
            {isSending ? (
              <LoadingSpinner size="sm" text="" />
            ) : (
              <Send className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
            <span className="text-sm sm:text-base">
              {isProcessingImages
                ? "Subiendo imágenes..."
                : isSending
                  ? "Enviando..."
                  : "Enviar e-mail"}
            </span>
          </button>
        </div>
      </div>

      {/* Información sobre imágenes */}
      {hasBase64Images(emailBlocks) && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-700 dark:border-yellow-700 px-4 sm:px-6 py-2 my-6 sm:py-3 mx-4 sm:mx-6 rounded-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-0">
            <div className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200">
              <Cloud className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">
                {base64ImageCount} imagen{base64ImageCount > 1 ? 'es' : ''} local{base64ImageCount > 1 ? 'es' : ''} será{base64ImageCount > 1 ? 'n' : ''} subida{base64ImageCount > 1 ? 's' : ''} a Cloudinary antes del envío.
              </span>
            </div>
            <div className="flex items-center space-x-1 text-yellow-700 dark:text-yellow-300">
              <Upload className="h-2 w-2 sm:h-3 sm:w-3" />
              <span className="text-xxs sm:text-xs">Auto-optimización incluida</span>
            </div>
          </div>
        </div>
      )}

      {/* Contenido */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6 pb-6 sm:pb-10">
        <section className="lg:col-span-2 bg-gray-100 dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 shadow-md sm:shadow-xl border border-gray-300 dark:border-gray-700">
          {/* Nombre de campaña */}
          <div>
            <label className="block text-base sm:text-lg font-medium mb-2 sm:mb-3 text-purple-600">
              Nombre de la campaña <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="w-full p-2 sm:p-3 rounded-md sm:rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white text-sm sm:text-base"
              disabled={isProcessingImages || isSending}
            />
          </div>

          {/* Asunto */}
          <div className="mt-4 sm:mt-6">
            <label className="block text-base sm:text-lg font-medium mb-2 sm:mb-3 text-purple-600">
              Asunto del email <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              className="w-full p-2 sm:p-3 rounded-md sm:rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white text-sm sm:text-base"
              disabled={isProcessingImages || isSending}
            />
          </div>          {/* Destinatarios */}
          <div className="mt-4 sm:mt-6">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
            <label className="text-base sm:text-lg font-medium text-purple-600">
              Destinatarios <span className="text-red-500">*</span>
            </label>

            {/* Botón de seleccionar todos */}
              <button
                type="button"
                onClick={() => {
                const allEmails = pacientes.filter(p => p.email).map(p => p.email);
                const allSelected = allEmails.every(email => recipients.includes(email));
                  if (allSelected) {
                    setRecipients([]);
                  } else {
                    setRecipients(allEmails);
                  }
                }}
                disabled={isProcessingImages || isSending || pacientes.length === 0}
                className="px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {pacientes.filter(p => p.email).every(p => recipients.includes(p.email)) && pacientes.length > 0 
                  ? 'Deseleccionar todos' 
                  : 'Seleccionar todos'}
              </button>
            </div>

            {/* Contador dinámico */}
            <div className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg mb-3">
              <div className="flex items-center gap-1">
                <svg className="h-4 w-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.196-2.121M9 20H4v-2a3 3 0 015.196-2.121m0 0A5.002 5.002 0 0119 16.5M9 17.879A5.002 5.002 0 0115 16.5M9 17.879V16.5A5.002 5.002 0 019 11.5m0 6.379a3 3 0 00-6 0m6 0v-1.5a3 3 0 00-6 0" />
                </svg>
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  {recipients.length} {recipients.length === 1 ? 'destinatario seleccionado' : 'destinatarios seleccionados'}
                </span>
              </div>
            </div>

            {/* Lista de pacientes */}
            <div className="max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
              {Array.isArray(pacientes) && pacientes.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-600">
                  {pacientes.map((paciente, index) => {
                    if (!paciente.email) return null;
                    
                    const isSelected = recipients.includes(paciente.email);
                    const initials = `${(paciente.nombre || '?').charAt(0).toUpperCase()}${(paciente.apellido || '?').charAt(0).toUpperCase()}`;
                    const colors = ['bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'];
                    const avatarColor = colors[initials.charCodeAt(0) % colors.length];

                    return (
                      <div
                        key={paciente.id ?? index}
                        onClick={() => {
                          if (isProcessingImages || isSending) return;
                          if (isSelected) {
                            setRecipients(recipients.filter(r => r !== paciente.email));
                          } else {
                            setRecipients([...recipients, paciente.email]);
                          }
                        }}
                        className={`flex items-center gap-3 p-3 cursor-pointer transition-all duration-200 ${
                          isProcessingImages || isSending ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-50 dark:hover:bg-gray-600'
                        } ${
                          isSelected 
                            ? 'bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500' 
                            : 'bg-white dark:bg-gray-700'
                        }`}
                      >
                        {/* Checkbox personalizado */}
                        <div
                          className={`flex items-center justify-center w-5 h-5 rounded transition-colors ${
                            isSelected
                              ? 'bg-purple-600 text-white'
                              : 'border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                          }`}
                        >
                          {isSelected && (
                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>

                        {/* Avatar con iniciales */}
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-full text-white text-xs font-semibold ${avatarColor}`}
                        >
                          {initials}
                        </div>

                        {/* Información del paciente */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {paciente.nombre ? paciente.nombre : ''}{paciente.apellido ? ` ${paciente.apellido}` : ''}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {paciente.email}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No hay pacientes disponibles
                </div>
              )}
            </div>

            {/* Resumen de envío */}
            {recipients.length > 0 && (
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-300">
                  <span className="font-medium">Resumen:</span> El email se enviará a {recipients.length} destinatario{recipients.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Vista previa del email */}
        <section className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-md sm:shadow-xl border border-gray-300 dark:border-gray-700">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-purple-600">Vista previa del email</h3>
          <div className="space-y-3 sm:space-y-4">
            {emailBlocks.length === 0 ? (
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">No hay contenido para mostrar</p>
            ) : (
              emailBlocks.map((block, index) => {
                switch (block.type) {
                  case "header":
                    return (
                      <h1 key={index} className="text-xl sm:text-2xl font-bold dark:text-white text-black">
                        {block.content}
                      </h1>
                    );
                  case "text":
                    return (
                      <p
                        key={index}
                        className="text-sm sm:text-base dark:text-white text-black"
                        style={{
                          fontWeight: block.styles?.bold ? "bold" : "normal",
                          fontStyle: block.styles?.italic ? "italic" : "normal",
                        }}
                      >
                        {block.content}
                      </p>
                    );
                  case "image":
                    return (
                      <div key={index} className="relative w-full h-40 sm:h-48">
                        <Image
                          src={block.imageUrl}
                          alt="Imagen de campaña"
                          fill
                          className="object-contain"
                        />
                      </div>
                    );
                  case "columns":
                    return (
                      <div key={index} className="grid grid-cols-2 gap-1 sm:gap-2">
                        {block.imageUrls.map((url, imgIndex) => (
                          <div key={imgIndex} className="relative h-24 sm:h-32">
                            <Image
                              src={url}
                              alt={`Imagen columna ${imgIndex + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    );
                  case "divider":
                    return <hr key={index} className="border-t border-gray-300 dark:border-gray-600 my-3 sm:my-4" />;
                  default:
                    return null;
                }
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );

};

export default DetalleCampania;