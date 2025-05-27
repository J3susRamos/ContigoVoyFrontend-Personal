"use client";
import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { AnimatePresence, motion } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";

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
    phrase: "Estamos contigo <br> y para ti ",
    smallPhrase:
      "Con nuestras terapias virtuales, transformamos <br> tu vida y te acompañamos en cada paso de tu <br> camino hacia la sanación.",
    button: true,
    background: "/carruselImages/salud-mental-terapia-virtual.webp",
  },
  {
    phrase: "Apoyo a un <br> click de distancia",
    smallPhrase:
      "Nuestras terapias virtuales te permiten cuidar <br> de tu bienestar desde la comodidad de tu <br>hogar cuando más lo necesites.",
    button: true,
    background: "/carruselImages/centro-psicologico-terapia-online.webp",
  },
  {
    phrase: "Tu bienestar emocional <br> inicia aqui",
    smallPhrase:
      "Transforma tu vida con nuestras <br> terapias diseñadas para ayudarte <br> a sanar y crecer.",
    button: true,
    background: "/carruselImages/bienestar-mental-terapia-virtual.webp",
  },
  {
    phrase: "No dejemos que el <br> silencio sea el enemigo",
    smallPhrase:
      "8 de cada 10 peruanos no reciben <br> la atención mental que necesitan. <br>",
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
            <div className="embla__slide" key={index}>
              <div
                className="lg:h-[650px] h-[340px] pt-56 w-full md:pt-0 bg-cover flex items-center lg:bg-center bg-right vg-left lg:pl-[79px] pl-[30px] custom-bg-position"
                style={{
                  backgroundImage: `linear-gradient(to right,rgba(120, 99, 227, 0.64), rgba(99, 74, 226, 0.48)),url(${item.background})`,
                }}
              >
                <div>
                  <AnimatePresence mode="wait">
                    {selectedIndex === index && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: 1,
                          transition: { duration: 3 },
                        }}
                        exit={{ opacity: 0 }}
                      >
                        <div
                          className="lg:h-20  lg:mb-24 font-bold  text-white lg:text-[62px] text-[25px] lg:leading-[77.5px] mt-13 leading-7"
                          dangerouslySetInnerHTML={{
                            __html: item.phrase,
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div
                    className="font-lexend text-white lg:font-normal  font-light lg:text-[20px] text-[13px] xl:leading-[px]  tracking-[2%] text-sm sm:text-base md:text-lg lg:pb-14 lg:text-xl my-2 mb-6"
                    dangerouslySetInnerHTML={{
                      __html: item.smallPhrase,
                    }}
                  />
                  <div className="relative hidden lg:block">
                  <Link href="/ReservarCita">
                    <Button className="bg-[#634AE2]  max-w-[188px] lg:p-6 text-white rounded-[30px] hover:bg-purple-700">
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
