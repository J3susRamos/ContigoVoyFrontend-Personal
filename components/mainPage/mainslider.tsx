"use client";
import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { AnimatePresence, motion } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { Button } from "@heroui/react";
import Link from "next/link";

interface SliderSection {
  phrase: string;
  smallPhrase: string;
  button: boolean;
  background: string;
}

const sections: SliderSection[] = [
  {
    phrase: "Estamos contigo y para ti ",
    smallPhrase:
      "Con nuestras terapias virtuales, transformamos tu vida y te acompañamos en cada paso de tu camino hacia la sanación.",
    button: true,
    background: "/carruselImages/salud-mental-terapia-virtual.webp",
  },
  {
    phrase: "Apoyo a un click de distancia",
    smallPhrase:
      "Nuestras terapias virtuales te permiten cuidar de tu bienestar desde la comodidad de tu hogar cuando más lo necesites.",
    button: true,
    background: "/carruselImages/centro-psicologico-terapia-online.webp",
  },
  {
    phrase: "Tu bienestar emocional inicia aqui",
    smallPhrase:
      "Transforma tu vida con nuestras terapias diseñadas para ayudarte a sanar y crecer.",
    button: true,
    background: "/carruselImages/bienestar-mental-terapia-virtual.webp",
  },
  {
    phrase: "No dejemos que el silencio sea el enemigo",
    smallPhrase:
      "8 de cada 10 peruanos no reciben la atención mental que necesitan.",
    button: true,
    background: "/carruselImages/psicologo-en-linea-ayuda-emocional.webp",
  },
];

export default function MainSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({
      stopOnInteraction: false,
      delay: 4000,
    }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("select", () => {
        const currentIndex = emblaApi.selectedScrollSnap();
        setSelectedIndex(currentIndex);
      });
    }
  }, [emblaApi]);

  const scrollTo = (index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  };

  return (
    <div className="relative ">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {sections.map((item, index) => (
            <div className="relative embla__slide overflow-hidden" key={index}>
              <div className="bg-recursive-gradient absolute inset-0 z-0"></div>
              <div className=" mix-blend-multiply z-10 absolute inset-0 bg-cover bg-right -right-scv7" style={{
                  backgroundImage: `url(${item.background})`,
                }}>

              </div>
              <div
                className="relative  z-10 lg:h-[650px]  min-h-[340px] w-full md:pt-0 bg-cover flex items-center lg:bg-center bg-right vg-left lg:pl-[79px] pl-[30px]  custom-bg-position"
              >
                <div className="isolation my-scv6">
                  <div
                    style={{textShadow: '4px 5px 16px rgba(0,0,0,0.35), 2px 2px 3px rgba(0,0,0,0.45)'}}
                    className="mr-scv6 max-w-scv13 lg:h-20 lg:mb-24 text-cv8 leading-10 font-bold text-white sm:text-[36px] lg:text-[62px] sm:leading-[42px] lg:leading-[77.5px] mt-13"
                    dangerouslySetInnerHTML={{
                      __html: item.phrase,
                    }}
                  />
                  <AnimatePresence mode="wait">
                    {selectedIndex === index && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: 1,
                          transition: { duration: 1 },
                        }}
                        exit={{ opacity: 0 }}
                      >
                        <div
                          style={{textShadow: '4px 5px 16px rgba(0,0,0,0.55), 2px 2px 3px rgba(0,0,0,0.85)'}}
                          className="mr-scv6 max-w-scv14 font-lexend text-cv3 text-white lg:font-normal min-[350px]:text-[13px] font-light lg:text-[20px]  xl:leading-[px]  tracking-[2%]  sm:text-base lg:pb-14 lg:text-xl my-3 mb-6"
                          dangerouslySetInnerHTML={{
                            __html: item.smallPhrase,
                          }}
                        />
                        
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className="relative block">
                    <Link href="/ReservarCita">
                      <Button style={{boxShadow: '4px 5px 16px rgba(0,0,0,0.35), 2px 2px 3px rgba(0,0,0,0.45)'}} className="bg-[#634AE2] px-[25px] py-[10px] lg:p-6 text-white rounded-[30px] hover:bg-purple-700 lg:text-[20px]">
                        Reservar Cita
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Navigation */}
      <div className="lg:block hidden">
        <div className="absolute right-10 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
          {sections.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              aria-label={`Ir a la sección ${index + 1}`}
              className={`
            w-3 h-3 rounded-full transition-all duration-300
            ${selectedIndex === index ? "bg-[#634AE2]" : "bg-white"}
          `}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
