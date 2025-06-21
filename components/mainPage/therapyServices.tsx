"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function TherapyServices() {
  const router = useRouter();
  const services = [
    {
      id: "/terapia/infantes",
      icon: "/imagesTherapy/childTherapy.webp",
      alt: "Servicio Terapia Psicológica para Niños Contigo Voy Online",
      title: "Terapia <br/> para niños",
    },
    {
      id: "/terapia/adolescentes",
      icon: "/imagesTherapy/TeenTherapy.webp",
      alt: "Servicio Terapia Psicológica para Adolescentes Contigo Voy Online",
      title: "Terapia<br/> para adolescentes",
    },
    {
      id: "/terapia/parejas",
      icon: "/imagesTherapy/coupleTherapy.webp",
      alt: "Servicio Terapia Psicológica para Pareja Contigo Voy Online",
      title: "Terapia<br/> de parejas",
    },
    {
      id: "/terapia/adultos",
      icon: "/imagesTherapy/adultTherapy.webp",
      alt: "Servicio Terapia Psicológica para Adultos Contigo Voy Online",
      title: "Terapia<br/> para adultos",
    },
    {
      id: "/terapia/familia",
      icon: "/imagesTherapy/familyTherapy.webp",
      alt: "Servicio Terapia Psicológica Para Familias Contigo Voy Online",
      title: "Terapia<br/> familiar",
    },
    {
      id: "/terapia/familia",
      icon: "/imagesTherapy/familyTherapy.webp",
      alt: "Servicio Terapia Psicológica para Empresas Contigo Voy Online",
      title: "Terapia<br/> empresarial",
    },
  ];

  return (
    <>
      <div className="max-w-full px-0 mb-4 mx-auto lg:py-16 ">
        <motion.h2
          className="lg:text-4xl  text-2xl font-bold mt-[65px] text-center text-title lg:mb-16 mb-7"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Servicios
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-2">
          <div className="lg:block hidden w-full max-w-[1230px] mx-auto">
            <div className=" flex gap-[3px] md:flex-row flex-col">
              {services.slice(0, 3).map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex-1 bg-[#634AE2] p-3 text-white duration-400 flex flex-col
            hover:flex-[1.2] hover:shadow-[0_7px_29px_0px_rgba(99,74,226,0.2)]
            md:w-auto w-full md:hover:flex-[1.2]"
                >
                  <div className="flex flex-col items-end mb-[25px]">
                    <Image
                      src={service.icon}
                      alt={service.alt}
                      width={63}
                      height={63}
                    />
                  </div>
                  <h3
                    className="mt-3 mb-[46px] text-xl font-bold"
                    dangerouslySetInnerHTML={{ __html: service.title }}
                  />

                  <div className="flex flex-col items-end mt-auto mb-5">
                    <button
                      onClick={() => router.push(`/servicios${service.id}`)}
                      className="group flex items-center space-x-2 text-sm hover:text-purple-200 transition-colors"
                    >
                      <span className="relative group">
                        Ver más
                        <span className="absolute bottom-0 left-0 w-0 transition-all h-0.5 bg-white group-hover:w-full duration-500"></span>
                      </span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className=" flex gap-[3px] md:flex-row flex-col pt-2">
              {services.slice(3).map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex-1 bg-[#634AE2] p-3 text-white duration-400 flex flex-col
            hover:flex-[1.2] hover:shadow-[0_7px_29px_0px_rgba(99,74,226,0.2)]
            md:w-auto w-full md:hover:flex-[1.2] "
                >
                  <div className="flex flex-col items-end mb-[25px]">
                    <Image
                      src={service.icon}
                      alt={service.alt}
                      width={63}
                      height={63}
                    />
                  </div>
                  <h3
                    className="mt-3 mb-[46px] text-xl font-bold"
                    dangerouslySetInnerHTML={{ __html: service.title }}
                  />
                  <div className="flex flex-col items-end mt-auto mb-5">
                    <button
                      onClick={() => router.push(`/servicios${service.id}`)}
                      className="group flex items-center space-x-2 text-sm hover:text-purple-200 transition-colors"
                    >
                      <span className="relative group">
                        Ver más
                        <span className="absolute bottom-0 left-0 w-0 transition-all h-0.5 bg-white group-hover:w-full duration-500"></span>
                      </span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className=" justify-center hidden lg:block items-start mt-6 ">
            <Image
              src="/FOTOACEPTADA1.webp"
              alt="Servicio Terapia Psicológica Contigo Voy Online"
              width={500}
              height={400}
            />
          </div>
        </div>

        {/* solo se muestra en tamaños pequeños */}
        <div className="block lg:hidden">
          <div className="grid grid-cols-2 gap-1 m-3 ">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`bg-[#634AE2] p-3 text-white duration-400 flex flex-col rounded-2xl
              hover:shadow-[0_7px_29px_0px_rgba(99,74,226,0.2)]
              ${
                services.length % 2 !== 0 && index === services.length - 1
                  ? "col-span-2"
                  : ""
              }`}
              >
                <div className="flex flex-col items-end mb-4">
                  <Image
                    src={service.icon}
                    alt={service.title}
                    width={63}
                    height={63}
                  />
                </div>
                <h3 className="mt-3 mb-4 text-xl font-bold" 
                dangerouslySetInnerHTML={{ __html: service.title }}
                />
                <div className="flex flex-col items-end mt-auto mb-5">
                  <button
                    onClick={() => router.push(`/servicios${service.id}`)}
                    className="group flex items-center space-x-2 text-sm hover:text-purple-200 transition-colors"
                  >
                    <span className="relative group">
                      Ver más
                      <span className="absolute bottom-0 left-0 w-0 transition-all h-0.5 bg-white group-hover:w-full duration-500"></span>
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
           
          </div>
          <div className=" justify-center block md:hidden mx-auto mt-6 ">
              <Image
              className="mx-auto mask-fade-bottom"
                src="/FOTOACEPTADA1.webp"
                alt="Servicio Terapia Psicológica Contigo Voy Online"
                width={400}
                height={500}
              />
            </div>
        </div>
      </div>
    </>
  );
}
