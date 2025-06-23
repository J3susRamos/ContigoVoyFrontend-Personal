"use client";

import React, { useEffect, useState } from "react";
import CerrarSesion from "@/components/CerrarSesion";
import { ArrowLeft, Send} from "lucide-react";
import { useRouter } from "next/navigation";

type EmailBlock =
  | { type: "divider" }
  | { type: "image"; imageUrl: string }
  | {
      type: "header" | "text";
      content: string;
      styles?: { color?: string; bold?: boolean; italic?: boolean };
    };

const DetalleCampania = () => {
  const router = useRouter();
  const [emailBlocks, setEmailBlocks] = useState<EmailBlock[]>([]);
  const [campaignName, setCampaignName] = useState("Campaña sin título");
  const [emailSubject, setEmailSubject] = useState("Asunto sin definir");
  const [sender] = useState("manuel@gmail.com");
  const [recipients] = useState("Pacientes con citas pendientes");

  useEffect(() => {
    const stored = localStorage.getItem("emailBlocks");
    if (stored) setEmailBlocks(JSON.parse(stored));
  }, []);

  const handleSend = () => {
    if (!campaignName || !emailSubject) {
      alert("Completa los campos obligatorios.");
      return;
    }

    const nuevaPlantilla = {
      id: Date.now(),
      nombre: campaignName,
      asunto: emailSubject,
      remitente: sender,
      destinatarios: recipients,
      bloques: emailBlocks,
      fecha: new Date().toLocaleString(),
    };

    const almacenadas = JSON.parse(localStorage.getItem("plantillas") || "[]");
    almacenadas.push(nuevaPlantilla);
    localStorage.setItem("plantillas", JSON.stringify(almacenadas));

    alert("Campaña enviada correctamente.");
    router.push("/user/marketing");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Navbar superior */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Email marketing
        </h1>
        <CerrarSesion />
      </div>

      {/* Título principal */}
      <div className="flex items-center gap-3 px-6 py-6 max-w-6xl mx-auto">
        <ArrowLeft
          className="w-6 h-6 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-gray-800 dark:hover:text-gray-100"
          onClick={() => router.push("/user/marketing/crear")}
        />
        <h2 className="text-3xl font-bold text-purple-400">
          Configuración de la campaña
        </h2>
      </div>

      {/* Botón de prueba */}
      <div className="bg-primary text-white dark:bg-purple-700 px-6 py-4">
        <div className="flex justify-center items-center">
          <button
            onClick={handleSend}
            className="flex items-center space-x-2 bg-primary dark:bg-purple-600 hover:bg-primary/80 dark:hover:bg-purple-700 px-4 py-2 rounded transition-colors"
          >
            <Send className="h-4 w-4" />
            <span>Enviar e-mail de prueba</span>
          </button>
        </div>
      </div>

      {/* Contenido */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-6 pb-10">
        <section className="lg:col-span-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-300 dark:border-gray-700">
          {/* ...campos de campaña y remitente... */}
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

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Remitente
            </label>
            <input
              type="email"
              value={sender}
              readOnly
              className="w-full p-3 bg-gray-200 dark:bg-gray-600 rounded-lg text-gray-600 dark:text-gray-300"
            />
          </div>
        </section>

        {/* Vista previa */}
        <aside className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-300 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-purple-600 mb-4">Vista previa</h3>
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg min-h-[200px] border border-dashed border-gray-400 dark:border-gray-600">
            {emailBlocks.length ? (
              emailBlocks.map((block, idx) => (
                <div key={idx} className="mb-4">
                  {block.type === "divider" && <hr />}
                  {block.type === "image" && (
                    <img
                      src={block.imageUrl}
                      alt="Imagen"
                      className="rounded-lg w-full max-h-40 object-cover"
                    />
                  )}
                  {block.type !== "divider" && block.type !== "image" && (
                    <p
                      className={`${
                        block.type === "header" ? "text-xl font-bold" : "text-sm"
                      }`}
                      style={{
                        color: block.styles?.color ?? "#000",
                        fontWeight: block.styles?.bold ? "bold" : "normal",
                        fontStyle: block.styles?.italic ? "italic" : "normal",
                      }}
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
