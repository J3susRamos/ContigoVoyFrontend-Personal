"use client";
import { QuienesSomos } from "@/interface";
import Image from "next/image";
import { motion } from "framer-motion";

const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <motion.h2
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 relative pb-4 dark:text-white text-gray-900"
  >
    {children}
    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></span>
  </motion.h2>
);

const ValueCard = ({ title, content, icon }: { title: string, content: string, icon: string }) => (
  <motion.div
    whileHover={{ y: -10 }}
    className="dark:bg-white/5 bg-white/90 backdrop-blur-lg p-8 rounded-xl dark:border-white/10 border-gray-400 border shadow-lg dark:shadow-gray-800/20 shadow-gray-200"
  >
    <div className="text-blue-500 dark:text-blue-400 text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-3 dark:text-white text-gray-900">{title}</h3>
    <p className="dark:text-gray-300 text-gray-600 leading-relaxed">{content}</p>
  </motion.div>
);

export default function AboutUsPage({ qs }: { qs: QuienesSomos[] }) {
  return (
    <div className="w-full dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#634AE2] via-[#9494F3] to-[#7B5FE8] dark:from-purple-900 dark:via-indigo-800 dark:to-blue-900 py-20">
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
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8"
            >
              Tu bienestar <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">emocional</span> es nuestro compromiso
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
        </div>
      </section>

      {/* Nuestra Historia */}
      <section className="py-24 dark:bg-gray-900 bg-gray-100">
        <SectionHeader>Nuestra Historia</SectionHeader>
        <div className="grid lg:grid-cols-2 gap-16 items-center px-6 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <p className="text-lg dark:text-gray-300 text-gray-600 leading-relaxed">
              {qs[0].quienesSomos}
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
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-96 rounded-2xl overflow-hidden shadow-2xl dark:shadow-gray-800/30 shadow-gray-300"
          >
            <Image
              src="/AboutUs/terapeutas-especializados-familia-feliz.webp"
              alt="Sesión de terapia psicológica"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="py-20 dark:bg-gray-900 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="dark:bg-white/5 bg-white/90 p-10 rounded-xl backdrop-blur-sm dark:border-white/10 border-gray-400 border shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-6 text-blue-500 dark:text-blue-400">Misión</h3>
              <p className="dark:text-gray-300 text-gray-600 leading-relaxed">{qs[0].mision}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="dark:bg-white/5 bg-white/90 p-10 rounded-xl backdrop-blur-sm dark:border-white/10 border-gray-400 border shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-6 text-purple-500 dark:text-purple-400">Visión</h3>
              <p className="dark:text-gray-300 text-gray-600 leading-relaxed">{qs[0].vision}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nuestros Valores */}
      <section className="py-24 dark:bg-gray-900 bg-gray-100">
        <SectionHeader>Nuestros Valores</SectionHeader>
        <div className="grid md:grid-cols-3 gap-8 px-6 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <ValueCard
              title="Empatía"
              content={qs[0].valor1}
              icon="👂"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <ValueCard
              title="Confianza"
              content={qs[0].valor2}
              icon="🤝"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <ValueCard
              title="Profesionalismo"
              content={qs[0].valor3}
              icon="🎓"
            />
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#634AE2] via-[#9494F3] to-[#7B5FE8] dark:from-purple-900 dark:via-indigo-800 dark:to-blue-900 py-20">
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
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">¿Listo para comenzar tu camino hacia el bienestar?</h2>
            <p className="text-xl mb-12 text-white/90">
              Agenda tu primera sesión y descubre cómo podemos ayudarte.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Contactar Ahora
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
}