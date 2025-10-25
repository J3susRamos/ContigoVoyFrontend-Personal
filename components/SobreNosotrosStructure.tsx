"use client";

import { QuienesSomos } from "@/interface";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { FC } from "react";

// Configuraciones de animación optimizadas
const fadeInConfig = {
  initial: { opacity: 0, y: 15 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.4 }
};

const fadeInLeftConfig = {
  initial: { opacity: 0, x: -30 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.4 }
};

const fadeInRightConfig = {
  initial: { opacity: 0, x: 30 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.4 }
};

// Componente para el header de cada sección
const SectionHeader: FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.h2
    {...fadeInConfig}
    className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 relative pb-4 dark:text-white text-gray-900"
  >
    {children}
    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></span>
  </motion.h2>
);

// Mapeo de íconos a nombres de archivo reales


// Tipado para el ValueCard
interface ValueCardProps {
  title: string;
  content: string;
  icon: string;
}

// Componente de tarjeta de valor con imágenes


// Componente con íconos webp
const ValueCardWithSVG: FC<ValueCardProps> = ({ title, content, icon }) => (
  <motion.div
    whileHover={{ y: -5 }}
    transition={{ type: "tween", duration: 0.2 }}
    className="dark:bg-white/5 bg-white/90 backdrop-blur-lg p-8 rounded-xl dark:border-white/10 border-gray-400 border shadow-lg dark:shadow-gray-800/20 shadow-gray-200 h-full flex flex-col"
  >
    <div className="mb-4 flex justify-center">
      <Image
        src={`/AboutUs/${icon}.webp`}
        alt={title}
        width={50}
        height={50}
        className="w-50 h-50"
      />
    </div>
    <h3 className="text-xl font-semibold mb-3 dark:text-white text-gray-900 text-center">{title}</h3>
    <p className="dark:text-gray-300 text-gray-600 leading-relaxed flex-grow">{content}</p>
  </motion.div>
);

interface AboutUsPageProps {
  qs: QuienesSomos[];
}

export default function AboutUsPage({ qs }: AboutUsPageProps) {
  // Datos de valores para renderizar
  const valores = [
    { title: "Empatía", content: qs[0]?.valor1 || "Nos conectamos genuinamente con las experiencias y emociones de cada persona.", icon: "empatia" },
    { title: "Profesionalismo", content: qs[0]?.valor2 || "Mantenemos los más altos estándares éticos y técnicos.", icon: "profesional" },
    { title: "Accesibilidad", content: qs[0]?.valor3 || "Trabajamos para que la salud mental sea un derecho al alcance de todos.", icon: "accesibilidad" },
    { title: "Innovación", content: "Exploramos constantemente nuevas formas de mejorar nuestros servicios.", icon: "innovacion" },
    { title: "Confidencialidad", content: "Protegemos la privacidad y la confianza de quienes nos eligen.", icon: "confianza" },
    { title: "Diversidad", content: "Celebramos y respetamos la singularidad de cada persona.", icon: "diversidad" }
  ];

  return (
    <div className="w-full dark:bg-gray-900 bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#634AE2] via-[#9494F3] to-[#7B5FE8] dark:from-purple-900 dark:via-indigo-800 dark:to-blue-900 py-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/10 dark:bg-black/30"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-xl"></div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8"
          >
            Tu bienestar{" "}
              EMOCIONAL 
            <span className="block lg:inline"> es nuestro</span> compromiso
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-12"
          >
            En Contigo Voy encontrás un espacio seguro donde crecer, sanar y descubrir tu mejor versión.
          </motion.p>
        </div>
      </section>

      {/* Nuestra Historia */}
      <section className="py-16 md:py-24 dark:bg-gray-900 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader>Nuestra Historia</SectionHeader>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              {...fadeInLeftConfig}
              className="space-y-6"
            >
              <p className="text-lg dark:text-gray-300 text-gray-600 leading-relaxed">
                {qs[0]?.quienesSomos || "Somos un equipo de profesionales comprometidos con tu bienestar emocional."}
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-blue-500 dark:text-blue-400 mr-3">✓</span>
                  <span className="dark:text-gray-300 text-gray-700">Terapia online accesible desde cualquier lugar</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 dark:text-blue-400 mr-3">✓</span>
                  <span className="dark:text-gray-300 text-gray-700">Equipo multidisciplinario de especialistas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 dark:text-blue-400 mr-3">✓</span>
                  <span className="dark:text-gray-300 text-gray-700">Enfoque personalizado para cada paciente</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              {...fadeInRightConfig}
              className="relative w-full rounded-2xl overflow-hidden shadow-2xl dark:shadow-gray-800/30 shadow-gray-300 h-64 sm:h-80 md:h-96"
            >
              <Image
                src="/AboutUs/terapeutas-especializados-familia-feliz.webp"
                alt="Sesión de terapia psicológica"
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="py-16 md:py-20 dark:bg-gray-900 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <motion.div
              {...fadeInConfig}
              className="dark:bg-white/5 bg-white/90 p-8 lg:p-10 rounded-xl backdrop-blur-sm dark:border-white/10 border-gray-400 border shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-6 text-blue-500 dark:text-blue-400">Misión</h3>
              <p className="dark:text-gray-300 text-gray-600 leading-relaxed">
                {qs[0]?.mision || "Brindar apoyo psicológico accesible y de calidad."}
              </p>
            </motion.div>

            <motion.div
              {...fadeInConfig}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="dark:bg-white/5 bg-white/90 p-8 lg:p-10 rounded-xl backdrop-blur-sm dark:border-white/10 border-gray-400 border shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-6 text-purple-500 dark:text-purple-400">Visión</h3>
              <p className="dark:text-gray-300 text-gray-600 leading-relaxed">
                {qs[0]?.vision || "Ser referentes en salud mental online en Latinoamérica."}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nuestros Valores */}
      <section className="py-16 md:py-24 dark:bg-gray-900 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader>Nuestros Valores</SectionHeader>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {valores.map((valor, index) => (
              <motion.div
                key={valor.title}
                {...fadeInConfig}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <ValueCardWithSVG 
                  title={valor.title}
                  content={valor.content}
                  icon={valor.icon}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 dark:bg-gray-800 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeInConfig}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 dark:text-white text-gray-900">
              ¿Listo para comenzar tu camino de transformación?
            </h2>
            <p className="text-xl dark:text-gray-300 text-gray-600 mb-10 max-w-3xl mx-auto">
              Da el primer paso hacia tu bienestar emocional. Nuestro equipo de profesionales está aquí para acompañarte.
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg"
            >
              <Link href="/ReservarCita" className="text-white no-underline">
                Agenda tu consulta
              </Link>
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}