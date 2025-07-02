import ServicesStructure from "@/components/Services/ServicesStructure";

import { ServicesStructureProps } from "@/interface";

import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Terapia para Adolescentes Online | Contigo Voy Psicólogos Especializados",
  description:
    "Terapia para adolescentes online con psicólogos expertos. Mejora autoestima, manejo emocional, habilidades sociales y orientación vocacional segura.",
};

const TeenTerapias: ServicesStructureProps[] = [
  {
    title: "Terapia para adolescentes",
    edad: "De 13 a 18 años de edad",
    motto:
      "¿Listo para dar el primer paso hacia el bienestar emocional de tu hijo?",
    background: "/Services/teen/terapia-psicologica-para-adolescentes.webp",
    bgup: "/Services/teen/chica_Sentada.webp",
    bgdown: "/Services/teen/psicologos-especializados-en-adolescentes.webp",
    description:
      "Ayuda a tu hijo a sentirse escuchado y comprendido en esta etapa tan crucial de su desarrollo con nuestra terapia integral. Apoyamos a los adolescentes a manejar sus emociones, fortalecer su autoestima y desarrollar su habilidades sociales en un espacio seguro.",
    tittleIcon:
      "Prioriza su bienestar emocional. A través de la terapia para adolescentes, ayudamos a jóvenes a enfrentar desafíos.",
    iconos: [
      {
        id: 1,
        text: "Manejo de emociones",
        iconImage: "/Services/teen/emociones.webp",
      },
      {
        id: 2,
        text: "Estrés académico",
        iconImage: "/Services/teen/estres.webp",
      },
      {
        id: 3,
        text: "Fortalecimiento del autoestima",
        iconImage: "/Services/teen/autoestima.webp",
      },
      {
        id: 4,
        text: "Habilidades sociales",
        iconImage: "/Services/teen/sociales.webp",
      },
      {
        id: 5,
        text: "Orientación vocacional",
        iconImage: "/Services/teen/vocacional.webp",
      },
    ],
    tittlecards: "Beneficios de la terapia para adolescentes",
    cards: [
      {
        id: 1,
        text: "Ayuda a manejar la frustración y transformar emociones difíciles en acciones positivas.",
        icon: "/Services/teen/therapy/frustraciones.webp",
        title: "Manejo de emociones",
      },
      {
        id: 2,
        text: "Fomenta un equilibrio saludable entre sus responsabilidades y su bienestar emocional",
        icon: "/Services/teen/therapy/equilibrio.webp",
        title: "Equilibrio saludable",
      },
      {
        id: 3,
        text: "Mejora las habilidades para comunicarse y relacionarse con los demás.",
        icon: "/Services/teen/therapy/comunicacion.webp",
        title: "Comunicación efectiva",
      },
      {
        id: 4,
        text: "Les brinda herramientas para enfrentar decisiones importantes con seguridad.",
        title: "Seguridad en la toma de decisiones",
        icon: "/Services/teen/therapy/seguridad.webp",
      },
      {
        id: 5,
        text: "Impulsa su autoestima,ayudándoles a construir una imagen positiva de sí mismos.",
        icon: "/Services/teen/therapy/construir.webp",
        title: "Construir una imagen positiva",
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
