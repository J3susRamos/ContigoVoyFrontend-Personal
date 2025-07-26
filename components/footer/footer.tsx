"use client";
import RedesSociales from "@/components/footer/RedesSociales";
import { Image } from "@heroui/react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Footer() {
  const leftLinks = [
    { text: "Inicio", href: "/", title: "Volver a la página principal" },
    { text: "Sobre Nosotros", href: "/sobreNosotros", title: "Conoce nuestro equipo y misión" },
    { text: "Servicios", href: "/servicios/terapia/infantes", title: "Terapia especializada para niños, adolescentes, adultos y más." },
    { text: "Reservar cita", href: "/ReservarCita", title: "Agenda una consulta en línea" },
  ];

  const rightLinks = [
    { text: "Contáctanos", href: "/contactanos", title: "WhatsApp, email y redes sociales" },
    { text: "Preguntas Frecuentes", href: "/PreguntasFrecuentes", title: "Respuestas a dudas comunes" },
    { text: "Blog", href: "/blog", title: "Artículos sobre salud mental y consejos" },
    { text: "Iniciar sesión", href: "/login", title: "Acceso para profesionales y administradores." },
  ];

  return (
    <footer className="h-auto bg-[#634AE2] text-white isolate ">
      <div className="lg:max-w-7xl p-10 mx-auto">
        {/* Contenido Principal */}
        <div className="flex flex-col md:flex-row justify-between items-start space-y-8 md:space-y-0">
          {/* Logo centrado con redes */}
          <div className="flex flex-col items-center justify-center text-center w-full md:w-auto space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="flex-shrink-0"
            >
              <Image
                src="/LogoBlanco.webp"
                title="Contigo Voy - Terapia Psicológica"
                alt="Eligenos - Confidencialidad Contigo Voy"
                width={150}
                height={60}
              />
            </motion.div>

            {/* Redes sociales debajo del logo */}
            <div className="mt-2 scale-75">
              <RedesSociales />
            </div>
          </div>

          {/* Enlaces */}
          <div className="flex flex-col text-start w-full md:w-auto">
            <h3 className="text-2xl font-semibold mb-4 text-white">Enlaces</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
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
                      <a title={link.title} className="relative group whitespace-nowrap">
                        {link.text}
                        <span className="absolute bottom-0 left-0 w-10 transition-all h-auto bg-white group-hover:w-full inline-block duration-500"></span>
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
              <h3 className="text-2xl font-semibold mb-4 text-white">Contacto</h3>

              <div className="flex flex-col space-y-3 items-start">
                {/* Perú */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-start">
                  <a
                    href="https://w.app/dvwynv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 border border-white rounded-full px-2 py-0.5 hover:bg-green-600/80 transition-colors w-fit"
                  >
                    <span className="text-white text-[10px]">Perú</span>
                    <Image
                      src="/WSP.webp"
                      title="Whatsapp Terapia Psicológica Peru Online Contigo Voy"
                      alt="WhatsApp Terapia Peru Psicológica Online"
                      width={14}
                      height={14}
                      className="flex-shrink-0"
                    />
                  </a>
                  <span className="text-sm mt-1 sm:mt-0">+51 983 027 828</span>
                </div>

                {/* Argentina */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-start">
                  <a
                    href="https://w.app/qv4uqn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 border border-white rounded-full px-2 py-0.5 hover:bg-green-600/80 transition-colors w-fit"
                  >
                    <span className="text-white text-[10px]">Argentina</span>
                    <Image
                      src="/WSP.webp"
                      title="Whatsapp Terapia Psicológica Argentina Online Contigo Voy"
                      alt="WhatsApp Terapia Argentina Psicológica Online"
                      width={14}
                      height={14}
                      className="flex-shrink-0"
                    />
                  </a>
                  <span className="text-sm mt-1 sm:mt-0">+54 922 130 326 75</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
