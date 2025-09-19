"use client";
import Image from "next/image";

const enterprises = [
  {
    icon: "/Companies/LogoTAMI.webp",
    title: "TAMI empresa",
    alt: "TAMI empresa confía en la Orientación Psicológica Online Contigo Voy",
  },
  {
    icon: "/Companies/YUNTASLogo.webp",
    title: "Yuntas Empresa",
    alt: "Yuntas Empresa confía en la Orientación Psicológica Online Contigo Voy",
  },
  {
    icon: "/Companies/ASDEN.webp",
    title: "ASDEN Empresa",
    alt: "ASDEN Empresa confía en la Orientación Psicológica Online Contigo Voy",
  },
  {
    icon: "/Companies/LOGONLS.webp",
    title: "NEON LED PUBLICIDAD Empresa",
    alt: "NEON LED PUBLICIDAD Empresa confía en la Orientación Psicológica Online Contigo Voy",
  },
  {
    icon: "/Companies/DigiLogo.webp",
    title: "Digi Media Empresa",
    alt: "Digi Media Empresa confía en la Orientación Psicológica Online Contigo Voy",
  },
  {
    icon: "/Companies/NHLLOGO.webp",
    title: "NHL Decoraciones Empresa",
    alt: "NHL Decoraciones Empresa confía en la Orientación Psicológica Online Contigo Voy",
  },
];

export default function RealiableCompanies() {
  return (
    <div className="w-full flex flex-col items-center justify-center dark:bg-gray-900 bg-white-100 lg:my-8 ">
      <p
        className="text-title text-cv5 sm:text-cv7 font-bold mx-auto text-center mb-scv5"
        style={{ lineHeight: "1.2" }}
      >
        Empresas que confían en nuestra <br /> orientación psicológica
      </p>

      {/* Contenedor del carousel infinito */}
      <div className="w-full max-w-7xl mx-auto mt-16 mb-scv8 overflow-hidden">
        <div className="relative">
          {/* Gradientes para el efecto fade */}
          <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10"></div>
          
          {/* Contenedor de logos con animación */}
          <div className="flex animate-scroll-infinite">
            {/* Primera copia de los logos */}
            {enterprises.map((company, index) => (
              <div key={`first-${index}`} className="flex-shrink-0 mx-8 h-16 w-32 lg:h-20 lg:w-40 relative group">
                <Image
                  title={company.title}
                  src={company.icon}
                  alt={company.alt}
                  fill
                  className="object-contain dark:brightness-0 dark:saturate-100 dark:invert transition-all duration-300 group-hover:scale-110"
                />
              </div>
            ))}
            
            {/* Segunda copia de los logos para el efecto infinito */}
            {enterprises.map((company, index) => (
              <div key={`second-${index}`} className="flex-shrink-0 mx-8 h-16 w-32 lg:h-20 lg:w-40 relative group">
                <Image
                  title={company.title}
                  src={company.icon}
                  alt={company.alt}
                  fill
                  className="object-contain dark:brightness-0 dark:saturate-100 dark:invert transition-all duration-300 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
