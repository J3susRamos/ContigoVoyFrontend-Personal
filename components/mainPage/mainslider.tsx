"use client";
import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { AnimatePresence, motion } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

interface SliderSection {
  phrase: string;
  smallPhrase: string;
  button: boolean;
  backgroundMobile: string;
  backgroundDesktop: string;
  alt: string;
  title: string;
}

const sections: SliderSection[] = [
  {
    phrase: "Estamos contigo y para ti ",
    smallPhrase:
      "Con nuestras terapias virtuales, transformamos tu vida y te acompañamos en cada paso de tu camino hacia la sanación.",
    button: true,
    backgroundMobile: "/carruselImages/salud-mental-terapia-virtual.webp",
    backgroundDesktop: "/carruselImages/Escritorio-salud-mental-terapia-virtual.webp",
    alt: "Estamos contigo en tu proceso de sanación ",
    title: "Terapias virtuales y bienestar emocional ",
  },
  {
    phrase: "Apoyo a un click de distancia",
    smallPhrase:
      "Nuestras terapias virtuales te permiten cuidar de tu bienestar desde la comodidad de tu hogar cuando más lo necesites.",
    button: true,
    backgroundMobile: "/carruselImages/centro-psicologico-terapia-online.webp",
    backgroundDesktop: "/carruselImages/Escritorio-centro-psicologico-terapia-online.webp",
    alt: "Terapias virtuales para ti estés donde estés",
    title: "Tu bienestar a un click de distancia",
  },
  {
    phrase: "Tu bienestar emocional inicia aqui",
    smallPhrase:
      "Transforma tu vida con nuestras terapias diseñadas para ayudarte a sanar y crecer.",
    button: true,
    backgroundMobile: "/carruselImages/bienestar-mental-terapia-virtual.webp",
    backgroundDesktop: "/carruselImages/Escritorio-bienestar-mental-terapia-virtual.webp",
    alt: "Terapia online centro psicológico contigo voy, te ayudamos a sanar y crecer ",
    title: "Tu bienestar emocional es importante",
  },
  {
    phrase: "No dejemos que el silencio sea el enemigo",
    smallPhrase:
      "8 de cada 10 peruanos no reciben la atención mental que necesitan.",
    button: true,
    backgroundMobile: "/carruselImages/psicologo-en-linea-ayuda-emocional.webp",
    backgroundDesktop: "/carruselImages/psicologo-en-linea-ayuda-emocional.webp",
    alt: "La salud mental es importante, estamos aqui para escucharte",
    title: "No seas parte de la estadística, hablar es el primer paso",
  },
];

export default function MainSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({
      stopOnInteraction: false,
      delay: 4000, // 4 seconds
    }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (emblaApi) {
      const onSelect = () => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
      };

      emblaApi.on("select", onSelect);
      return () => {
        emblaApi.off("select", onSelect);
      };
    }
  }, [emblaApi]);

  const scrollTo = (index: number) => {
    if (emblaApi) {
      emblaApi.scrollTo(index);
    }
  };

  return (
    <div className="relative">
      <div
        className="embla"
        ref={emblaRef}
        role="region"
        aria-label="Carrusel de servicios"
      >
        <div className="embla__container">
          {sections.map((item, index) => (
            <div
              className="relative embla__slide overflow-hidden"
              key={`slide-${index}`}
              id={`slide-${index}`}
              role="tabpanel"
              aria-labelledby={`tab-${index}`}
            >
              <div className="bg-recursive-gradient absolute inset-0 z-0"></div>
              <div className="mix-blend-multiply z-10 absolute inset-0 bg-cover bg-white ">
                <div className="h-full w-vw flex-1 relative">
                  <picture>
                    {/* Imagen para desktop */}
                    <source
                      media="(min-width: 431px)"
                      srcSet={item.backgroundDesktop} 
                    />
                    {/* Imagen para móviles */}
                    <source
                      media="(max-width: 430px)"
                      srcSet={item.backgroundMobile} 
                    />

                    <Image
                      src={item.backgroundDesktop}
                      alt={item.alt}
                      title={item.title}
                      fill
                      className="object-cover object-right lg:object-cover lg:object-right sm:object-left transform translate-x-[15%] lg:translate-x-[0%]"
                      style={{
                        WebkitMaskImage:
                          "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
                        WebkitMaskRepeat: "no-repeat",
                        WebkitMaskSize: "cover",
                        maskImage:
                          "linear-gradient(to left, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
                        maskRepeat: "no-repeat",
                        maskSize: "cover",
                      }}
                      priority={index === 0}
                      fetchPriority={index === 0 ? "high" : "auto"}
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  </picture>
                </div>
              </div>

              {/* Texto y botón */}
              <div
                className="mx-auto relative max-w-scv18 w-full z-10 
                h-[450px] sm:h-[500px] lg:h-[570px] 
                flex items-center bg-left pl-[30px] pt-4"
              >
                <div className="my-scv6 h-full lg:h-[400px] flex flex-col ">
                  <div className="flex-[0.35] flex items-center lg:items-end">
                    <div
                      style={{
                        textShadow:
                          "4px 5px 16px rgba(0,0,0,0.35), 2px 2px 3px rgba(0,0,0,0.45)",
                      }}
                      className="mr-scv6 max-w-scv13 lg:max-w-scv14 text-cv8 lg:text-cv9 
                      leading-10 lg:leading-[60px] font-bold text-white"
                    >
                      {item.phrase}
                    </div>
                  </div>

                  <div className="flex-[0.45] flex items-center lg:items-start">
                    <AnimatePresence mode="wait">
                      {selectedIndex === index && (
                        <motion.div
                          key={`motion-${index}`}
                          initial={{ opacity: 0 }}
                          animate={{
                            opacity: 1,
                            transition: { duration: 1 },
                          }}
                          exit={{ opacity: 0 }}
                          style={{ willChange: "opacity" }}
                        >
                          <div
                            style={{
                              textShadow:
                                "4px 5px 16px rgba(0,0,0,0.55), 2px 2px 3px rgba(0,0,0,0.85)",
                            }}
                            className="mr-scv6 max-w-[50%] sm:max-w-scv14 
                            text-cv3 lg:text-cv5 text-white tracking-[2%]"
                          >
                            {item.smallPhrase}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {item.button && (
                    <div className="flex-[0.2] mt-5 flex items-start">
                      <Link href="/ReservarCita">
                        <Button
                          style={{
                            boxShadow:
                              "4px 5px 16px rgba(0,0,0,0.35), 2px 2px 3px rgba(0,0,0,0.45)",
                          }}
                          className="bg-[#634AE2] px-[25px] py-[10px] lg:p-6 
                          text-white rounded-[30px] hover:bg-purple-700 lg:text-cv6"
                        >
                          Reservar Cita
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botones de navegación */}
      <div className="lg:block hidden">
        <div
          className="absolute right-10 top-1/2 transform -translate-y-1/2 flex flex-col space-y-3"
          role="tablist"
          aria-label="Navegación del carrusel"
        >
          {sections.map((_, index) => (
            <button
              key={`nav-button-${index}`}
              id={`tab-${index}`}
              role="tab"
              aria-controls={`slide-${index}`}
              onClick={() => scrollTo(index)}
              aria-label={`Ir a la sección ${index + 1}: ${sections[index].phrase}`}
              aria-selected={selectedIndex === index ? "true" : "false"}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                selectedIndex === index ? "bg-[#634AE2]" : "bg-white"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}