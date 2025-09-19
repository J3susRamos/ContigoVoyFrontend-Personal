"use client";
import CerrarSesion from "@/components/CerrarSesion";
import React from "react";
import { ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";


interface CrearPlantillaProps {
  onBack: () => void;
}

const getButtonClasses = (isActive: boolean) => {
  const baseClasses = "w-full md:w-auto inline-flex items-center justify-center gap-2 whitespace-nowrap shadow h-10 md:h-11 text-sm md:text-base font-semibold rounded-full px-4 md:px-8 py-2 transition-all duration-200 ease-in-out transform hover:scale-105";

  if (isActive) {
    return `${baseClasses} bg-white dark:bg-background text-primary dark:text-primary-foreground shadow-lg border-2 border-primary/20 hover:bg-white`;
  }

  return `${baseClasses} bg-transparent text-white dark:text-white hover:bg-white/10 dark:hover:bg-white/5 hover:text-white border-2 border-transparent hover:border-white/20`;
};

const CrearPlantilla: React.FC<CrearPlantillaProps> = ({ onBack }) => {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Navbar superior */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 md:px-6 pt-4 md:pt-6 pb-3 md:pb-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Email marketing
        </h1>
        <div className="mt-3 md:mt-0 w-full md:w-auto flex justify-end">
          <CerrarSesion />
        </div>
      </div>

      {/* Título principal centrado */}
      <div className="text-center py-4 md:py-6">
        <h2 className="text-2xl md:text-3xl font-bold text-purple-400">
          Plantillas
        </h2>
      </div>

      {/* Navbar secundario con pestañas */}
      <div className="w-full bg-primary dark:bg-primary flex items-center justify-start">
        <div className="mx-auto flex flex-col md:flex-row gap-2 md:gap-6 items-center w-full max-w-full md:max-w-[400px] p-4 md:p-6">
          {/* Botón activo */}
          <button onClick={() => router.push("/user/marketing/crear")} className={getButtonClasses(true)}>
            Plantillas
          </button>

          {/* Botón inactivo */}
          <button onClick={() => router.push("/user/marketing/crear/plantillasGuardadas")} className={getButtonClasses(false)}>
            Plantillas guardadas
          </button>
        </div>
      </div>


      {/* Contenido principal */}
      <div className="max-w-6xl mx-auto p-6">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Plantilla solo texto */}
          <PlantillaMockup
            titulo="Plantilla solo texto"
            descripcion="Plantilla para promocionar uno o más servicios."
            onClick={() => router.push("/user/marketing/plantilla/solo-texto")}
            contenido={
              <div className="w-full h-full bg-white dark:bg-gray-800 p-4 flex flex-col space-y-3 rounded-lg">
                {/* Simulación de líneas de texto */}
                <div className="h-4 bg-gray-400 dark:bg-gray-600 rounded-full w-full" />
                <div className="h-4 bg-gray-400 dark:bg-gray-600 rounded-full w-5/6" />
                <div className="h-4 bg-gray-400 dark:bg-gray-600 rounded-full w-3/4" />
                <div className="h-4 bg-gray-400 dark:bg-gray-600 rounded-full w-full mt-4" />
                <div className="h-4 bg-gray-400 dark:bg-gray-600 rounded-full w-11/12" />
                <div className="h-4 bg-gray-400 dark:bg-gray-600 rounded-full w-2/3" />
                <div className="h-4 bg-gray-400 dark:bg-gray-600 rounded-full w-full mt-4" />
                <div className="h-4 bg-gray-400 dark:bg-gray-600 rounded-full w-4/5" />
              </div>
            }
          />


          {/* Plantilla imagen + texto */}
          <PlantillaMockup
            titulo="Plantilla imagen + texto"
            descripcion="Plantilla para promocionar uno o más servicios."
            onClick={() => router.push("/user/marketing/plantilla/imagen-texto")}
            contenido={
              <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                {/* Contenedor simulado de imagen */}
                <div className="h-1/2 p-3">
                  <div className="w-full h-full bg-gray-300 dark:bg-gray-700 flex flex-col items-center justify-center border border-dashed  dark:border-gray-600 space-y-1 rounded-md">
                    <ImageIcon className="h-6 w-6 text-gray-600 dark:text-purple-400" />
                    <span className="text-gray-600 dark:text-purple-400 text-xs">Imagen</span>
                  </div>
                </div>

                {/* Texto simulado */}
                <div className="h-1/2 p-3 flex flex-col space-y-2">
                  <div className="h-3 bg-gray-400 dark:bg-gray-600 rounded-md w-5/6" />
                  <div className="h-3 bg-gray-400 dark:bg-gray-600 rounded-md w-4/6" />
                  <div className="h-3 bg-gray-400 dark:bg-gray-600 rounded-md w-3/4" />
                </div>
              </div>
            }
          />

          {/* Plantilla dos columnas */}
          <PlantillaMockup
            titulo="Plantilla completa dos columnas"
            descripcion="Plantilla para promocionar uno o más servicios."
            onClick={() => router.push("/user/marketing/plantilla/dos-columnas")}
            contenido={
              <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg overflow-hidden p-3 space-y-3">
                {/* Imagen principal superior */}
                <div className="h-1/2 bg-gray-300 dark:bg-gray-600 rounded-lg flex flex-col items-center justify-center space-y-1">
                  <ImageIcon className="h-6 w-6 text-gray-700 dark:text-purple-400" />
                  <span className="text-gray-700 dark:text-purple-400 text-xs">Imagen</span>
                </div>

                {/* Líneas de texto */}
                <div className="space-y-1.5">
                  <div className="h-1.5 bg-gray-400 dark:bg-gray-600 rounded w-full" />
                  <div className="h-1.5 bg-gray-400 dark:bg-gray-600 rounded w-2/3" />
                </div>

                {/* Dos columnas inferiores */}
                <div className="flex-1 flex space-x-3">
                  <div className="flex-1 bg-gray-300 dark:bg-gray-600 rounded-lg flex flex-col items-center justify-center space-y-1">
                    <ImageIcon className="h-5 w-4 text-gray-700 dark:text-purple-400" />
                  </div>
                  <div className="flex-1 bg-gray-300 dark:bg-gray-600 rounded-lg flex flex-col items-center justify-center space-y-1">
                    <ImageIcon className="h-5 w-4 text-gray-700 dark:text-purple-400" />
                  </div>
                </div>

                {/* Líneas de texto finales */}
                <div className="space-y-1.5">
                  <div className="h-1.5 bg-gray-400 dark:bg-gray-600 rounded w-full" />
                  <div className="h-1.5 bg-gray-400 dark:bg-gray-600 rounded w-2/3" />
                </div>
              </div>
            }
          />

          {/* Plantilla texto + imagen */}
          <PlantillaMockup
            titulo="Plantilla texto + imagen"
            descripcion="Plantilla para promocionar uno o más servicios."
            onClick={() => router.push("/user/marketing/plantilla/texto-imagen")}
            contenido={
              <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg overflow-hidden p-3 space-y-3">
                {/* Líneas de texto superiores */}
                <div className="space-y-2">
                  <div className="h-2 bg-gray-400 dark:bg-gray-600 rounded w-full" />
                  <div className="h-2 bg-gray-400 dark:bg-gray-600 rounded w-5/6" />
                  <div className="h-2 bg-gray-400 dark:bg-gray-600 rounded w-4/5" />
                  <div className="h-2 bg-gray-400 dark:bg-gray-600 rounded w-full" />
                  <div className="h-2 bg-gray-400 dark:bg-gray-600 rounded w-3/4" />
                </div>

                {/* Imagen inferior */}
                <div className="flex-1 bg-gray-300 dark:bg-gray-600 rounded-lg flex flex-col items-center justify-center space-y-1">
                  <ImageIcon className="h-6 w-6 text-gray-700 dark:text-purple-400" />
                  <span className="text-gray-700 dark:text-purple-400 text-xs">Imagen</span>
                </div>
              </div>
            }
          />

          {/* Plantilla una columna */}
          <PlantillaMockup
            titulo="Plantilla completa una columna"
            descripcion="Plantilla para promocionar uno o más servicios."
            onClick={() => router.push("/user/marketing/plantilla/una-columna")}
            contenido={
              <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg overflow-hidden p-3 space-y-2">
                {/* Primera imagen */}
                <div className="h-1/4 bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-4 w-4 text-gray-700 dark:text-purple-400" />
                </div>

                {/* Primera sección de texto */}
                <div className="space-y-1">
                  <div className="h-1.5 bg-gray-400 dark:bg-gray-600 rounded w-full" />
                  <div className="h-1.5 bg-gray-400 dark:bg-gray-600 rounded w-4/5" />
                </div>

                {/* Segunda imagen */}
                <div className="h-1/4 bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-4 w-4 text-gray-700 dark:text-purple-400" />
                </div>

                {/* Segunda sección de texto */}
                <div className="space-y-1">
                  <div className="h-1.5 bg-gray-400 dark:bg-gray-600 rounded w-full" />
                  <div className="h-1.5 bg-gray-400 dark:bg-gray-600 rounded w-3/4" />
                  <div className="h-1.5 bg-gray-400 dark:bg-gray-600 rounded w-5/6" />
                </div>
              </div>
            }
          />
        </div>

        <button
          onClick={onBack}
          className="mt-10 bg-primary dark:bg-primary hover:bg-gray-300 hover:text-black dark:hover:bg-gray-600 text-white dark:text-white font-bold py-2 px-6 rounded transition"
        >
          Volver atrás
        </button>
      </div>
    </div>
  );
};

const PlantillaMockup = ({
  titulo,
  descripcion,
  contenido,
  onClick,
}: {
  titulo: string;
  descripcion: string;
  contenido: React.ReactNode;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className="cursor-pointer border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-transform duration-200 bg-white dark:bg-gray-800 transform hover:scale-105"
  >
    <div className="p-4 h-48 flex justify-center items-center bg-gray-400 dark:bg-gray-700">
      <div className="w-full h-full">{contenido}</div>
    </div>
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <h3 className="font-bold text-lg mb-1 text-gray-800 dark:text-purple-400">
        {titulo}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">{descripcion}</p>
    </div>
  </div>
);


export default CrearPlantilla;
