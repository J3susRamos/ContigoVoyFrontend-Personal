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
      name: "Terapia psicológica para Niños",
      title: "Terapia para niños",
    },
    {
      id: "/terapia/adolescentes",
      icon: "/imagesTherapy/TeenTherapy.webp",
      alt: "Servicio Terapia Psicológica para Adolescentes Contigo Voy Online",
      name: "Terapia psicológica para Adolescentes",
      title: "Terapia para adolescentes",
    },
    {
      id: "/terapia/parejas",
      icon: "/imagesTherapy/coupleTherapy.webp",
      alt: "Servicio Terapia Psicológica para Pareja Contigo Voy Online",
      name: "Terapia psicológica para Parejas",
      title: "Terapia de parejas",
    },
    {
      id: "/terapia/adultos",
      icon: "/imagesTherapy/adultTherapy.webp",
      alt: "Servicio Terapia Psicológica para Adultos Contigo Voy Online",
      name: "Terapia Psicológica Adultos",
      title: "Terapia para adultos",
    },
    {
      id: "/terapia/familia",
      icon: "/imagesTherapy/familyTherapy.webp",
      alt: "Servicio Terapia Psicológica Para Familias Contigo Voy Online",
      name: "Terapia Psicológica Familiar",
      title: "Terapia familiar",
    },
    {
      id: "/terapia/empresarial",
      icon: "/imagesTherapy/familyTherapy.webp",
      alt: "Servicio Terapia Psicológica para Empresas Contigo Voy Online",
      name: "Terapia Psicología Empresarial",
      title: "Terapia empresarial",
    },
  ];

  return (
    <>
      <div className="max-w-full px-0 mb-scv9 mx-auto ">
        <motion.h2
          className="text-cv5 sm:text-cv7 font-bold mt-scv7 sm:mt-scv9 text-center text-title lg:mb-8 mb-7"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Servicios
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-2">
          <div className="w-full max-w-scv18 mx-auto">
            <div className=" flex flex-wrap gap-1 px-scv2 sm:px-0 sm:pl-[30px]">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex-1 min-w-scv12 sm:min-w-scv11 lg:min-w-scv12 bg-[#745DEA] p-3 text-white duration-400 flex flex-col
            hover:flex-[1.2] hover:shadow-[0_7px_29px_0px_rgba(99,74,226,0.2)]
            md:w-auto w-full md:hover:flex-[1.2] rounded-3xl sm:rounded-none"
                >
                  <div className="pl-scv3 flex gap-x-scv3 items-center sm:block">
                    <div className="flex flex-col items-end mb-[25px] mt-scv4 mr-scv4">
                      <Image
                        src={service.icon}
                        alt={service.alt}
                        title={service.name}
                        width={63}
                        height={63}
                      />
                    </div>

                    <h3
                      className="mt-2 mb-scv5 max-w-scv8 text-cv4 sm:text-cv6 font-bold"
                      dangerouslySetInnerHTML={{ __html: service.title }}
                    />
                  </div>

                  <div className="flex flex-col items-end mt-auto mb-5">
                    <button
                      onClick={() => router.push(`/servicios${service.id}`)}
                      className="group flex items-center space-x-2 text-sm hover:text-purple-200 transition-colors"
                    >
                      <span className="relative group text-cv3 sm:text-cv4 ">
                        Ver más
                        <span className="absolute bottom-0 left-0 w-0 transition-all h-0.5 bg-white group-hover:w-full duration-500"></span>
                      </span>
                      <ArrowRight
                        strokeWidth={4}
                        className="w-10 group-hover:translate-x-1 transition-transform"
                      />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className=" justify-center hidden  items-start mt-6 ">
            <Image
              src="/FOTOACEPTADA1.webp"
              alt="Servicio Terapia Psicológica Contigo Voy Online"
              title="Terapeuta Ana Vizcarra Centro Psicológico Contigo Voy"
              width={500}
              height={400}
            />
          </div>
        </div>
      </div>
    </>
  );
}
