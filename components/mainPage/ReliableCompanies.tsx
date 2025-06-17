"use client";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect } from "react";

const enterprises = [
  {
    icon: "/Companies/LogoTAMI.webp",
    alt: "TAMI empresa confía en la Orientación Psicológica Online Contigo Voy",
    width: 98,
    height: 114,
  },
  {
    icon: "/Companies/YUNTASLogo.webp",
    alt: "Yuntas Empresa confía en la Orientación Psicológica Online Contigo Voy",
    width: 114,
    height: 114,
  },
  {
    icon: "/Companies/ASDEN.webp",
    alt: "ASDEN Empresa confía en la Orientación Psicológica Online Contigo Voy",
    width: 126,
    height: 114,
  },
  {
    icon: "/Companies/LOGONLS.webp",
    alt: "NEON LED PUBLICIDAD Empresa confía en la Orientación Psicológica Online Contigo Voy",
    width: 138,
    height: 104,
  },
  {
    icon: "/Companies/DigiLogo.webp",
    alt: "Digi Media Empresa confía en la Orientación Psicológica Online Contigo Voy",
    width: 114,
    height: 114,
  },
  {
    icon: "/Companies/NHLLOGO.webp",
    alt: "NHL Decoraciones Empresa confía en la Orientación Psicológica Online Contigo Voy",
    width: 93,
    height: 114,
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
    <div className="w-full flex flex-col items-center justify-center bg-background lg:mt-8 ">
      <p
        className="text-title lg:text-4xl text-xl font-bold mx-auto text-center"
        style={{ lineHeight: "1.5" }}
      >
        Empresas que confían en nuestra <br /> orientación psicológica
      </p>

      {/* Contenido para pantallas grandes */}
      <div className="lg:block hidden">
        <div className="flex flex-wrap justify-center gap-24 mt-16 mb-28">
          {enterprises.map((company, index) => (
            <div key={index}>
              <Image
                src={company.icon}
                alt={company.alt}
                width={company.width}
                height={company.height}
                style={{ width: "auto", height: "auto", maxHeight: "80px" }}
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Contenido para pantallas pequeñas */}
      <div className="block lg:hidden w-full mb-12">
        <div className="embla" ref={emblaRef}>
          <div className="embla__container">
            {enterprises.map((company, index) => (
              <div className="slide" key={index}>
                <div className="flex flex-col items-center justify-center p-6 my-5 ">
                  <Image
                    src={company.icon}
                    alt={company.alt}
                    width={company.width}
                    height={company.height}
                    style={{ width: "auto", height: "auto", maxHeight: "80px" }}
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center mt-4 space-x-2">
          {[0, 1].map((dotIndex) => (
            <button
              key={dotIndex}
              onClick={() => scrollTo(dotIndex)}
              aria-label={`Ir al grupo ${dotIndex + 1}`}
              className={`
                w-3 h-3 rounded-full transition-all duration-300
                ${
                  emblaApi?.selectedScrollSnap() === dotIndex * 3
                    ? "bg-[#634AE2]"
                    : "bg-[#9494F3]"
                }
              `}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
