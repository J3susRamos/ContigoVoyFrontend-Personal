"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactSVG } from "react-svg";

const services = [
  {
    id: "/terapia/infantes",
    icon: "/ImgsInicio/ImgsServicios/childTherapy.svg",
    alt: "Servicio Terapia Psicológica para Niños Contigo Voy Online",
    name: "Terapia psicológica para Niños",
    title: "Terapia para niños",
  },
  {
    id: "/terapia/adolescentes",
    icon: "/ImgsInicio/ImgsServicios/TeenTherapy.svg",
    alt: "Servicio Terapia Psicológica para Adolescentes Contigo Voy Online",
    name: "Terapia psicológica para Adolescentes",
    title: "Terapia para adolescentes",
  },
  {
    id: "/terapia/parejas",
    icon: "/ImgsInicio/ImgsServicios/coupleTherapy.svg",
    alt: "Servicio Terapia Psicológica para Pareja Contigo Voy Online",
    name: "Terapia psicológica para Parejas",
    title: "Terapia de parejas",
  },
  {
    id: "/terapia/adultos",
    icon: "/ImgsInicio/ImgsServicios/adultTherapy.svg",
    alt: "Servicio Terapia Psicológica para Adultos Contigo Voy Online",
    name: "Terapia Psicológica Adultos",
    title: "Terapia para adultos",
  },
  {
    id: "/terapia/familia",
    icon: "/ImgsInicio/ImgsServicios/familyTherapy.svg",
    alt: "Servicio Terapia Psicológica Para Familias Contigo Voy Online",
    name: "Terapia Psicológica Familiar",
    title: "Terapia familiar",
  },
  {
    id: "/terapia/empresarial",
    icon: "/ImgsInicio/ImgsServicios/businessTherapy.svg",
    alt: "Servicio Terapia Psicológica para Empresas Contigo Voy Online",
    name: "Terapia Psicología Empresarial",
    title: "Terapia empresarial",
  },
];

export default function TherapyServices() {
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-gray-50 dark:bg-gray-900">
      {/* Título */}
      <motion.h2
        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center dark:text-white text-[#543dec] mb-6 lg:mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Servicios
      </motion.h2>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 lg:gap-8">
        {/* Contenedor de Servicios */}
        <div className="w-full">
          {/* Grid Responsive de Servicios */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-gradient-to-br from-[#745DEA] to-[#5B47C7] hover:from-[#5B47C7] hover:to-[#4A3CB3]
                  rounded-2xl pl-3 pr-5 py-5 text-white transition-all duration-300
                  hover:shadow-[0_8px_32px_rgba(116,93,234,0.4)] hover:scale-[1.02]
                  min-h-[130px] sm:min-h-[180px] lg:min-h-[150px] flex items-center cursor-pointer
                  relative overflow-hidden"
                onClick={() => router.push(`/servicios${service.id}`)}
              >
                {/* Fondo decorativo */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white dark:bg-gray-900 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white dark:bg-gray-900 rounded-full translate-y-12 -translate-x-12"></div>
                </div>

                {/* Contenido - Todo en una línea horizontal */}
                  {/* Contenido - Responsive Grid */}
                  <div className="grid grid-cols-[auto_1fr_72px] items-center w-full h-full relative z-10 gap-2 sm:gap-4 min-w-0">
                  {/* Icono */}
                  <div
                    className="relative overflow-hidden rounded-lg bg-white/15 p-2.5 
                      group-hover:bg-white/25 transition-all duration-300 
                      group-hover:scale-110 backdrop-blur-sm flex-shrink-0
                       sm:w-10 sm:h-10 md:w-12 md:h-12 max-w-full max-h-full"
                  >
                    <ReactSVG
                      className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 max-w-full max-h-full object-contain filter brightness-0 invert"
                      src={service.icon}
                      title={service.name}
                      beforeInjection={(svg) => {
                        svg.classList.add("fill-gray-300");
                      }}
                    />
                  </div>
                  
                  {/* Texto */}
                  <div className="flex-1 flex-grow">
                    <h3
                      className="text-lg sm:text-xl font-bold leading-tight text-center
                        group-hover:text-purple-100 transition-colors duration-300"
                    >
                      {service.title}
                    </h3>
                  </div>

                  {/* Botón Ver Más */}
                   <div className="flex-shrink-0 relative z-10 w-[72px]">
                     <button
                       className="group/btn flex items-center space-x-2 text-sm 
                         hover:text-purple-200 transition-all duration-300
                         bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg
                         backdrop-blur-sm w-full"
                     >
                       <span className="relative text-white font-medium text-sm whitespace-normal text-center block w-full">
                         Ver más
                         <span
                           className="absolute bottom-0 left-0 w-0 transition-all h-0.5 bg-white 
                             group-hover/btn:w-full duration-500"
                         ></span>
                       </span>
                       <ArrowRight
                         strokeWidth={2.5}
                         className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300"
                       />
                     </button>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}