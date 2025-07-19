'use client'
import AccordionQuest from "@/components/AccordionQuest";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// import { Metadata } from "next";
// export const metadata: Metadata = {
//   title: "Preguntas Frecuentes | Terapia Psicológica - Contigo Voy",
//   description:
//     "¿Tienes dudas sobre nuestros servicios de atención psicológica en línea? En nuestra sección de preguntas frecuentes, resuelve tus inquietudes y se parte de nosotros.",
//   authors: [{ name: "Contigo Voy" }],
//   verification: {
//     google: "E00tvOVfRX6v6wc1XmzuZ3gmrwWyisgcyp4c2uNt7CY",
//   },
// };

export default function App() {
  const faqs = [
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

  return (
    <div className="w-full relative overflow-y-hidden over overflow-x-clip min-h-0">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#634AE2] via-[#9494F3] to-[#7B5FE8] dark:from-purple-900 dark:via-indigo-800 dark:to-blue-900 py-20">
        <div className="absolute inset-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Image
              src="/preguntas-sobre-terapia-en-linea.webp"
              alt="wa"
              priority
              width={800}
              height={200}
              className="hidden md:block h-auto absolute right-0 opacity-20 bottom-[-100]"
            />
          </motion.div>

          <div className="absolute inset-0 bg-black/10 dark:bg-black/30"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8"
            >
              Tus{" "}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                dudas{" "}
              </span>{" "}
              importan, y estamos aquí para ayudarte
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-12"
            >
              Encontrarás respuestas claras y cercanas para que te sientas
              acompañado en cada paso de tu camino emocional.
            </motion.p>
          </div>
        </div>
      </section>
      <section className="py-12 pb-24  dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 bg-gradient-to-r from-blue-50 to-purple-50">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y : 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto px-scv6"
        >
          <AccordionQuest faqs={faqs} />
        </motion.div>
      </section>
      {/* CTA Final */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#634AE2] via-[#9494F3] to-[#7B5FE8] dark:from-purple-900 dark:via-indigo-800 dark:to-blue-900 py-12">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/10 dark:bg-black/30"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">
              ¿Listo para comenzar tu camino hacia el bienestar?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Agenda tu primera sesión y descubre cómo podemos ayudarte.
            </p>
            <Link href="/contactanos">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Contactar Ahora
              </motion.button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
