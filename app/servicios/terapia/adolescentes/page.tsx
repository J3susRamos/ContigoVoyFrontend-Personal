import ServicesStructure from "@/components/Services/ServicesStructure";

import { ServicesStructureProps } from "@/interface";

import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Terapia para Adolescentes Online | Contigo Voy Psicólogos Especializados",
  description:
    "Terapia para adolescentes online con psicólogos expertos. Mejora autoestima, manejo emocional, habilidades sociales y orientación vocacional segura.",
  authors: [{ name: "Contigo Voy" }],
  viewport: "width=device-width, initial-scale=1",
  verification: {
    google: "E00tvOVfRX6v6wc1XmzuZ3gmrwWyisgcyp4c2uNt7CY",
  },
};

const TeenTerapias: ServicesStructureProps[] = [
  {
    title: "Adolescente feliz | Contigo Voy PSicología Online",
    edad: "De 13 a 18 años de edad",
    motto:
      "¿Listo para dar el primer paso hacia el bienestar emocional de tu hijo?",
    background: "/Services/teen/terapia-psicologica-para-adolescentes.webp",
    bgup: "/Services/teen/chica_Sentada.webp",
    bgdown: "/Services/teen/psicologos-especializados-en-adolescentes.webp",
    bgdownAlt: "Adolescente feliz | Psicología Online",
    bgdownTitle:
      "Ayuda a tu hijo a sentirse escuchado y comprendido en esta etapa tan crucial de su desarrollo con nuestra terapia integral. Apoyamos a los adolescentes a manejar sus emociones, fortalecer su autoestima y desarrollar su habilidades sociales en un espacio seguro.",
    description:
      "Ayuda a tu hijo a sentirse escuchado y comprendido en esta etapa tan crucial de su desarrollo con nuestra terapia integral. Apoyamos a los adolescentes a manejar sus emociones, fortalecer su autoestima y desarrollar su habilidades sociales en un espacio seguro.",
    tittleIcon:
      "Prioriza su bienestar emocional. A través de la terapia para adolescentes, ayudamos a jóvenes a enfrentar desafíos.",
    iconos: [
      {
        id: 1,
        title:
          "Ayuda con manejo de emociones en Adolescentes Contigo Voy Psicología Online",
        text: "Manejo de emociones",
        iconImage: "/Services/teen/emociones.webp",
      },
      {
        id: 2,
        title:
          "Ayuda en el control de estrés en adolescentes  Contigo Voy Psicología Online",
        text: "Estrés académico",
        iconImage: "/Services/teen/estres.webp",
      },
      {
        id: 3,
        title: "Autoestima en Adolescentes Contigo Voy Psicología Online",
        text: "Fortalecimiento del autoestima",
        iconImage: "/Services/teen/autoestima.webp",
      },
      {
        id: 4,
        title:
          "Creando habilidades sociales en adolescentes Contigo Voy Psicología Online",
        text: "Habilidades sociales",
        iconImage: "/Services/teen/sociales.webp",
      },
      {
        id: 5,
        title:
          "Orientación Vocacional para Adolescentes Secundaria Contigo Voy Psicología Online",
        text: "Orientación vocacional",
        iconImage: "/Services/teen/vocacional.webp",
      },
    ],
    tittlecards: "Beneficios de la terapia para adolescentes",
    cards: [
      {
        id: 1,
        title: "Frustraciones en adolescentes Contigo Voy Psicología Online",
        text: "Ayuda a manejar la frustración y transformar emociones difíciles en acciones positivas.",
        icon: "/Services/teen/therapy/frustraciones.webp",
      },
      {
        id: 2,
        title:
          "Terapia para el equilibrio saludable en adolescentes Contigo Voy Psicología Online",
        text: "Fomenta un equilibrio saludable entre sus responsabilidades y su bienestar emocional",
        icon: "/Services/teen/therapy/equilibrio.webp",
      },
      {
        id: 3,
        title:
          "Terapia en adolescentes para comunicación efectiva Contigo Voy Psicología Online",
        text: "Mejora las habilidades para comunicarse y relacionarse con los demás.",
        icon: "/Services/teen/therapy/comunicacion.webp",
      },
      {
        id: 4,
        title: "Seguridad en adolescentes Contigo Voy Psicología Online",
        text: "Les brinda herramientas para enfrentar decisiones importantes con seguridad.",
        icon: "/Services/teen/therapy/seguridad.webp",
      },
      {
        id: 5,
        title:
          "Construye el autoestima de tu adolescente Contigo Voy Psicología Online",
        text: "Impulsa su autoestima, ayudándoles a construir una imagen positiva de sí mismos.",
        icon: "/Services/teen/therapy/construir.webp",
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
  },
];

export default function Home() {
  return <ServicesStructure services={TeenTerapias} />;
}
