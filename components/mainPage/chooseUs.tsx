"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { ReactSVG } from "react-svg";


const features = [
  {
    icon: (
      <ReactSVG
        className="sm:p-6 bg-transparent rounded-full"
        src={"/ImgsInicio/ImgsElegirnos/especialistas.svg"}
        title="Especialistas Contigo Voy Terapia online"
        beforeInjection={(svg) => {
          svg.classList.add("stroke-gray-200");
        }}
      />
    ),
    title: "Especialistas colegiados",
  },
  {
    icon: (
      <ReactSVG
        className="sm:p-8 bg-transparent rounded-full"
        src={"/ImgsInicio/ImgsElegirnos/atencionvirtual.svg"}
        title="Atención virtual Contigo Voy Terapia online"
        beforeInjection={(svg) => {
          svg.classList.add("fill-gray-300");
        }}
      />
    ),
    title: "Atención virtual",
  },
  {
    icon: (
      <ReactSVG
        className="sm:p-8 bg-transparent rounded-full"
        src={"/ImgsInicio/ImgsElegirnos/etica.svg"}
        title="Ética y Confiabilidad Contigo Voy Centro Psicológico"
        beforeInjection={(svg) => {
          svg.classList.add("fill-gray-300");
        }}
      />
    ),
    title: "Ética y confiabilidad",
  },
  {
    icon: (
      <ReactSVG
        className="sm:p-8 bg-transparent rounded-full"
        src={"/ImgsInicio/ImgsElegirnos/horarios.svg"}
        title="Atención virtual Contigo Voy Terapia Psicológica"
        beforeInjection={(svg) => {
          svg.classList.add("fill-gray-300");
        }}
      />
    ),
    title: "Horarios flexibles",
  },
  {
    icon: (
      <ReactSVG
        className="sm:p-8 bg-transparent rounded-full"
        src={"/ImgsInicio/ImgsElegirnos/costos.svg"}
        title="Costos Accesibles Contigo Voy Terapia Online"
        beforeInjection={(svg) => {
          svg.classList.add("fill-gray-300");
        }}
      />
    ),
    title: "Costos accesibles",
  },
  {
    icon: (
      <ReactSVG
        className="sm:p-5 bg-transparent rounded-full"
        src={"/ImgsInicio/ImgsElegirnos/confidencialidad.svg"}
        title="Confidencialidad Contigo Voy Centro Psicológico"
        beforeInjection={(svg) => {
          svg.classList.add("fill-gray-300");
        }}
      />
    ),
    title: "Confidencialidad",
  },
];

export default function ChooseUs() {
  

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
    <div className="w-full flex flex-col items-center justify-center pb-scv9 dark:bg-gray-900 bg-white-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-scv7"
      >
        <h2 className="text-cv5 sm:text-cv7 font-bold text-title lg:mb-scv3">
          ¿Por qué elegirnos?
        </h2>
        <p className="hidden sm:block text-cv3 sm:text-cv5 px-[30px] max-w-[800px] mx-auto leading-relaxed text-[#634AE2]">
          En Contigo Voy, te ofrecemos atención psicológica online que se adapta
          a ti, brindándote el apoyo necesario para afrontar los desafíos
          diarios con mayor fortaleza y equilibrio emocional.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:hidden w-full gap-x-scv2">
        <div className="h-full aspect-square rounded-full overflow-hidden bg-slate-300 -ml-scv11">
          <div className="flex-1 relative w-full h-full ml-scv8 ">
            <Image
              src={"psicologaFinale.webp"}
              alt={"atención psicológica online que se adapta ti"}
              title="Atención Psicológica Online para ti"
              fill
              className="objet-cover"
              priority 
              sizes="(max-width: 768px) 100vw, 50vw"
              
            />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center mr-[15px] py-scv7">
          <div className="embla w-full" ref={emblaRef}>
            <div className="embla__container ">
              {features.map((feature, index) => (
                <div className="flex max-w-[550px] embla__slide " key={index}>
                  <div className="flex-1 flex flex-col items-center gap-y-scv4">
                    <div className="flex flex-col items-center justify-center w-28 h-28 rounded-full bg-[#634AE2] backdrop-blur-sm transition-all duration-300">
                      <div className="bg-transparent rounded-full  transition-colors duration-300 w-16">
                        {feature.icon}
                      </div>
                    </div>

                    <h3 className="text-cv4 font-bold text-center tracking-normal text-[#634AE2] pb-3 leading-5">
                      {feature.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex mx-auto space-x-2 mt-scv7 ">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                aria-label={`Ir a ${features[index].title}`} // ← Agregar esto
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  selectedIndex === index ? "bg-[#634AE2]" : "bg-[#9494F3]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="sm:block hidden w-full max-w-scv18 px-[30px]">
        <div className="flex flex-wrap justify-center gap-x-scv10 gap-y-scv8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group w-scv11 flex flex-col items-center"
            >
              <div className="flex flex-col items-center justify-center w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-[#634AE2]  duration-500 space-y-4">
                {feature.icon}
              </div>
              <h3 className="text-center text-cv6 leading-7   text-title mt-3">
                {feature.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
