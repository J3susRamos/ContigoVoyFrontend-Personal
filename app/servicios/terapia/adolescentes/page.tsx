import ServicesStructure from "@/components/Services/ServicesStructure";

import { ServicesStructureProps } from "@/interface";

import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Terapia para adolescentes – Confianza y bienestar emocional | Contigo Voy",
  description:
    "Terapia para adolescentes online con psicólogos expertos. Mejora autoestima, manejo emocional, habilidades sociales y orientación vocacional segura.",
  authors: [{ name: "Contigo Voy" }],
  verification: {
    google: "E00tvOVfRX6v6wc1XmzuZ3gmrwWyisgcyp4c2uNt7CY",
  },
  keywords: [
    "psicología para adolescentes",
    "terapia juvenil",
    "regulación emocional",
    "acompañamiento escolar",
    "salud mental adolescentes",
  ],
  alternates: {
    canonical:
      "https://centropsicologicocontigovoy.com/servicios/terapia/adolescentes",
  },
  robots: {
    index: true,
    follow: true,
    noimageindex: true,
  },
};

const TeenTerapias: ServicesStructureProps = {
  title: "Adolescente feliz | Contigo Voy PSicología Online",
  edad: "De 13 a 18 años de edad",
  titleMobil: "Adolescentes felices",
  edadMobil: "13 - 18",
  motto: (
    <p>
      ¿Listo para dar el primer paso hacia el bienestar emocional de tu{" "}
      <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
        {" "}
        hijo
      </span>
      ?
    </p>
  ),
  background: "/Services/teen/terapia-psicologica-para-adolescentes.webp",
  bgup: "/Services/teen/chica_Sentada.webp",
  bgdown: "/Services/teen/psicologos-especializados-en-adolescentes.webp",
  bgdownAlt: "Adolescente feliz | Psicología Online",
  bgdownTitle:
    " Prioriza su bienestar emocional. A través de la terapia para adolescentes, ayudamos a jóvenes a enfrentar desafíos.",
  description:
    " Prioriza su bienestar emocional. A través de la terapia para adolescentes, ayudamos a jóvenes a enfrentar desafíos",
  tittleIcon:
    "Prioriza su bienestar emocional. A través de la terapia para adolescentes, ayudamos a jóvenes a enfrentar desafíos.",
  iconos: [
    {
      id: 1,
      title:
        "Ayuda con manejo de emociones en Adolescentes Contigo Voy Psicología Online",
      text: "Manejo de emociones",
      iconImage: "/Services/teen/emociones.svg",
    },
    {
      id: 2,
      title:
        "Ayuda en el control de estrés en adolescentes  Contigo Voy Psicología Online",
      text: "Estrés académico",
      iconImage: "/Services/teen/estres.svg",
    },
    {
      id: 3,
      title: "Autoestima en Adolescentes Contigo Voy Psicología Online",
      text: "Fortalecimiento del autoestima",
      iconImage: "/Services/teen/autoestima.svg",
    },
    {
      id: 4,
      title:
        "Creando habilidades sociales en adolescentes Contigo Voy Psicología Online",
      text: "Habilidades sociales",
      iconImage: "/Services/teen/sociales.svg",
    },
    {
      id: 5,
      title:
        "Orientación Vocacional para Adolescentes Secundaria Contigo Voy Psicología Online",
      text: "Orientación vocacional",
      iconImage: "/Services/teen/vocacional.svg",
    },
  ],
  tittlecards: "Beneficios de la terapia para adolescentes",
  cards: [
    {
      id: 1,
      title: "Frustraciones en adolescentes Contigo Voy Psicología Online",
      text: "Ayuda a manejar la frustración y transformar emociones difíciles en acciones positivas.",
      icon: "/Services/teen/therapy/frustraciones.svg",
    },
    {
      id: 2,
      title: "Equilibrio en Adolescentes Contigo Voy Psicología Online",
      text: "Fomenta un equilibrio saludable entre sus responsabilidades y su bienestar emocional",
      icon: "/Services/teen/therapy/equilibrio.svg",
    },
    {
      id: 3,
      title:
        "Habilidades comunicativas en Adolescentes Contigo Voy Psicología Online",
      text: "Mejora las habilidades para comunicarse y relacionarse con los demás.",
      icon: "/Services/teen/therapy/comunicacion.svg",
    },
    {
      id: 4,
      title: "Seguridad en adolescentes Contigo Voy Psicología Online",
      text: "Les brinda herramientas para enfrentar decisiones importantes con seguridad.",
      icon: "/Services/teen/therapy/seguridad.svg",
    },
    {
      id: 5,
      title:
        "Construye el autoestima de tu adolescente Contigo Voy Psicología Online",
      text: "Impulsa su autoestima, ayudándoles a construir una imagen positiva de sí mismos.",
      icon: "/Services/teen/therapy/construir.svg",
    },
  ],
  textfooter:
    "Cada sesión es una oportunidad para que tu hijo explore,<br/>crezca y enfrente sus desafíos con seguridad y confianza.",
  textfootermobile:
    "Cada sesión es una oportunidad para que tu hijo explore,<br/>crezca y enfrente sus desafíos con seguridad y confianza.",
  promotionCards: [
    {
      id: 1,
      title: "Terapia para adolescentes",
      preciounit: "s/69",
      cents: ".00",
      regularprice: "Precio regular: s/90.00",
      list: [
        {
          id: 1,
          text: "Sesiones online de 40 a 50 minutos.",
        },
        {
          id: 2,
          text: "Desarrollo de herramientas comunicativas.",
        },
        {
          id: 3,
          text: "Desarrollo emocional y social.",
        },
        { id: 4, text: "Psicólogos especializados en juventud." },
      ],
    },
  ],
};

export default function Home() {
  return <ServicesStructure service={TeenTerapias} />;
}
