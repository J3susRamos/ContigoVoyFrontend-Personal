"use client";

import React, { useEffect, useState } from "react";
import CerrarSesion from "@/components/CerrarSesion";
import { ArrowLeft, Mail, Send, Image } from "lucide-react";
import { useRouter } from "next/navigation";

const DetalleCampania = () => {
  const router = useRouter();
  const [emailBlocks, setEmailBlocks] = useState<any[]>([]);
  const [campaignName, setCampaignName] = useState("Campaña sin título");
  const [emailSubject, setEmailSubject] = useState("Asunto sin definir");
  const [sender] = useState("manuel@gmail.com");
  const [recipients] = useState("Pacientes con citas pendientes");

  useEffect(() => {
    const stored = localStorage.getItem("emailBlocks");
    if (stored) setEmailBlocks(JSON.parse(stored));
  }, []);

  const handleSend = () => {
    if (!campaignName || !emailSubject)
      return alert("Completa los campos obligatorios.");

    console.log({ campaignName, emailSubject, sender, recipients, emailBlocks });
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
            <div className="space-y-6">
            <div>
                <label className="block text-lg font-medium mb-3 text-purple-600 dark:text-purple-600">
                Nombre de la campaña <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                El nombre será útil para que puedas identificar la campaña con el reporte
                </div>
                <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Ingresa el nombre de la campaña"
                />
            </div>

            <div>
                <label className="block text-lg font-medium mb-3 text-purple-600 dark:text-purple-600">
                Asunto del email <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                El asunto es el título del correo que tus pacientes verán en su bandeja de entrada
                </div>
                <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Ingresa el asunto del email"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                Remitente
                </label>
                <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                    type="email"
                    value={sender}
                    readOnly
                    className="w-full p-3 pl-10 bg-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-600 dark:text-gray-300 cursor-not-allowed"
                />
                <div className="absolute right-3 top-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
                </div>
            </div>
            </div>

            <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg border-l-4 border-purple-500">
            <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">**Al enviar este email aceptas nuestros términos y condiciones**</span>
            </p>
            </div>
        </section>

        {/* Vista previa */}
        <aside className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-300 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <Image className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400">Vista previa</h3>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 min-h-[300px] border-2 border-dashed border-gray-300 dark:border-gray-600">
            {emailBlocks.length ? (
                emailBlocks.map((block, idx) => (
                <div key={idx} className="mb-4">
                    {block.type === "divider" && <hr className="my-4 border-gray-300 dark:border-gray-600" />}
                    {block.type === "image" && block.imageUrl && (
                    <img
                        src={block.imageUrl}
                        className="rounded-lg max-h-36 w-full object-cover mb-4"
                        alt="Imagen"
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
                <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
                Este es un nuevo bloque de texto. Cambia el texto.
                </p>
            )}
            </div>

            <div className="mt-6 space-y-4">
            <div>
                <h4 className="font-semibold text-md text-gray-700 dark:text-gray-200 mb-2">Destinatarios</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Esta campaña se enviará a:</p>
                <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>{recipients}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Total: 125 destinatarios</span>
                </div>
                </div>
            </div>

            <button
                onClick={handleSend}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6"
            >
                <Send className="h-4 w-4" />
                Enviar
            </button>
            </div>
        </aside>
        </div>

    </div>
  );
};

export default DetalleCampania;
