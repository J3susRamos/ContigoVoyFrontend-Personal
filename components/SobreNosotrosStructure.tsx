"use client";
import { QuienesSomos } from "@/interface";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

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

const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <motion.h2
    {...fadeInConfig}
    className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 relative pb-4 dark:text-white text-gray-900"
  >
    {children}
    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></span>
  </motion.h2>
);

const ValueCard = ({ title, content, icon }: { title: string, content: string, icon: string }) => (
  <motion.div
    whileHover={{ y: -5 }}
    transition={{ type: "tween", duration: 0.2 }}
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
            {/* Reducido número de elementos animados */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-xl"></div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8">
              Tu bienestar <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">emocional</span> es nuestro compromiso
            </h1>

            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-12">
              En Contigo Voy encontrás un espacio seguro donde crecer, sanar y descubrir tu mejor versión.
            </p>
          </div>
        </div>
      </section>

      {/* Nuestra Historia */}
      <section className="py-24 dark:bg-gray-900 bg-gray-100">
        <SectionHeader>Nuestra Historia</SectionHeader>
        <div className="grid lg:grid-cols-2 gap-16 items-center px-6 max-w-7xl mx-auto">
          <motion.div
            {...fadeInLeftConfig}
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
            {...fadeInRightConfig}
            className="relative h-96 rounded-2xl overflow-hidden shadow-2xl dark:shadow-gray-800/30 shadow-gray-300"
          >
            <Image
              src="/AboutUs/terapeutas-especializados-familia-feliz.webp"
              alt="Sesión de terapia psicológica"
              fill
              className="object-cover"
              priority={true}
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={85}
            />
          </motion.div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="py-20 dark:bg-gray-900 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              {...fadeInConfig}
              className="dark:bg-white/5 bg-white/90 p-10 rounded-xl backdrop-blur-sm dark:border-white/10 border-gray-400 border shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-6 text-blue-500 dark:text-blue-400">Misión</h3>
              <p className="dark:text-gray-300 text-gray-600 leading-relaxed">{qs[0].mision}</p>
            </motion.div>
            <motion.div
              {...fadeInConfig}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="dark:bg-white/5 bg-white/90 p-10 rounded-xl backdrop-blur-sm dark:border-white/10 border-gray-400 border shadow-lg"
            >
              <h3 className="text-2xl font-bold mb-6 text-purple-500 dark:text-purple-400">Visión</h3>
              <p className="dark:text-gray-300 text-gray-600 leading-relaxed">{qs[0].vision}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nuestros Valores Section */}
      <section className="py-16 md:py-24 dark:bg-gray-900 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader>Nuestros Valores</SectionHeader>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div {...fadeInConfig} transition={{ duration: 0.4 }}>
              <ValueCard 
                title="Empatía" 
                content="Nos conectamos genuinamente con las experiencias y emociones de cada persona, creando un espacio de comprensión y respeto."
                icon="❤️"
              />
            </motion.div>
            
            <motion.div {...fadeInConfig} transition={{ duration: 0.4, delay: 0.1 }}>
              <ValueCard 
                title="Profesionalismo" 
                content="Mantenemos los más altos estándares éticos y técnicos en nuestra práctica, con un compromiso constante con la actualización y la excelencia."
                icon="🎓"
              />
            </motion.div>
            
            <motion.div {...fadeInConfig} transition={{ duration: 0.4, delay: 0.2 }}>
              <ValueCard 
                title="Accesibilidad" 
                content="Trabajamos para que la salud mental sea un derecho al alcance de todos, eliminando barreras económicas, geográficas y culturales."
                icon="🔑"
              />
            </motion.div>
            
            <motion.div {...fadeInConfig} transition={{ duration: 0.4, delay: 0.1 }}>
              <ValueCard 
                title="Innovación" 
                content="Exploramos constantemente nuevas formas de mejorar nuestros servicios, integrando avances científicos y tecnológicos con enfoques terapéuticos probados."
                icon="💡"
              />
            </motion.div>
            
            <motion.div {...fadeInConfig} transition={{ duration: 0.4, delay: 0.2 }}>
              <ValueCard 
                title="Confidencialidad" 
                content="Protegemos la privacidad y la confianza de quienes nos eligen, creando un entorno seguro para la expresión y el crecimiento."
                icon="🔒"
              />
            </motion.div>
            
            <motion.div {...fadeInConfig} transition={{ duration: 0.4, delay: 0.3 }}>
              <ValueCard 
                title="Diversidad" 
                content="Celebramos y respetamos la singularidad de cada persona, reconociendo que la diversidad enriquece nuestra comunidad y nuestro trabajo."
                icon="🌈"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 dark:bg-gray-800 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeInConfig}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 dark:text-white text-gray-900">¿Listo para comenzar tu camino de transformación?</h2>
            <p className="text-xl dark:text-gray-300 text-gray-600 mb-10 max-w-3xl mx-auto">
              Da el primer paso hacia tu bienestar emocional. Nuestro equipo de profesionales está aquí para acompañarte.
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg"
            >
              <Link href="/contacto" className="text-white no-underline">
                Agenda tu consulta
              </Link>
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}