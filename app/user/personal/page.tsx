"use client";
import CerrarSesion from "@/components/CerrarSesion";
import PersonalComponent from "@/components/CrearUsuario/PersonalComponent";

export default function Personal() {
  return (
    <div className="bg-[#f8f8ff] dark:bg-[#121212] min-h-screen flex flex-col">
      {/* Header responsivo */}
      <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center w-full mt-6 md:mt-10 mb-4 md:mb-6 px-4 md:px-8 gap-4">
        <h1 className="font-bold text-2xl md:text-3xl lg:text-[32px] leading-tight text-primary dark:text-primary-foreground text-center sm:text-left">
          Registro de Personal
        </h1>
        <div className="flex-shrink-0">
          <CerrarSesion />
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="flex-1 overflow-x-hidden px-4 md:px-6 pb-6">
        <PersonalComponent />
      </div>
    </div>
  );
}
