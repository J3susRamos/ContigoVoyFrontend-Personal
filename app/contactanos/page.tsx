"use client";

import { Metadata } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";

// Dynamic import para mejorar performance
const FormContacto = dynamic(() => import("@/components/contactUs/FormContacto"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Contáctanos - Centro psicológico | Contigo Voy",
  description:
    "En Contigo Voy te escuchamos, llena nuestro formulario de contacto y da el primer paso hacia tu bienestar con un equipo psicológico que te acompaña siempre",
  authors: [{ name: "Contigo Voy" }],
  verification: {
    google: "E00tvOVfRX6v6wc1XmzuZ3gmrwWyisgcyp4c2uNt7CY",
  },
  keywords: [
    "contacto",
    "psicólogos",
    "psicólogos lima",
    "primera cita",
    "gratis",
    "cita gratuita",
    "ayuda emocional",
    "ayuda psicológica",
  ],
  alternates: {
    canonical: "https://centropsicologicocontigovoy.com/contactanos/",
  },
  robots: {
    index: true,
    follow: true,
    noimageindex: true,
  },
};

const ContactUs = () => {
  return (
    <div className="flex flex-col justify-center min-h-screen w-full relative overflow-y-hidden overflow-x-clip dark:bg-gradient-to-br dark:from-purple-950 dark:via-indigo-900 dark:to-purple-900 transition-colors duration-300">
      
      {/* Hero Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/consulta-asesoría-psicológica-online.webp"
          alt="Contactanos Terapia Psicológica Contigo Voy Online"
          fill
          priority
          className="object-bottom object-cover mix-blend-multiply"
          sizes="(max-width: 640px) 850px, 1250px"
        />
      </div>

      <div className="relative z-10 max-w-scv18 mx-auto">
        <div className="container px-scv7 pt-scv7 sm:pt-scv8 sm:px-scv9">
          <div className="text-white space-y-6 text-center flex flex-col items-center justify-center w-full">
            
            {/* H1 Hero */}
            <h1
              style={{ textShadow: "2px 3px 8px rgba(0,0,0,0.25), 1px 2px 3px rgba(0,0,0,0.32)" }}
              className="text-cv8 sm:text-cv9 sm:leading-[60px] font-bold w-full max-w-scv16"
            >
              ¡La solución que buscas, empieza aquí!
            </h1>

            {/* H2 Subtitulo */}
            <h2
              style={{ textShadow: "2px 3px 8px rgba(0,0,0,0.25), 2px 2px 3px rgba(0,0,0,0.45)" }}
              className="text-cv8 sm:text-cv8 font-semibold mt-scv6 w-full max-w-scv16"
            >
              Beneficios de acercarte a un centro psicológico
            </h2>

            {/* H2 CTA */}
            <h2
              style={{ textShadow: "4px 5px 16px rgba(0,0,0,0.35), 2px 2px 3px rgba(0,0,0,0.45)" }}
              className="text-cv8 sm:text-cv8 font-bold mt-scv6 w-full max-w-scv16"
            >
              Contáctanos
            </h2>
          </div>

          {/* Formulario */}
          <div className="mt-scv5 w-full flex pb-scv9 justify-center">
            <FormContacto />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
