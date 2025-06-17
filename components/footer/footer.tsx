"use client";
import RedesSociales from "@/components/footer/RedesSociales";
import { Image } from "@heroui/react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Footer() {
  const leftLinks = [
    { text: "Inicio", href: "/" },
    { text: "Sobre Nosotros", href: "/sobreNosotros" },
    { text: "Servicios", href: "/servicios/terapia/infantes" },
    { text: "Reservar cita", href: "/ReservarCita" },
  ];

  const rightLinks = [
    { text: "Contáctanos", href: "/contactanos" },
    { text: "Preguntas Frecuentes", href: "/PreguntasFrecuentes" },
    { text: "Blog", href: "/blog" },
    { text: "Iniciar sesión", href: "/login" },
  ];

  return (
    <footer className="h-auto bg-[#634AE2] text-white ">
      <div className="lg:max-w-7xl p-10 mx-auto">
        {/* Contenido Principal */}
        <div className="flex flex-col md:flex-row justify-between items-start space-y-8 md:space-y-0">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="flex-shrink-0"
          >
            <Image
              src="/LogoBlanco.webp"
              alt="Confidencialidad Contigo Voy Terapia Psicológica Online"
              width={150}
              height={60}
            />
          </motion.div>

          {/* Sección de Enlaces */}
          <div className="flex flex-col text-start w-full md:w-auto">
            <h3 className="text-xl font-semibold mb-5">Enlaces</h3>
            <div className="grid grid-cols-2 lg:gap-20">
              {/* Columna izquierda */}
              <ul className="space-y-5">
                {leftLinks.map((link) => (
                  <li key={link.text}>
                    <Link
                      href={link.href}
                      className="text-purple-100 hover:text-white transition-colors duration-500 text-sm flex items-center group relative"
                    >
                      <span className="relative group">
                        {link.text}
                        <span className="absolute bottom-0 left-0 w-0 transition-all h-0.5 bg-white group-hover:w-full inline-block duration-500"></span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Columna derecha */}
              <ul className="space-y-5">
                {rightLinks.map((link) => (
                  <li key={link.text}>
                    <Link
                      href={link.href}
                      className="text-purple-100 hover:text-white transition-colors duration-500 text-sm flex items-center group relative"
                    >
                      <span className="relative group whitespace-nowrap">
                        {link.text}
                        <span className="absolute bottom-0 left-0 w-10 transition-all h-auto bg-white group-hover:w-full inline-block duration-500"></span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Redes Sociales y Contacto */}
          <div className="flex flex-col space-y-6">
            {/* Redes Sociales */}
            <div className="flex flex-col text-start w-full md:w-auto">
              <h3 className="text-xl font-semibold text-white mb-4">
                Síguenos
              </h3>
              <div className="">
                <RedesSociales />
              </div>
            </div>

            <div className="flex flex-col text-start w-full md:w-auto">
              <h3 className="text-xl font-semibold text-white mb-4">
                Contacto
              </h3>

              <div className="flex flex-col space-y-2">
                <div className="flex flex-col space-y-2">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-2">
                      <a
                        href="https://w.app/dvwynv"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 border border-white rounded-full px-2 py-0.5 hover:bg-green-600/80 transition-colors"
                      >
                        <span className="text-white text-[10px]">Perú</span>
                        <Image
                          src="/WSP.webp"
                          alt="WhatsApp Terapia Peru Psicológica Online"
                          width={14}
                          height={14}
                          className="flex-shrink-0"
                        />
                      </a>

                      <span className="text-sm">+51 983 027 828</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href="https://w.app/qv4uqn"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 border border-white rounded-full px-2 py-0.5 hover:bg-green-600/80 transition-colors"
                      >
                        <span className="text-white text-[10px]">Argentina</span>
                        <Image
                          src="/WSP.webp"
                          alt="WhatsApp Terapia Argentina Psicológica Online"
                          width={14}
                          height={14}
                          className="flex-shrink-0"
                        />
                      </a>
                      <span className="text-sm">+54 922 130 326 75</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
