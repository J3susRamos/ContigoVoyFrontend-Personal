"use client";
import { GetPlantillas } from "@/app/apiRoutes";
import CerrarSesion from "@/components/CerrarSesion";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plantilla } from "@/interface";

interface Props {
  onBack: () => void;
}

const PlantillasGuardadas: React.FC<Props> = ({ onBack }) => {
  const router = useRouter();
  const [plantillas, setPlantillas] = useState<Plantilla[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlantillas = async () => {
      try {
        const result = await GetPlantillas();
        console.log("Plantillas obtenidas:", result);

        if (result.result && Array.isArray(result.result)) {
          setPlantillas(result.result);
        } else {
          console.warn("Formato de respuesta inesperado:", result);
        }
      } catch (error) {
        console.error("Error al obtener plantillas guardadas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlantillas();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 mb-6">
      {/* Navbar superior */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Email marketing
        </h1>
        <CerrarSesion />
      </div>

      {/* Título principal */}
      <div className="text-center py-6">
        <h2 className="text-3xl font-bold text-purple-400">Plantillas guardadas</h2>
      </div>

      {/* Navbar secundario con pestañas */}
      <div className="w-full h-auto md:h-16 bg-primary dark:bg-primary flex items-center justify-start">
        <div className="md:ml-10 flex flex-col md:flex-row gap-2 md:gap-6 items-center w-full max-w-full md:max-w-[400px] py-6 md:py-4 mx-4">
          {/* Botón activo */}
          <button onClick={() => router.push("/user/marketing/crear")} className="w-full md:w-auto inline-flex items-center justify-center gap-2 whitespace-nowrap shadow h-10 md:h-9 dark:bg-background text-primary dark:text-primary hover:bg-white text-white hover:text-primary/80 dark:hover:bg-background dark:hover:text-primary/80 text-base md:text-[16px] leading-[20px] font-bold rounded-full px-6 md:px-9 py-2 transition-colors">
            Plantillas
          </button>

          {/* Botón inactivo */}
          <button onClick={() => router.push("/user/marketing/crear/plantillasGuardadas")} className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-white whitespace-nowrap shadow h-10 md:h-9 bg-primary dark:bg-primary text-purple-700 dark:text-white  text-base md:text-[16px] leading-[20px] font-bold rounded-full px-6 md:px-9 py-2 transition-colors">
            Plantillas enviadas
          </button>
        </div>
      </div>

      {/* Lista de plantillas guardadas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center min-h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="ml-3 text-gray-500 dark:text-gray-400">Cargando...</p>
          </div>
        ) : plantillas.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-4">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-xl text-gray-500 dark:text-gray-400 mb-2">
              No tienes plantillas guardadas
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Crea tu primera plantilla para comenzar
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-8">
            {plantillas.map((p, index) => (
              <div
                key={`plantilla-${p.id ?? `sin-id-${index}`}`}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:scale-[1.02] cursor-pointer overflow-hidden"
              >
                {/* Efecto de gradiente superior */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

                {/* Header de la card */}
                <div className="p-4 sm:p-5 lg:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg sm:text-xl font-bold text-purple-600 dark:text-purple-400 line-clamp-2 flex-1 pr-2">
                      {p.nombre}
                    </h3>
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors duration-200">
                      <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>

                  {/* Asunto */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Asunto:
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 bg-gray-50 dark:bg-gray-700/50 px-3 py-2 rounded-lg">
                      {p.asunto}
                    </p>
                  </div>

                  {/* Destinatarios */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Destinatarios ({p.destinatarios.split(",").filter(email => email.trim()).length}):
                    </p>
                    <div className="max-h-20 overflow-y-auto">
                      <div className="space-y-1">
                        {p.destinatarios
                          .split(",")
                          .filter(email => email.trim())
                          .slice(0, 3)
                          .map((email, idx) => (
                            <div key={idx} className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 flex-shrink-0"></div>
                              <span className="truncate">{email.trim()}</span>
                            </div>
                          ))}
                        {p.destinatarios.split(",").filter(email => email.trim()).length > 3 && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 pl-4">
                            +{p.destinatarios.split(",").filter(email => email.trim()).length - 3} más
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contenido preview */}
                <div className="px-4 sm:px-5 lg:px-6 pb-4 sm:pb-5 lg:pb-6">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600 min-h-32 max-h-48 overflow-hidden relative">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      VISTA PREVIA
                    </div>

                    {p.bloques.length === 0 ? (
                      <div className="flex items-center justify-center h-20 text-gray-400 dark:text-gray-500">
                        <p className="text-sm">Sin contenido disponible</p>
                      </div>
                    ) : (
                      <div className="space-y-2 overflow-y-auto max-h-32">
                        {p.bloques.slice(0, 3).map((block, idx) => (
                          <div key={`bloque-${block.id ?? `sin-id-${idx}`}`} className="animate-fadeIn">
                            {block.type === "divider" && (
                              <hr className="border-gray-300 dark:border-gray-500 my-2" />
                            )}
                            {block.type === "image" && block.imageUrl && (
                              <div className="relative rounded-lg overflow-hidden">
                                <img
                                  src={block.imageUrl}
                                  alt="Preview"
                                  className="w-full h-16 object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              </div>
                            )}
                            {block.type === "columns" && Array.isArray(block.imageUrls) && (
                              <div className="grid grid-cols-2 gap-2">
                                {block.imageUrls.slice(0, 2).map((url, columnIndex) => (
                                  <img
                                    key={`${block.id}-col-${columnIndex}`}
                                    src={url}
                                    alt={`Columna ${columnIndex + 1}`}
                                    className="rounded-lg w-full h-12 object-cover transition-transform duration-300 group-hover:scale-105"
                                  />
                                ))}
                              </div>
                            )}
                            {(block.type === "header" || block.type === "text") && block.content && (
                              <p
                                className={`${block.type === "header"
                                  ? "text-sm font-bold text-gray-800 dark:text-gray-200"
                                  : "text-xs text-gray-600 dark:text-gray-400"
                                  } break-words leading-relaxed whitespace-pre-line`}
                                style={{
                                  fontWeight: block.styles?.bold ? "bold" : block.type === "header" ? "bold" : "normal",
                                  fontStyle: block.styles?.italic ? "italic" : "normal",
                                }}
                              >
                                {block.content}
                              </p>
                            )}
                          </div>
                        ))}
                        {p.bloques.length > 3 && (
                          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-100 dark:from-gray-800 to-transparent flex items-end justify-center">
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                              +{p.bloques.length - 3} bloques más
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer con estadísticas */}
                <div className="px-4 sm:px-5 lg:px-6 pb-4 sm:pb-5 lg:pb-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        {p.bloques.length} bloques
                      </span>
                      <span className="flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {p.destinatarios.split(",").filter(email => email.trim()).length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Botón de volver mejorado */}
        <div className="flex justify-center mt-12 sm:mt-16">
          <button
            onClick={onBack}
            className="group relative bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800"
          >
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2 transition-transform duration-200 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver atrás
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlantillasGuardadas;
