"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";

export default function ChooseUs() {
  const features = [
    {
      icon: (
        <Image
          src={"/ChooseUsImages/especialistas.webp"}
          alt="especialista"
          width={70}
          height={60}
        />
      ),
      title: "Especialistas colegiados",
    },
    {
      icon: (
        <Image
          src="/ChooseUsImages/atencionvirtual.webp"
          alt="Atención virtual"
          width={70}
          height={60}
        />
      ),
      title: "Atención virtual",
    },
    {
      icon: (
        <Image
          src="/ChooseUsImages/etica.webp"
          alt="Ética y confiabilidad"
          width={70}
          height={60}
        />
      ),
      title: "Ética y confiabilidad",
    },
    {
      icon: (
        <Image
          src="/ChooseUsImages/horarios.webp"
          alt="Horarios flexibles"
          width={70}
          height={60}
        />
      ),
      title: "Horarios flexibles",
    },
    {
      icon: (
        <Image
          src="/ChooseUsImages/costos.webp"
          alt="Costos accesibles"
          width={70}
          height={60}
        />
      ),
      title: "Costos accesibles",
    },
    {
      icon: (
        <Image
          src="/ChooseUsImages/confidencialidad.webp"
          alt="Confidencialidad"
          width={70}
          height={60}
        />
      ),
      title: "Confidencialidad",
    },
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      skipSnaps: true,
      duration: 0,
    },
    [
      Autoplay({
        stopOnInteraction: false,
        delay: 2000,
      }),
      Fade({
        active: true,
      }),
    ]
  );

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
    <div className="w-full flex flex-col items-center justify-center lg:pb-24 pb-10 bg-background mt-16">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center lg:mb-12"
      >
        <h2 className="lg:text-4xl font-bold text-title mb-5 text-2xl">
          ¿Por qué elegirnos?
        </h2>
        <p className="lg:text-title text-base mb-5 lg:w-[643px] w-[400px] mx-auto leading-relaxed text-[#634AE2]">
          En Contigo Voy, te ofrecemos atención psicológica online que se adapta
          a ti, brindándote el apoyo necesario para afrontar los desafíos
          diarios con mayor fortaleza y equilibrio emocional.
        </p>
      </motion.div>

      <div className="lg:block hidden w-full">
        <div className="grid grid-cols-3">
          {/* Columna 1: Imagen (ocupa solo 1 columna) */}
          <div className="col-span-1 flex items-center justify-end">
            <div
              className="w-[600px] mask-fade-bottom h-[500px] bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(./psicologaFinale.webp)`,
                backgroundSize: "cover",
                
              }}
            />
          </div>

          {/* Columnas 2-3: Esferas (ocupan 2 columnas) */}
          <div className="col-span-2">
            <div className="flex flex-col gap-16">
              {/* Primera fila - 3 esferas arriba */}
              <div className="flex justify-around">
                {features.slice(0, 3).map((feature, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="group"
                  >
                    <div className="flex flex-col items-center justify-center w-40 h-40 rounded-full bg-[#634AE2] backdrop-blur-sm transition-all duration-300 cursor-pointer">
                      <div className="p-4 bg-[#634AE2] rounded-full group-hover:bg-[#9494F3] transition-colors duration-300">
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="text-center text-lg w-40 font-semibold text-title mt-3">
                      {feature.title}
                    </h3>
                  </motion.div>
                ))}
              </div>

              {/* Segunda fila - 3 esferas abajo */}
              <div className="flex justify-around">
                {features.slice(3, 6).map((feature, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="group"
                  >
                    <div className="flex flex-col items-center justify-center w-40 h-40 rounded-full bg-[#634AE2] backdrop-blur-sm transition-all duration-300 cursor-pointer shadow-lg">
                      <div className="p-4 bg-[#634AE2] rounded-full group-hover:bg-[#9494F3] transition-colors duration-300">
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="text-center text-lg w-40 font-semibold text-title mt-3">
                      {feature.title}
                    </h3>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Contenido para pantallas pequeñas */}
      <div className="block lg:hidden w-full">
        <div className="grid grid-cols-2 gap-1">
          <div className="col-span-1 flex items-center">
            <div
              className="w-[345px] h-[405px] -ml-5 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(/psicologaFinale.webp)`,
                backgroundSize: "cover",
              }}
            />
          </div>

          {/* Columna derecha: Carrusel */}
          <div className="col-span-1">
            <div className="embla" ref={emblaRef}>
              <div className="embla__container">
                {features.map((feature, index) => (
                  <div className="embla__slide" key={index}>
                    <div className="flex flex-col items-center justify-center p-6 mt-14">
                      <div className="flex flex-col items-center justify-center w-28 h-28 rounded-full bg-[#634AE2] backdrop-blur-sm transition-all duration-300 cursor-pointer opacity-70">
                        <div className="bg-[#634AE2] rounded-full group-hover:bg-[#9494F3] transition-colors duration-300 w-14">
                          {feature.icon}
                        </div>
                      </div>
                      <h3 className="text-center text-lg font-semibold text-title mt-4">
                        {feature.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots Navigation */}
            <div className="flex justify-center mt-4 space-x-2">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  aria-label={`Ir a la sección ${index + 1}`}
                  className={`
              w-3 h-3 rounded-full transition-all duration-300
              ${selectedIndex === index ? "bg-[#634AE2]" : "bg-[#9494F3]"}
            `}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
