"use client";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect } from "react";

const enterprises = [
  {
    icon: "/Companies/LogoTAMI.webp",
    alt: "TAMI empresa confía en la Orientación Psicológica Online Contigo Voy",
  },
  {
    icon: "/Companies/YUNTASLogo.webp",
    alt: "Yuntas Empresa confía en la Orientación Psicológica Online Contigo Voy",
  },
  {
    icon: "/Companies/ASDEN.webp",
    alt: "ASDEN Empresa confía en la Orientación Psicológica Online Contigo Voy",
  },
  {
    icon: "/Companies/LOGONLS.webp",
    alt: "NEON LED PUBLICIDAD Empresa confía en la Orientación Psicológica Online Contigo Voy",
  },
  {
    icon: "/Companies/DigiLogo.webp",
    alt: "Digi Media Empresa confía en la Orientación Psicológica Online Contigo Voy",
  },
  {
    icon: "/Companies/NHLLOGO.webp",
    alt: "NHL Decoraciones Empresa confía en la Orientación Psicológica Online Contigo Voy",
  },
];

export default function RealiableCompanies() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    containScroll: "trimSnaps",
  });

  // Función para navegar a un slide específico
  const scrollTo = (index: number) => {
    if (emblaApi) {
      emblaApi.scrollTo(index * 3);
    }
  };

  // Autoplay
  useEffect(() => {
    if (!emblaApi) return;

    const autoplay = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, 4000);

    return () => clearInterval(autoplay);
  }, [emblaApi]);

  return (
    <div className="w-full flex flex-col items-center justify-center bg-background lg:my-8 ">
      <p
        className="text-title text-cv5 sm:text-cv7 font-bold mx-auto text-center mb-scv5"
        style={{ lineHeight: "1.2" }}
      >
        Empresas que confían en nuestra <br /> orientación psicológica
      </p>

      {/* Contenido para pantallas grandes */}
      <div className="lg:block hidden max-w-scv18 w-full">
        <div className="flex justify-between mt-16 mb-scv8 h-scv9 w-full">
          {enterprises.map((company, index) => (
            <div key={index} className="h-full flex-1 relative ">
              <Image
                src={company.icon}
                alt={company.alt}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Contenido para pantallas pequeñas */}
      <div className="block lg:hidden w-full mb-12 mt-scv6">
        <div className="embla" ref={emblaRef}>
          <div className="embla__container sm:h-scv9 h-scv8">
            {enterprises.map((company, index) => (
              <div className="slide h-full" key={index}>
                <div className="flex flex-col items-center justify-center p-6 relative h-full ">
                  <Image
                    src={company.icon}
                    alt={company.alt}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center mt-scv7 space-x-2">
          {[0, 1].map((dotIndex) => (
            <button
              key={dotIndex}
              onClick={() => scrollTo(dotIndex)}
              aria-label={`Ir al grupo ${dotIndex + 1}`}
              className={`w-3 h-3 rounded-full transition-all duration-300 bg-[#9494F3] hover:bg-[#634AE2]`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
