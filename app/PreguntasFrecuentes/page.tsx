import AccordionQuest from "@/components/AccordionQuest";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Preguntas Frecuentes | Terapia Psicológica - Contigo Voy",
  description:
    "¿Tienes dudas sobre nuestros servicios de atención psicológica en línea? En nuestra sección de preguntas frecuentes, resuelve tus inquietudes y se parte de nosotros.",
  authors: [{ name: "Contigo Voy" }],
  viewport: "width=device-width, initial-scale=1",
  verification: {
    google: "E00tvOVfRX6v6wc1XmzuZ3gmrwWyisgcyp4c2uNt7CY",
  },
};

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
    <div className="flex flex-col justify-center min-h-screen w-full relative overflow-y-hidden overflow-x-clip bg-large-gradient">
      <div className="lg:relative overflow-y-hidden overflow-x-clip">
        <div
          className="mix-blend-multiply  z-0 absolute pointer-events-none top-0 left-0 -bottom-[20px] -right-[0] sm:-right-[130px] lg:-right-[260px] bg-[url('/preguntas-sobre-terapia-en-linea.webp')] bg-no-repeat bg-[length:700px] sm:bg-[length:900px] lg:bg-[length:1140px] bg-bottom"
        ></div>
        <div
          className="relative z-10 max-w-scv18 mx-auto"
        >
          <h1 style={{textShadow: "4px 5px 16px rgba(0,0,0,0.35), 2px 2px 3px rgba(0,0,0,0.45)"}} 
            className=" text-white text-cv8 sm:text-cv9 text-center sm:text-left font-bold px-scv7 pt-scv7 sm:pt-scv8 pb-scv6 md:pl-scv9">
            Preguntas frecuentes
          </h1>
          <div className="grid gap-4 pb-scv13 sm:pb-scv12  sm:max-w-scv15  px-scv7 md:pr-0 sm:pl-10  md:px-scv9">
            <AccordionQuest faqs={faqs} />
          </div>
        </div>
      </div>
    </div>
  );
}
