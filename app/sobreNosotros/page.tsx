import SobreNosotrosStructure from "@/components/SobreNosotrosStructure";
import { QuienesSomos } from "@/interface";

import { Metadata } from "next";

export	const metadata: Metadata = {
  title: "Centro Psicológico | Contigo Voy ",
  description: "Somos un equipo de psicólogos especializados en terapia online donde encontrarás un espacio seguro y confidencial. Tu salud mental es nuestra prioridad. ",
};

const dataQS: QuienesSomos[] = [
  {
    quienesSomos:
      "Contigo Voy es un centro psicológico online dedicado al bienestar emocional en todas las etapas de la vida. Contamos con un equipo de especialistas nacionales e internacionales que ofrecen terapia individual, de pareja y familiar, proporcionando un apoyo profesional personalizado para cada persona.",
    mision:
      "Nuestra misión es contribuir al bienestar emocional y mental de las personas mediante servicios de terapia psicológica online accesibles y de calidad.",
    vision:
      "Ser la plataforma líder en salud mental, facilitando un acceso más directo a las terapias y orientación psicológica. Nos comprometemos a ofrecer un servicio eficiente, garantizando apoyo emocional y bienestar para todos.",
    valor1:
      "Valoramos la capacidad de entender y compartir los sentimientos de nuestros clientes, ofreciendo un espacio donde se sientan escuchados y comprendidos.",
    valor2:
      "Nos comprometemos a crear un ambiente seguro y fiable, donde cada individuo pueda expresarse sin miedo al juicio y con total confidencialidad, fortaleciendo la relación entre psicólogos y pacientes.",
    valor3:
      "Mantenemos altos estándares en todos los aspectos de nuestro servicio, garantizando calidad y responsabilidad en cada interacción.",
  },
];

export default function Home() {
  return (
    <div
      className="w-full relative overflow-y-hidden over overflow-x-clip bg-large-gradient"  
    >
      <SobreNosotrosStructure qs={dataQS} />
    </div>
  );
}
