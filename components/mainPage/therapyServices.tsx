"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function TherapyServices() {
  const router = useRouter();
  const services = [
    {
      id: "/terapia/infantes",
      icon: "/imagesTherapy/childTherapy.webp",
      alt: "Servicio Terapia Psicológica para Niños Contigo Voy Online",
      name: "Terapia psicológica para Niños",
      title: "Terapia para niños",
    },
    {
      id: "/terapia/adolescentes",
      icon: "/imagesTherapy/TeenTherapy.webp",
      alt: "Servicio Terapia Psicológica para Adolescentes Contigo Voy Online",
      name: "Terapia psicológica para Adolescentes",
      title: "Terapia para adolescentes",
    },
    {
      id: "/terapia/parejas",
      icon: "/imagesTherapy/coupleTherapy.webp",
      alt: "Servicio Terapia Psicológica para Pareja Contigo Voy Online",
      name: "Terapia psicológica para Parejas",
      title: "Terapia de parejas",
    },
    {
      id: "/terapia/adultos",
      icon: "/imagesTherapy/adultTherapy.webp",
      alt: "Servicio Terapia Psicológica para Adultos Contigo Voy Online",
      name: "Terapia Psicológica Adultos",
      title: "Terapia para adultos",
    },
    {
      id: "/terapia/familia",
      icon: "/imagesTherapy/familyTherapy.webp",
      alt: "Servicio Terapia Psicológica Para Familias Contigo Voy Online",
      name: "Terapia Psicológica Familiar",
      title: "Terapia familiar",
    },
    {
      id: "/terapia/empresarial",
      icon: "/imagesTherapy/familyTherapy.webp",
      alt: "Servicio Terapia Psicológica para Empresas Contigo Voy Online",
      name: "Terapia Psicología Empresarial",
      title: "Terapia empresarial",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
                          rounded-2xl p-5 text-white transition-all duration-300 
                          hover:shadow-[0_8px_32px_rgba(116,93,234,0.4)] hover:scale-[1.02] 
                          min-h-[200px] sm:min-h-[220px] flex flex-col justify-between cursor-pointer
                          relative overflow-hidden"
                onClick={() => router.push(`/servicios${service.id}`)}
              >
                {/* Patrón de fondo sutil */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
                </div>

                {/* Contenido Superior */}
                <div className="flex-1 relative z-10">
                  {/* Icono */}
                  <div className="flex justify-end mb-3">
                    <div className="relative overflow-hidden rounded-lg bg-white/15 p-2.5 
                                  group-hover:bg-white/25 transition-all duration-300 
                                  group-hover:scale-110 backdrop-blur-sm">
                      <Image
                        src={service.icon}
                        alt={service.alt}
                        title={service.name}
                        width={63}
                        height={63}
                        className="w-10 h-10 sm:w-12 sm:h-12 object-contain filter brightness-0 invert"
                      />
                    </div>
                  </div>

                  {/* Título */}
                  <h3 className="text-lg sm:text-xl font-bold leading-tight mb-3
                               group-hover:text-purple-100 transition-colors duration-300">
                    {service.title}
                  </h3>
                </div>

                {/* Botón Ver Más */}
                <div className="flex justify-end relative z-10">
                  <button className="group/btn flex items-center space-x-2 text-sm 
                                   hover:text-purple-200 transition-all duration-300
                                   bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg
                                   backdrop-blur-sm">
                    <span className="relative text-white font-medium text-sm">
                      Ver más
                      <span className="absolute bottom-0 left-0 w-0 transition-all h-0.5 bg-white 
                                     group-hover/btn:w-full duration-500"></span>
                    </span>
                    <ArrowRight
                      strokeWidth={2.5}
                      className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300"
                    />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}