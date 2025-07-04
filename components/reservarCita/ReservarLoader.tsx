"use client";
import ReservarComponentSearch from "./ReservarComponentSearch";
import ReservarPsiPreview from "./ReservarPsiPreview";
import { Search, Filter } from "lucide-react";
import { Skeleton } from "@heroui/react";
import { PsicologoPreviewData } from "@/interface";

const dummyPsicologo: PsicologoPreviewData = {
  idPsicologo: 1,
  titulo: "Lic. en Psicología Clínica",
  nombre: "María",
  apellido: "González",
  pais: "pe",
  introduccion:
    "Soy una psicóloga con más de 10 años de experiencia ayudando a jóvenes y adultos a mejorar su salud mental.",
  genero: "Femenino",
  experiencia: 10,
  correo: "maria.gonzalez@example.com",
  contrasena: "12345678",
  fecha_nacimiento: "1985-07-15",
  especialidades: [],
  imagen: "",
  horario: {
    lunes: [
      ["09:00", "12:00"],
      ["14:00", "18:00"],
    ],
    martes: [["10:00", "13:00"]],
    miercoles: [],
    jueves: [["08:00", "11:00"]],
    viernes: [["15:00", "19:00"]],
    sabado: [],
    domingo: [],
  },
};
  

export default function ReservarLoader() {

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#f8f9ff] via-[#f0f2ff] to-[#e8ebff] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* {Header Section} */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 ">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold text-[#634AE2] dark:text-primary pb-1 lg:pb-2 mb-2 bg-gradient-to-r from-[#634AE2] to-[#8b7cf6] bg-clip-text text-transparent">
                Reservar Cita
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl">
                <span className="font-bold">
                  La mejor inversión es en ti mismo ¡Comienza tu proceso hoy!{" "}
                </span>
                <br />
                Agenda tu sesión con un psicólogo en línea, fácil, seguro y
                privado
              </p>
            </div>
            <Skeleton className="relative lg:w-96 rounded-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 fill-gray-100 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar psicólogos..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-[#e0e4ff] focus:border-[#634AE2] focus:outline-none bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 text-gray-800 dark:text-white transition-all duration-300 shadow-lg"
              />
            </Skeleton>
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mt-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#634AE2] to-[#8b7cf6] text-white rounded-2xl text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                <Filter className="w-4 h-4" />
                Filtros
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className={`lg:col-span-1 hidden lg:block`}>
            <div className="sticky top-6">
              <Skeleton className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-[#634AE2]/10">
                <div className="h-scv16"/>
              </Skeleton>
            </div>
          </div>

          <div className="lg:col-span-3 grid gap-8 grid-cols-2 max-lg:grid-cols-1 h-full w-full">
            {Array.from({ length: 20 }).map((Item, index) => (
              <Skeleton
                key={index}
                className="sm:w-auto max-lg:px-4 w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-[#634AE2]/10"
              >
                <ReservarPsiPreview psicologo={dummyPsicologo} />
              </Skeleton>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
