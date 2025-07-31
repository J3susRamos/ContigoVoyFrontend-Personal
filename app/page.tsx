import ChooseUs from "@/components/mainPage/chooseUs";
import OnlinePsychology from "@/components/mainPage/onlinePsychology";
import TherapyServices from "@/components/mainPage/therapyServices";
import MainSlider from "@/components/mainPage/mainslider";
import RealiableCompanies from "@/components/mainPage/ReliableCompanies";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terapia Psicológica Online | Contigo Voy",
  description:
    "Conecta con tu bienestar. Psicólogos online, comienza tu terapia hoy. Contigo Voy te acompaña desde el primer paso. Agenda tu cita, la primera es gratis.",
  authors: [{ name: "Contigo Voy" }],
  verification: {
    google: "ddLU23MMNVC0iknLLV3PFXxVUN5RHLSJkQLzEbg4t8s",
  },
  keywords: ["psicología", "bienestar emocional","terapia personalizada", "espacio seguro", "nueva cita"],
};

export default function Home() {
  return (
    <div className="w-full overflow-hidden dark:bg-gray-900 bg-gray-100">
      <MainSlider />
      <TherapyServices />
      <ChooseUs />
      <RealiableCompanies />
      <OnlinePsychology />
    </div>
  );
}
