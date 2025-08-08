"use client";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ReactSVG } from "react-svg";

const features = [
  {
    icon: (
      <ReactSVG
        src={"/ImgsInicio/ImgsPsicoOnline/terapiaonline.svg"}
        title="Terapia en casa Online Contigo Voy"
        className="w-[110px]"
        beforeInjection={(svg) => {
          svg.classList.add("fill-gray-300");
        }}
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
      <ReactSVG
        src={"/ImgsInicio/ImgsPsicoOnline/listapsicologo.svg"}
        title="Elige a tu Psicólogo Contigo Voy Terapia Psicológica"
        beforeInjection={(svg) => {
          svg.classList.add("fill-gray-300");
        }}
        className="w-[110px]"
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
      <ReactSVG
        src={"/ImgsInicio/ImgsPsicoOnline/terapiaencasa.svg"}
        title="Elige tu terapia en línea - Terapia Psicológica Online"
        beforeInjection={(svg) => {
          svg.classList.add("fill-gray-300");
        }}
        className="w-[90px]"
      />
    ),
    title: "Elige tu terapia en línea - Terapia Psicológica Online",
    description:
      "Conéctate a tu consulta psicológica a través de contigo voy y empieza tu proceso terapéutico.",
    background:
      "/CarruselInferiorMain/guia-para-terapia-psicologica-online.webp",
  },
  {
    icon: (
      <ReactSVG
        src={"/ImgsInicio/ImgsPsicoOnline/agendahorario.svg"}
        title="Horario ideal - Terapia Psicológica Online"
        beforeInjection={(svg) => {
          svg.classList.add("fill-gray-300");
        }}
        className="w-[90px]"
      />
    ),
    title: "Horario ideal - Terapia Psicológica Online",
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

export default function ChooseUs() {
  
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      skipSnaps: true,
      duration: 10,
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

  const [isLg, setLg] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(()=>{
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleResize = () => setLg(mediaQuery.matches);
    handleResize(); 
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  },[])

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
    <div className="w-full max-w-full flex flex-col items-center justify-center pt-8 pb-14 mw:pt-12 mw:pb-16 my-scv6 bg-large-gradient relative overflow-hidden">
      <div className="relative w-full pb-14">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center pb-2 "
        >
          <h2 className="text-cv5 sm:text-cv7 font-bold text-white lg:mb-scv3">
            ¿Qué es la psicología online?
          </h2>
          <p className="text-cv3 px-[30px] sm:text-cv5 text-white mx-auto  lg:leading-[20px] mb-scv5  ">
            Es una forma accesible y eficaz de cuidar tu salud mental.
          </p>
        </motion.div>

        {/**contenido para pantallas pequeñas*/}
        <div className="block lg:hidden w-full">
          <div className="flex flex-col ">

            {!isLg && 
            <div className="embla" ref={emblaRef}>
              <div className="embla__container">
                {features.map((feature, index) => (
                  <div className="grid max-sm:grid-cols-2 grid-cols-2 max-sm:gap-x-4 sm:gap-x-0 embla__slide" key={index}>
                    <div className="flex-1 md:pl-40">
                        <div className="flex flex-col justify-center p-6">
                          <div className="flex flex-col items-center justify-center w-28 h-28 rounded-full bg-[#9494F3] backdrop-blur-sm transition-all duration-300">
                            <div className="bg-transparent rounded-full transition-colors duration-300 w-[75px] flex justify-center items-center">
                              {feature.icon}
                            </div>
                          </div>
                        </div>
                        <h3 className="text-cv4 font-bold text-white tracking-normal pb-3 ml-5 mr-3 leading-5">
                          <span className="block">{feature.title}</span>
                        </h3>
                        <p className="hidden lg:block text-cv3 leading-[20px] text-white justify-center tracking-normal font-light ml-5 mr-3">
                          {feature.description}
                        </p>
                    </div>
                    <div className="flex-1 relative w-full ">
                      <Image
                        src={feature.background}
                        alt={feature.description}
                        title={feature.title}
                        fill
                        className="mask-all-fade  object-contain object-right"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            }
      
            <div className="flex mx-auto space-x-2 mt-scv6 ">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  aria-label={`Ir a la sección ${index + 1}`}
                  className={`
                    w-3 h-3 rounded-full transition-all duration-300 
                    ${selectedIndex === index ? "bg-[#9494F3]" : "bg-white"}
                  `}
                />
              ))}
            </div>
          
          </div>
        </div>

        <div className="lg:block hidden w-full">
          <div className="flex w-full relative justify-center max-2xl:justify-start">
            <div className="w-full md:w-2/3 flex pl-[30px] py-scv4 max-w-[800px] 2xl:mr-20">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 justify-between gap-y-scv8 w-full mx-auto md:mx-0 "
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="group flex flex-col gap-y-scv4 w-full max-w-[315px]"
                  >
                    <div className="flex flex-col items-center justify-center w-40 h-40 rounded-full bg-[#9494F3] space-y-4">
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
            <div className=" md:w-1/3 min-w-[500px] max-w-[500px] absolute right-0">
              {isLg && 
                <div ref={emblaRef}>
                  <div className="embla__container  ">
                    {features.map((item, index) => (
                      <div className="embla__slide " key={index}>
                        <div
                          className="h-[800px] max-w-[500px] rounded-l-full mask-all-fade"
                          style={{
                            backgroundImage: `url(${item.background})`,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
        
      </div>
      
    </div>
  );
}
