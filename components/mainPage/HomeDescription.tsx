"use client";

import { motion } from "framer-motion";

export default function HomeDescription() {
  return (
    <section className="relative py-12 sm:py-16 dark:bg-gray-900 bg-gray-100 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 w-[480px] h-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative max-w-1xl mx-auto px-4 text-center"
      >
        <p className="text-lg sm:text-xl md:text-2xl dark:text-gray-300 text-gray-600 leading-relaxed">
          En <strong className="text-purple-600 dark:text-purple-400">Contigo Voy</strong>{" "}
          ofrecemos <strong>terapia psicológica online</strong> para niños,
          adolescentes, adultos, parejas y familias.
          <br className="hidden sm:block" />
          Nuestro equipo de <strong>psicólogos profesionales</strong> te acompaña
          con un enfoque <strong>humano, confidencial y personalizado</strong>,
          estés donde estés.
        </p>
      </motion.div>
    </section>
  );
}
