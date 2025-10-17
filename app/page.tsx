import ChooseUs from "@/components/mainPage/chooseUs";
import OnlinePsychology from "@/components/mainPage/onlinePsychology";
import TherapyServices from "@/components/mainPage/therapyServices";
import MainSlider from "@/components/mainPage/mainslider";
import RealiableCompanies from "@/components/mainPage/ReliableCompanies";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contigo Voy | Terapia Psicológica Online",
  description:
    "Psicólogos online para tu bienestar. Empieza tu terapia hoy con Contigo Voy. Primera cita gratis y acompañamiento profesional.",
  authors: [{ name: "Contigo Voy" }],
  verification: {
    google: [
      "ddLU23MMNVC0iknLLV3PFXxVUN5RHLSJkQLzEbg4t8s",
      "6u5qZ6pA6QPGpgHB4x1FIAjK83idrgJDfRRwU1wNSQE",
    ],
  },
  keywords: [
    "psicología",
    "bienestar emocional",
    "terapia personalizada",
    "espacio seguro",
    "nueva cita",
  ],
  alternates: {
    canonical: "https://www.centropsicologicocontigovoy.com/",
  },
  robots: {
    index: true,
    follow: true,
    noimageindex: true,
  },
};

export default function Home() {
  return (
    <div className="w-full overflow-hidden dark:bg-gray-900 bg-gray-100">
      <h1 className="text-cv5 sm:text-cv7 text-center font-bold text-title lg:mb-scv3">
        <span className="hidden sm:inline">Contigo Voy |&nbsp;</span>
        <span className="block sm:hidden">Contigo Voy |&nbsp;</span>
        Terapia Psicológica Online
      </h1>
      <MainSlider />
      <TherapyServices />
      <ChooseUs />
      <RealiableCompanies />
      <OnlinePsychology />
    </div>
  );
}
