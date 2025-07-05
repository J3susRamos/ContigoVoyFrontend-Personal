"use client";
import { GetPlantillas } from "@/app/apiRoutes";
import CerrarSesion from "@/components/CerrarSesion";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plantilla} from "@/interface";

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
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
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

      {/* Navbar secundario */}
      <div className="w-full h-16 bg-primary dark:bg-primary flex items-center justify-start">
        <div className="ml-10 flex justify-between items-center w-full max-w-[600px]">
          <button
            onClick={() => router.push("/user/marketing/crear")}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap shadow h-9 bg-primary dark:bg-primary text-white dark:text-white hover:text-purple-300 text-[16px] leading-[20px] font-bold rounded-full px-9 py-2 transition-colors"
          >
            Crear Plantilla
          </button>
          <button
            onClick={() => router.refresh()}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap shadow h-9 bg-white dark:bg-background text-primary dark:text-primary hover:bg-white hover:text-primary/80 dark:hover:bg-background dark:hover:text-primary/80 text-[16px] leading-[20px] font-bold rounded-full px-9 py-2 transition-colors"
          >
            Plantillas guardadas
          </button>
        </div>
      </div>

      {/* Lista de plantillas guardadas */}
      <div className="max-w-6xl mx-auto p-6">
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400">Cargando...</p>
        ) : plantillas.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No tienes plantillas guardadas.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {plantillas.map((p, index) => (
              <div
                key={`plantilla-${p.id ?? `sin-id-${index}`}`}
                className="bg-white dark:bg-gray-800 p-4 rounded shadow border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-lg font-bold text-purple-500">{p.nombre}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  <strong>Asunto:</strong> {p.asunto}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-300 mb-3">
                  <strong>Destinatarios:</strong> {p.destinatarios}
                </p>

                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded border border-dashed border-gray-300 dark:border-gray-500">
                  {p.bloques.length === 0 ? (
                    <p className="text-xs text-gray-400">Sin contenido.</p>
                  ) : (
                    p.bloques.map((block, idx) => (
                      <div key={`bloque-${block.id ?? `sin-id-${idx}`}`} className="mb-3">
                        {block.type === "divider" && (
                          <hr className="border-gray-300 dark:border-gray-600" />
                        )}
                        {block.type === "image" && block.imageUrl && (
                          <img
                            src={block.imageUrl}
                            alt="Bloque imagen"
                            className="rounded-lg w-full max-h-32 object-cover"
                          />
                        )}
                        {block.type === "columns" && Array.isArray(block.imageUrls) && (
                          <div className="grid grid-cols-2 gap-2">
                            {block.imageUrls.map((url, columnIndex) => (
                              <img
                                key={`${block.id}-col-${columnIndex}`}
                                src={url}
                                alt={`Imagen columna ${columnIndex + 1}`}
                                className="rounded-lg w-full h-24 object-cover"
                              />
                            ))}
                          </div>
                        )}
                        {(block.type === "header" || block.type === "text") &&
                          block.content && (
                            <p
                              className={`${
                                block.type === "header" ? "text-md font-bold" : "text-sm"
                              } text-gray-700 dark:text-gray-200`}
                              style={{
                                color: block.styles?.color || undefined,
                                fontWeight: block.styles?.bold ? "bold" : "normal",
                                fontStyle: block.styles?.italic ? "italic" : "normal",
                              }}
                            >
                              {block.content}
                            </p>
                          )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-12">
          <button
            onClick={onBack}
            className="bg-primary dark:bg-primary hover:bg-gray-300 dark:hover:bg-gray-600 text-white dark:text-white font-bold py-2 px-6 rounded transition"
          >
            Volver atrás
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlantillasGuardadas;
