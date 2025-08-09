"use client";
import RedesSociales from "@/components/footer/RedesSociales";
import { Image } from "@heroui/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ReactSVG } from "react-svg";

export default function Footer() {
  const leftLinks = [
    { text: "Inicio", href: "/", title: "Volver a la página principal" },
    {
      text: "Sobre Nosotros",
      href: "/sobreNosotros",
      title: "Conoce nuestro equipo y misión",
    },
    {
      text: "Servicios",
      href: "/servicios/terapia/infantes",
      title: "Terapia especializada para niños, adolescentes, adultos y más.",
    },
    {
      text: "Reservar cita",
      href: "/ReservarCita",
      title: "Agenda una consulta en línea",
    },
  ];

  const rightLinks = [
    {
      text: "Contáctanos",
      href: "/contactanos",
      title: "WhatsApp, email y redes sociales",
    },
    {
      text: "Preguntas Frecuentes",
      href: "/PreguntasFrecuentes",
      title: "Respuestas a dudas comunes",
    },
    {
      text: "Blog",
      href: "/blog",
      title: "Artículos sobre salud mental y consejos",
    },
    {
      text: "Iniciar sesión",
      href: "/login",
      title: "Acceso para profesionales y administradores.",
    },
  ];

  return (
    <footer className="h-auto bg-[#634AE2] dark:bg-gray-900 text-white isolate ">
      <div className="lg:max-w-6xl p-10 md:px-11 mx-auto">
        {/* Contenido Principal */}
        <div className="flex flex-col md:flex-row justify-between items-start space-y-8 md:space-y-0">
          {/* Logo centrado con redes */}
          <div className="flex flex-col shrink-2  justify-center  w-full md:w-[220px] ">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="flex-shrink-0"
            >
              <ReactSVG
                src="/logofooter.svg"
                title="Contigo Voy - Terapia Psicológica"
                className="w-[150px] h-[60px]"
              />
            </motion.div>

            {/* Redes sociales debajo del logo */}
            <div className="scale-75 origin-bottom-left">
              <RedesSociales />
            </div>
          </div>

          {/* Enlaces */}
          <div className="flex flex-col text-start w-full md:w-auto">
            <h3 className="text-2xl font-semibold mb-4 text-white">Enlaces</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-2 sm:gap-y-4">
              {/* Columna izquierda */}
              <ul className="space-y-2 sm:space-y-3 text-xs text-white">
                {leftLinks.map((link) => (
                  <li key={link.text}>
                    <Link
                      href={link.href}
                      passHref
                      legacyBehavior
                      className="text-purple-100 hover:text-white transition-colors duration-500 flex items-center group relative"
                    >
                      <a title={link.title} className="relative group">
                        {link.text}
                        <span className="absolute bottom-0 left-0 w-0 transition-all h-0.5 bg-white group-hover:w-full inline-block duration-500"></span>
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Columna derecha */}
              <ul className="space-y-2 sm:space-y-3 text-xs text-white">
                {rightLinks.map((link) => (
                  <li key={link.text}>
                    <Link
                      href={link.href}
                      passHref
                      legacyBehavior
                      className="text-purple-100 hover:text-white transition-colors duration-500 flex items-center group relative"
                    >
                      <a title={link.title} className="relative group">
                        {link.text}
                        <span className="absolute bottom-0 left-0 w-0 transition-all h-0.5 bg-white group-hover:w-full inline-block duration-500"></span>
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Redes sociales y contacto */}
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col text-start w-full md:w-auto">
              <h3 className="text-2xl font-semibold mb-4 text-white">
                Contacto
              </h3>

              <div className="flex flex-col space-y-3 items-start">
                {/* Perú */}
                <div className="flex flex-col sm:flex-row  sm:items-center sm:gap-2 text-start w-full">
                  <a
                    href="https://w.app/dvwynv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center space-x-1 border border-white hover:border-[#634AE2] rounded-full px-2 py-0.5 hover:bg-gray-100/80 transition-colors w-fit"
                  >
                    <span className="text-white  group-hover:text-[#634AE2] duration-250  text-[10px]">
                      Perú
                    </span>
                    <ReactSVG
                      src="/WSP.svg"
                      className="flex-shrink-0 w-[14px] h-[14px]"
                      title="Whatsapp Terapia Psicológica Peru Online Contigo Voy"
                      beforeInjection={(svg) => {
                        svg.classList.add(
                          "fill-gray-100",
                          "group-hover:fill-[#634AE2]",
                          "duration-250"
                        );
                      }}
                    />
                  </a>
                  <span className="text-[12px] mt-1 sm:mt-0">
                    +51 983 027 828
                  </span>
                </div>

                {/* Argentina */}
                <div className="flex flex-col sm:flex-row  sm:items-center sm:gap-2 text-start">
                  <a
                    href="https://w.app/qv4uqn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center space-x-1 border border-white hover:border-[#634AE2] rounded-full px-2 py-0.5 hover:bg-gray-100/80 transition-colors w-fit"
                  >
                    <span className="text-white  group-hover:text-[#634AE2] duration-250  text-[10px]">
                      Argentina
                    </span>
                    <ReactSVG
                      src="/WSP.svg"
                      className="flex-shrink-0 w-[14px] h-[14px]"
                      title="Whatsapp Terapia Psicológica Peru Online Contigo Voy"
                      beforeInjection={(svg) => {
                        svg.classList.add(
                          "fill-gray-100",
                          "group-hover:fill-[#634AE2]",
                          "duration-250"
                        );
                      }}
                    />
                  </a>
                  <span className="text-[12px] mt-1 sm:mt-0">
                    +54 922 130 326 75
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
