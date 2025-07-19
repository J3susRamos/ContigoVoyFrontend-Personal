import ServicesStructure from "@/components/Services/ServicesStructure";
import { ServicesStructureProps } from "@/interface";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terapia Empresarial Online | Contigo Voy - Bienestar Laboral ",
  description:
    "Reduce el estrés y mejora el clima laboral. Terapia empresarial online para líderes y equipos. Más productividad y bienestar emocional. Basta de burnout.",
  authors: [{ name: "Contigo Voy" }],
  verification: {
    google: "E00tvOVfRX6v6wc1XmzuZ3gmrwWyisgcyp4c2uNt7CY",
  },
};

const terapiaEmpresarial: ServicesStructureProps = {
  title: "Terapia empresarial",
  edad: "Para todos los miembros",
  titleMobil: "Terapia empresarial",
  edadMobil: "Para todos",
  motto: (
    <p>
      ¿Tu empresa enfrenta altos niveles de estrés y conflictos internos?
      Impulsa el bienestar de tu
      <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
        {" "}
        equipo
      </span>{" "}
      con nuestra terapia empresarial
    </p>
  ),
  background: "/Services/business/buisness.webp",
  bgdown: "/Services/business/bg2.webp",
  bgdownAlt: "",
  bgdownTitle: "",
  bgup: "/Services/business/bgtiny.webp",
  description:
    "Ayudamos a equipos y líderes a gestionar el estrés, mejorar la comunicación y fortalecer un ambiente laboral saludable. A través de sesiones económicas y personalizadas, promovemos un entorno más equilibrado y productivo para todos.",
  tittleIcon:
    "En Contigo Voy, puedes encontrar especialistas en psicología organizacional para abordar una gran variedad de temas.",
  iconos: [
    {
      id: 1,
      text: "Estrés laboral",
      iconImage: "/Services/business/therapy/estres.webp",
    },
    {
      id: 2,
      text: "Cambios en el estado de animo",
      iconImage: "/Services/business/therapy/estados.webp",
    },
    {
      id: 3,
      text: "Dificultad para concentrarse",
      iconImage: "/Services/business/therapy/dificultad.webp",
    },
    {
      id: 4,
      text: "Síndrome de desgaste profesional",
      iconImage: "/Services/business/therapy/sindrome.webp",
    },
    {
      id: 5,
      text: "Síndrome del trabajador burbuja",
      iconImage: "/Services/business/therapy/burbuja.webp",
    },
  ],
  tittlecards: "Beneficios de la terapia empresarial",
  cards: [
    {
      id: 1,
      text: "Colaboradores con menos índices de estrés",
      icon: "/Services/business/colaboradores.webp",
      title: "Menos estrés laboral",
    },
    {
      id: 2,
      text: "Incremento en la productividad",
      icon: "/Services/business/incremento.webp",
      title: "Mayor productividad",
    },
    {
      id: 3,
      text: "Mejora en el clima laboral",
      icon: "/Services/business/clima.webp",
      title: "Clima laboral positivo",
    },
    {
      id: 4,
      text: "Colaboradores con mayor gestión emocional",
      icon: "/Services/business/mayor.webp",
      title: "Mejor gestión emocional",
    },
    {
      id: 5,
      text: "Disminución de la rotación de personal",
      icon: "/Services/business/disminucion.webp",
      title: "Mayor estabilidad personal",
    },
  ],
  textfooter:
    "¿Te atreves a revolucionar tu ambiente laboral y motivar a tu equipo como nunca antes?",
  textfootermobile:
    "¿Te atreves a revolucionar tu ambiente laboral y motivar a tu equipo como <br/>nunca antes?",
  promotionCards: [
      {
        id: 1,
        title: "Terapia empresarial",
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
            text: "Desarrollo de estrategias para manejar momentos difíciles.",
          },
          {
            id: 3,
            text: "Espacio seguro para hablar y crecer.",
          },
          { id: 4, text: "Psicólogos certificados con amplia experiencia." },
        ],
      },
      {
        id: 2,
        title: "Terapia empresarial",
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
            text: "Desarrollo de estrategias para manejar momentos difíciles.",
          },
          {
            id: 3,
            text: "Espacio seguro para hablar y crecer.",
          },
          { id: 4, text: "Psicólogos certificados con amplia experiencia." },
        ],
      },
      {
        id: 3,
        title: "Terapia empresarial",
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
            text: "Desarrollo de estrategias para manejar momentos difíciles.",
          },
          {
            id: 3,
            text: "Espacio seguro para hablar y crecer.",
          },
          { id: 4, text: "Psicólogos certificados con amplia experiencia." },
        ],
      },
      {
        id: 4,
        title: "Terapia empresarial",
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
            text: "Desarrollo de estrategias para manejar momentos difíciles.",
          },
          {
            id: 3,
            text: "Espacio seguro para hablar y crecer.",
          },
          { id: 4, text: "Psicólogos certificados con amplia experiencia." },
        ],
      },
    ],
}

export default function Home() {
  return <ServicesStructure service={terapiaEmpresarial} />;
}
