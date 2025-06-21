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
        alt="Psicología online Beneficios Terapia en casa"
        width={70}
        height={60}
        className="w-[50px] mw:w-[70px]"
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
        alt="Psicología online Beneficios Elige a tu Psicologo"
        width={70}
        height={60}
        className="w-[50px] mw:w-[70px]"
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
        alt="Psicología online Beneficios tu terapia en línea"
        width={70}
        height={60}
        className="w-[50px] mw:w-[70px]"
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
        alt="Psicología online Beneficios elige tu horario ideal"
        width={70}
        height={60}
        className="w-[50px] mw:w-[70px]"
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
      duration: 40,
    },
    [
      Autoplay({
        stopOnInteraction: false,
        delay: 3000,
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
    <div className="w-full max-w-full flex flex-col items-center justify-center pt-8 pb-14  mw:pt-12 mw:pb-16 my-scv6 bg-large-gradient relative overflow-hidden">
      <div className="relative w-full max-w-scv18">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center pb-2 "
        >
          <h2 className="text-cv8 font-bold text-white lg:mb-scv3">
            ¿Qué es la psicología online?
          </h2>
          <p className="text-cv6 text-white mx-auto  lg:leading-[20px] mb-scv5  ">
            Es una forma accesible y eficaz de cuidar tu salud mental.
          </p>
        </motion.div>

        <div className="lg:block hidden">
          <div className="flex items-center">
            <div className="w-full md:w-2/3 flex pl-[30px] py-scv4">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 justify-between gap-y-scv8 w-full mx-auto md:mx-0"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.1 }}
                    className="group flex flex-col gap-y-scv4 w-full max-w-[315px]"
                  >
                    <div className="flex flex-col items-center justify-center w-40 h-40 rounded-full bg-[#9494F3] group-hover:bg-[#7863e3] group-hover:shadow-2xl transition-all duration-500 space-y-4">
                      <div className="p-4 bg-transparent rounded-full">
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="text-cv6 font-bold text-white tracking-normal">
                      <span className="block">{feature.title}</span>
                    </h3>
                    <p className="text-cv4 text-white justify-center  tracking-normal font-light md:mx-0">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            <div className="w-[500px] md:w-1/3">
              <div ref={emblaRef}>
                <div className="embla__container  ">
                  {features.map((item, index) => (
                    <div className="embla__slide " key={index}>
                      <div
                        className="h-[800px] w-[500px]  bg-full rounded-l-full mask-all-fade"
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
        
      </div>
    </div>
  );
}
