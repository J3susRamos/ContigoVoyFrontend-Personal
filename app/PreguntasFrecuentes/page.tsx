'use client'
import AccordionQuest from "@/components/AccordionQuest";
import { motion } from "framer-motion";
import Link from "next/link";

// Datos estáticos fuera del componente para evitar recreación
const FAQS_DATA = [
  {
    Question: "¿Cuánto va a costar mi terapia?",
    Answer:
      "El costo de las terapias varía según el tipo de terapia que el paciente busque. Los precios varían entre 69 y 129 soles por sesión.",
  },
  {
    Question: "¿Cuánto es el tiempo de duración de la consulta?",
    Answer:
      "Cada persona es única, por lo que no podemos estimar el tiempo ni el costo sin la consulta. Allí, el especialista brindará un diagnóstico preciso y personalizará tu terapia para garantizar los mejores resultados.",
  },
  {
    Question: "¿Cuáles son los métodos de pago?",
    Answer:
      "Para facilitar el proceso, ofrecemos diversas formas de pago como transferencia bancaria, Yape o Plin.",
  },
  {
    Question: "¿Qué tipos de terapia manejan los psicólogos?",
    Answer:
      "Nuestros especialistas están altamente capacitados en terapia cognitivo-conductual, uno de los enfoques más efectivos y respaldados científicamente en la actualidad para el tratamiento de diversas condiciones psicológicas.",
  },
];

// Componente reutilizable para el fondo animado
const AnimatedBackground = () => (
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-black/10 dark:bg-black/30"></div>
    <div className="absolute top-0 left-0 w-full h-full">
      <div className="absolute top-4 left-4 w-20 h-20 bg-white/10 rounded-full blur-lg animate-pulse sm:top-10 sm:left-10 sm:w-32 sm:h-32"></div>
      <div className="absolute bottom-4 right-4 w-24 h-24 bg-white/10 rounded-full blur-lg animate-pulse delay-1000 sm:bottom-10 sm:right-10 sm:w-48 sm:h-48"></div>
      <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-white/5 rounded-full blur-xl transform -translate-x-1/2 -translate-y-1/2 sm:w-64 sm:h-64"></div>
    </div>
  </div>
);

export default function App() {
  return (
    <div className="w-full relative overflow-hidden min-h-0">
      {/* Hero Section Optimizada para Móvil */}
      <section 
        role="banner" 
        className="relative overflow-hidden bg-gradient-to-br from-[#634AE2] via-[#9494F3] to-[#7B5FE8] dark:from-purple-900 dark:via-indigo-800 dark:to-blue-900 py-12 sm:py-20"
      >
        <AnimatedBackground />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold text-white mb-6 sm:text-4xl md:text-5xl lg:text-6xl"
            >
              Tus{" "}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                dudas
              </span>{" "}
              importan
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-xl font-semibold text-white mb-4 sm:text-2xl md:text-3xl"
            >
              Estamos aquí para ayudarte
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg text-white/90 max-w-2xl mx-auto mb-8 sm:text-xl"
            >
              Respuestas claras y cercanas para acompañarte en cada paso de tu camino emocional.
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-md text-white/90 max-w-1xl mx-auto sm:text-lg"
            >
              ¿Tienes dudas sobre nuestros servicios de atención psicológica en línea? En nuestra sección de preguntas frecuentes, resuelve tus inquietudes y se parte de nosotros.
              </motion.p>

          </div>
        </div>
      </section>

      {/* FAQs Section Optimizada */}
      <section 
        role="main" 
        aria-label="Preguntas frecuentes sobre terapia psicológica"
        className="py-8 pb-16 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 bg-gradient-to-r from-blue-50 to-purple-50 sm:py-12 sm:pb-24"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto px-4 sm:px-6"
        >
          <AccordionQuest faqs={FAQS_DATA} />
        </motion.div>
      </section>

      {/* CTA Section Optimizada */}
      <section 
        role="complementary" 
        aria-label="Contacta con nuestros especialistas"
        className="relative overflow-hidden bg-gradient-to-br from-[#634AE2] via-[#9494F3] to-[#7B5FE8] dark:from-purple-900 dark:via-indigo-800 dark:to-blue-900 py-8 sm:py-12"
      >
        <AnimatedBackground />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl font-bold mb-4 text-white sm:text-3xl md:text-4xl"
            >
              ¿Listo para comenzar tu camino hacia el bienestar?
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-lg mb-6 text-white/90 sm:text-xl"
            >
              Agenda tu primera sesión y descubre cómo podemos ayudarte.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Link href="/contactanos" className="block w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold text-base w-full max-w-xs mx-auto shadow-lg hover:shadow-xl transition-all sm:px-10 sm:py-4 sm:text-lg"
                >
                  Contactar Ahora
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}