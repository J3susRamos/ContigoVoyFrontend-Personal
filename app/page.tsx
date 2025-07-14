import ChooseUs from "@/components/mainPage/chooseUs";
import OnlinePsychology from "@/components/mainPage/onlinePsychology";
import TherapyServices from "@/components/mainPage/therapyServices";
import MainSlider from "@/components/mainPage/mainslider";
import RealiableCompanies from "@/components/mainPage/ReliableCompanies";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terapia Psicológica Online | Contigo Voy",
  description: "Conecta con tu bienestar. Psicólogos online, comienza tu terapia hoy. Contigo Voy te acompaña desde el primer paso. Agenda tu cita, la primera es gratis.",
  authors: [{ name: 'Contigo Voy' }],
  viewport: 'width=device-width, initial-scale=1',
  verification: {
    google: 'E00tvOVfRX6v6wc1XmzuZ3gmrwWyisgcyp4c2uNt7CY',
  },
};

export default function Home() {
  return (
    <div className="w-full overflow-hidden">
      <MainSlider />
      <TherapyServices />
      <ChooseUs />
      <RealiableCompanies />
      <OnlinePsychology />
    </div>
  );
}
