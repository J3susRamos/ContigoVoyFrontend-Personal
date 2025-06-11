"use client";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

const features = [
  {
    icon: (
      <Image
        src={"/OnlinePsychologyImages/terapiaonline.webp"}
        alt="especialista"
        width={70}
        height={60}
      />
    ),
    title: "Recibe terapia en casa",
    description:
      "Accede a sesiones por videollamada o llamada disfrutando de la comodidad de tu hogar.",
    background:
      "/CarruselInferiorMain/psicologia-online-paso-a-paso-Señora-sonriendo.webp",
  },
  {
    icon: (
      <Image
        src={"/OnlinePsychologyImages/listapsicologo.webp"}
        alt="especialista"
        width={70}
        height={60}
      />
    ),
    title: "Elige a tu psicólogo",
    description:
      "Te asignamos un psicólogo colegiado que te guiará en cada sesión, con técnicas efectivas para tus necesidades.",

    background:
      "/CarruselInferiorMain/terapia-online-facil-y-rapida-Joven.webp",
  },
  {
    icon: (
      <Image
        src={"/OnlinePsychologyImages/terapiaencasa.webp"}
        alt="especialista"
        width={70}
        height={60}
      />
    ),
    title: "Inicia tu terapia en línea",
    description:
      "Conéctate a tu consulta psicológica a través de contigo voy y empieza tu proceso terapéutico.",
    background:
      "/CarruselInferiorMain/guia-para-terapia-psicologica-online.webp",
  },
  {
    icon: (
      <Image
        src={"/OnlinePsychologyImages/agendahorario.webp"}
        alt="especialista"
        width={70}
        height={60}
      />
    ),
    title: "Agenda tu horario ideal",
    description:
      "Programa tus sesiones en el día y la hora que mejor se ajusten a tu rutina.",
    background:
      "/CarruselInferiorMain/como-es-una-terapia-psicologica-virtual.webp",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

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
        delay: 4000,
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
    <div className="w-full max-w-full flex flex-col items-center justify-center py-16 my-4 bg-[#9494f3] relative overflow-hidden">
      <div className="relative w-full max-w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center "
        >
          <h2 className="lg:text-[32px] text-2xl leading-[40px] font-bold text-white lg:mb-6 mb-3">
            ¿Qué es la psicología online?
          </h2>
          <p className="text-[16px] text-white max-w-3xl lg:mx-auto font-light lg:leading-[20px] mx-20 ">
            Es una forma accesible y eficaz de cuidar tu salud mental.
          </p>
        </motion.div>

        {/*contenido para pantallas pequeñas*/}
        <div className="lg:block hidden">
          <div className="flex flex-col items-center xl:items-end xl:flex-row">
            <div className="w-full md:w-2/3  justify-center flex">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-x-60 gap-y-20 w-fit max-w-2xl mx-auto md:mx-0"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    className="group flex flex-col items-center mt-14 xl:items-start xl:ml-10  text-center md:text-left w-full"
                  >
                    <div className="flex flex-col items-center justify-center w-40 h-40 rounded-full bg-[#634AE2] backdrop-blur-sm transition-all duration-300 cursor-pointer space-y-4">
                      <div className="p-4 bg-[#634AE2] rounded-full group-hover:bg-[#9494F3] transition-colors duration-300">
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="text-[18px] pt-5 leading-[22.5px] font-bold text-white   tracking-normal pb-3">
                      <span className="block">{feature.title}</span>
                    </h3>
                    <p className="text-[16px] leading-[20px] text-white justify-center  tracking-normal font-light md:mx-0">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            <div className="mitad w-[500px] hidden xl:block md:w-1/3">
              <div className="transform translate-x-1/4 " ref={emblaRef}>
                <div className="embla__container  ">
                  {features.map((item, index) => (
                    <div className="embla__slide " key={index}>
                      <div
                        className="h-[800px] w-[500px]  bg-full rounded-l-full"
                        style={{
                          backgroundImage: `url(${item.background})`,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/**contenido para pantallas pequeñas*/}
        <div className="block lg:hidden w-full">
          <div className="grid grid-cols-2 ">

            {/* Columna izquierda: Carrusel de iconos */}
            <div className="col-span-1">
              <div className="embla" ref={emblaRef}>
                <div className="embla__container">
                  {features.map((feature, index) => (
                    <div className="embla__slide" key={index}>
                      <div className="flex flex-col items-center justify-center p-6">
                        <div className="flex flex-col items-center justify-center w-28 h-28 rounded-full bg-[#634AE2] backdrop-blur-sm transition-all duration-300 cursor-pointer">
                          <div className="bg-[#634AE2] rounded-full group-hover:bg-[#9494F3] transition-colors duration-300 w-14">
                            {feature.icon}
                          </div>
                        </div>
                      </div>
                      <h3 className="text-[13px] font-bold text-white tracking-normal pb-3 mx-5">
                        <span className="block">{feature.title}</span>
                      </h3>
                      <p className="text-[13px] leading-[20px] text-white justify-center tracking-normal font-light mx-5">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

        
              <div className="flex justify-center space-x-2 mt-6">
                {features.map((_, index) => (
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

            {/* Columna derecha: Imagen */}
            <div className="col-span-1">
              <div
                className=" h-[345px] -mr-10 md:-mr-0 bg-cover bg-center bg-no-repeat rounded-lg"
                style={{
                  backgroundImage: `url(/mediaLunaInicio.webp)`,
                  backgroundSize: "auto",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
