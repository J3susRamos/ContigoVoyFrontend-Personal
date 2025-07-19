"use client";

import CerrarSesion from "@/components/CerrarSesion";

// Contenido estático separado
const POLITICAS_CONTENT = {
  title: "Políticas y Privacidad"
}

export default function Politicas() {
  return (
    <div className="h-full">
      <div className="bg-[#f8f8ff] dark:bg-background min-h-screen transition-colors duration-300">
              {/* Encabezado */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 pt-6 pb-4">
                <div>
                  <h1 className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-white">
                    {POLITICAS_CONTENT.title}
                  </h1>
                </div>
                <div className="mt-4 md:mt-0">
                  <CerrarSesion />
                </div>
              </div>
        
              {/* Contenido principal */}
              <div className="min-h-[80vh] p-6">
              </div>
            </div>
    </div>
  )
}