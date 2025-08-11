import ServicesStructure from "@/components/Services/ServicesStructure";
import { ServicesStructureProps } from "@/interface";

import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Terapia de Pareja Online | Contigo Voy Psicólogos para Relaciones Sanas y Conectadas",
  description:
    "Fortalece tu relación con terapia de pareja online. Mejora la comunicación, resuelve conflictos y recupera la conexión con apoyo profesional.",
  authors: [{ name: "Contigo Voy" }],
  verification: {
    google: "E00tvOVfRX6v6wc1XmzuZ3gmrwWyisgcyp4c2uNt7CY",
  },
  keywords: [
    "terapia de parejas",
    "conflictos de pareja",
    "comunicación en la relación",
    "crisis de pareja",
    "vinculo emocional",
  ],
  alternates: {
    canonical:
      "https://centropsicologicocontigovoy.com/servicios/terapia/parejas/",
  },
  robots: {
    index: true,
    follow: true,
    noimageindex: true,
  },
};

const ParejaTerapias: ServicesStructureProps = {
  title: "Terapia de pareja",
  edad: "Para parejas de toda edad",
  titleMobil: "Terapia de pareja",
  edadMobil: "Para todos",
  motto: (
    <p>
      ¿
      <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
        {" "}
        Tu relación
      </span>{" "}
      está en crisis? ¿Buscas fortalecer el vínculo?
    </p>
  ),
  background: "/Services/couple/ayuda-para-parejas-en-crisis.webp",
  bgdown: "/Services/couple/psicoterapia-para-relaciones-de-pareja.webp",
  bgup: "/Services/couple/bguppareja.webp",
  bgdownAlt: "",
  bgdownTitle: "",
  description:
    "Todas las parejas enfrentan desafíos y buscar ayuda es un paso hacia una relación más satisfactoria. En Contigo Voy, pueden iniciar una terapia de pareja online diseñada para cuidar su bienestar de forma accesible y práctica.",
  tittleIcon:
    "En Contigo Voy puedes encontrar un psicólogo de parejas online para abordar una gran variedad de temas.",
  iconos: [
    {
      id: 1,
      text: "Sexualidad",
      iconImage: "/Services/couple/sexualidad.svg",
    },
    {
      id: 2,
      text: "Problemas de comunicación",
      iconImage: "/Services/couple/problemascomuni.svg",
    },
    {
      id: 3,
      text: "Celos",
      iconImage: "/Services/couple/celos.svg",
    },
    {
      id: 4,
      text: "Familia",
      iconImage: "/Services/couple/familia.svg",
    },
    {
      id: 5,
      text: "Dependencia emocional",
      iconImage: "/Services/couple/dependencia.svg",
    },
  ],
  tittlecards: "Beneficios de la terapia de parejas",
  cards: [
    {
      id: 1,
      text: "Aprenderán a comunicarse y expresar sus emociones de manera clara y efectiva, fortaleciendo el entendimiento mutuo.",
      icon: "/Services/couple/therapy/comunicarse.svg",
      title: "Mejora de la comunicación",
    },
    {
      id: 2,
      text: "Incrementará la satisfacción y el bienestar, no solo en la relación, sino también a nivel personal.",
      icon: "/Services/couple/therapy/satisfaccion.svg",
      title: "Satisfacción y bienestar",
    },
    {
      id: 3,
      text: "Desarrollarán una empatía más profunda para comprender y atender mejor las necesidades de su pareja.",
      icon: "/Services/couple/therapy/empatia.svg",
      title: "Desarrollo de la empatía",
    },
    {
      id: 4,
      text: "Mejorarán su empatía, facilitando el respeto hacia sus diferencias y promoviendo la armonía.",
      icon: "/Services/couple/therapy/armonia.svg",
      title: "Fomento de la armonía",
    },
    {
      id: 5,
      text: "Construirán su mejor versión individual para crecer y avanzar juntos como pareja.",
      icon: "/Services/couple/therapy/avanza.svg",
      title: "Crecimiento conjunto",
    },
  ],
  textfooter: "¿Listos para fortalecer su relación y crecer juntos?",
  textfootermobile:
    "¿Listos para fortalecer su relación <br/> y crecer juntos?",
  promotionCards: [
    {
      id: 1,
      title: "Terapia de pareja",
      preciounit: "s/129",
      cents: ".00",
      regularprice: "Precio regular: s/90.00",
      list: [
        {
          id: 1,
          text: "Sesiones online de 40 a 50 minutos.",
        },
        {
          id: 2,
          text: "Fortalece la comunicación y conexión emocional.",
        },
        {
          id: 3,
          text: "Técnicas para resolver conflictos de forma constructiva.",
        },
        {
          id: 4,
          text: "Psicólogos especializados en relaciones de pareja.",
        },
      ],
    },
  ],
};
export default function Home() {
  return <ServicesStructure service={ParejaTerapias} />;
}
