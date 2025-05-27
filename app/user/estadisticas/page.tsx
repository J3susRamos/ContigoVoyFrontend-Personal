"use client";
import CerrarSesion from "@/components/CerrarSesion";
import Showstadistic from "@/components/stadistic/showstadistic";

export default function stadistic() {
  return (
    <div className="bg-[#f8f8ff] dark:bg-background min-h-screen flex flex-col">
      <div className="flex justify-between w-full mt-10 mb-6">
        <h1 className="flex items-center font-bold text-[32px] leading-[40px] ml-11 text-primary dark:text-primary-foreground">
          Estadísticas
        </h1>
        <CerrarSesion />
      </div>
      <Showstadistic />
    </div>
  );
}
