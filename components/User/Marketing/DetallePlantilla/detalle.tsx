"use client";

import React, { useEffect, useState } from "react";
import CerrarSesion from "@/components/CerrarSesion";
import { ArrowLeft, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";

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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const defaultStyles = { bold: false, italic: false, color: "#000000" };

  const formatearBloquesParaEnvio = () => {
    return emailBlocks.map((block) => {
      if (block.type === "divider") {
        return { type: "divider", styles: defaultStyles };
      }

      if (block.type === "image") {
        return {
          type: "image",
          imageUrl: block.imageUrl,
          styles: {
            ...defaultStyles,
            ...(block.styles || {}),
          },
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
            bold: block.styles?.bold ?? false,
            italic: block.styles?.italic ?? false,
            color: block.styles?.color ?? "#000000",
          },
        };
      }

      return block;
    });
  };

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) setSender(storedEmail);

    const storedBlocks = localStorage.getItem("emailBlocks");
    if (storedBlocks) setEmailBlocks(JSON.parse(storedBlocks));

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

    const bloquesParaEnviar = formatearBloquesParaEnvio();

    // 1. Enviar email
    try {
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
      }

      const responseGuardado = await fetch(`${apiUrl}api/marketing/`, {
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
          fecha: new Date().toISOString(),
          estado: "enviada", //opcional
        }),
      });

      const dataGuardado = await responseGuardado.json();

      if (!responseGuardado.ok) {
        console.error("❌ Error al guardar como enviada:", dataGuardado);
        alert("El correo fue enviado, pero hubo un error al guardar la plantilla.");
        return;
      }

      alert("Correo enviado y plantilla guardada correctamente.");
      router.push("/user/marketing/crear/plantillasGuardadas");

    } catch (error) {
      console.error("❌ Error general:", error);
      alert("Error al conectar con el servidor.");
    }
  };





  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Navbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Email marketing</h1>
        <CerrarSesion />
      </div>

      {/* Título */}
      <div className="flex items-center gap-3 px-6 py-6 max-w-6xl mx-auto">
        <ArrowLeft
          className="w-6 h-6 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-gray-800 dark:hover:text-gray-100"
          onClick={() => router.push("/user/marketing/crear")}
        />
        <h2 className="text-3xl font-bold text-purple-400">Configuración de la campaña</h2>
      </div>

      {/* Botones */}
      <div className="bg-primary text-white dark:bg-purple-700 px-6 py-4">
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={handleSend}
            className="flex items-center space-x-2 bg-primary dark:bg-purple-600 hover:bg-primary/80 dark:hover:bg-purple-700 px-4 py-2 rounded transition-colors"
          >
            <Send className="h-4 w-4" />
            <span>Enviar e-mail</span>
          </button>
        </div>
      </div>


      {/* Contenido */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-6 pb-10">
        <section className="lg:col-span-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-300 dark:border-gray-700">
          {/* Nombre de campaña */}
          <div>
            <label className="block text-lg font-medium mb-3 text-purple-600">
              Nombre de la campaña <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="w-full p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white"
            />
          </div>

          {/* Asunto */}
          <div className="mt-6">
            <label className="block text-lg font-medium mb-3 text-purple-600">
              Asunto del email <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              className="w-full p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white"
            />
          </div>

          {/* Destinatarios */}
          <div className="mt-6">
            <label className="block text-lg font-medium mb-3 text-purple-600">
              Destinatarios <span className="text-red-500">*</span>
            </label>
            <select
              multiple
              value={recipients}
              onChange={(e) => setRecipients([...e.target.selectedOptions].map(o => o.value))}
              className="w-full p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white"
            >
              {Array.isArray(pacientes) && pacientes.length > 0 ? (
                pacientes.map((paciente, index) => (
                  <option key={paciente.id ?? index} value={paciente.email}>
                    {paciente.nombre} {paciente.apellido} - {paciente.email}
                  </option>
                ))
              ) : (
                <option disabled>No hay pacientes disponibles</option>
              )}
            </select>
          </div>
        </section>

        {/* Vista previa */}
        <aside className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-300 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-purple-600 mb-4">Vista previa</h3>
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg min-h-[200px] border border-dashed border-gray-400 dark:border-gray-600">
            {emailBlocks.length > 0 ? (
              emailBlocks.map((block, idx) => (
                <div key={idx} className="mb-4">
                  {block.type === "divider" && <hr />}
                  {block.type === "image" && block.imageUrl && (
                    <img src={block.imageUrl} alt="Imagen" className="rounded-lg w-full max-h-40 object-cover" />
                  )}
                  {block.type === "columns" && (
                    <div className="grid grid-cols-2 gap-2">
                      {block.imageUrls.map((url, columnIdx) => (
                        url && (
                          <img key={columnIdx} src={url} alt={`Imagen columna ${columnIdx + 1}`} className="rounded-lg w-full max-h-32 object-cover" />
                        )
                      ))}
                    </div>
                  )}
                  {(block.type === "header" || block.type === "text") && (
                    <p
                      className={`${block.type === "header" ? "text-xl font-bold text-black dark:text-white" : "text-sm text-black dark:text-white"}`}
                      style={
                        block.styles?.color
                          ? {
                            fontWeight: block.styles?.bold ? "bold" : "normal",
                            fontStyle: block.styles?.italic ? "italic" : "normal",
                          }
                          : {
                            fontWeight: block.styles?.bold ? "bold" : "normal",
                            fontStyle: block.styles?.italic ? "italic" : "normal",
                          }
                      }
                    >
                      {block.content}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Este es un nuevo bloque de texto.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DetalleCampania;
