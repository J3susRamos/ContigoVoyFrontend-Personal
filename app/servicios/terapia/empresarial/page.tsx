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
  keywords: ["psicología organizacional"],
  alternates: {
    canonical:
      "https://centropsicologicocontigovoy.com/servicios/terapia/empresarial/",
  },
  robots: {
    index: true,
    follow: true,
    noimageindex: true,
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
      <span className="text-yellow-300" /*className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent" */>
        {" "}
        equipo
      </span>{" "}
      con nuestra terapia empresarial
    </p>
  ),
  background: "/Services/business/buisness.webp",
  bgdown: "/Services/business/bgempre.webp",
  bgdownAlt: "Servicio Terapia Psicológica para Empresas Contigo Voy Online",
  bgdownTitle: "Terapia Empresarial | Contigo Voy Psicología Online",
  bgup: "/Services/business/bgtiny.webp",
  description:
    "Ayudamos a equipos y líderes a gestionar el estrés, mejorar la comunicación y fortalecer un ambiente laboral saludable. A través de sesiones económicas y personalizadas, promovemos un entorno más equilibrado y productivo para todos.",
  tittleIcon:
    "En Contigo Voy, puedes encontrar especialistas en psicología organizacional para abordar una gran variedad de temas.",
  iconos: [
    {
      id: 1,
      text: "Estrés laboral",
      iconImage: "/Services/business/therapy/estres.svg",
      title: "Estrés laboral",
    },
    {
      id: 2,
      text: "Cambios en el estado de animo",
      iconImage: "/Services/business/therapy/estados.svg",
    },
    {
      id: 3,
      text: "Dificultad para concentrarse",
      iconImage: "/Services/business/therapy/dificultad.svg",
    },
    {
      id: 4,
      text: "Síndrome de desgaste profesional",
      iconImage: "/Services/business/therapy/sindrome.svg",
    },
    {
      id: 5,
      text: "Síndrome del trabajador burbuja",
      iconImage: "/Services/business/therapy/burbuja.svg",
    },
  ],
  tittlecards: "Beneficios de la terapia empresarial",
  cards: [
    {
      id: 1,
      text: "Acompañamos emocionalmente a tus colaboradores",
      icon: "/Services/business/colaboradores.svg",
      title: "Menos estrés laboral trabajo Contigo Voy Psicología Online",
    },
    {
      id: 2,
      text: "Psicología empresarial que potencia la productividad de tus equipos desde el bienestar emocional.",
      icon: "/Services/business/incremento.svg",
      title: "Mayor Productividad Contigo Voy Psicología Online",
    },
    {
      id: 3,
      text: "Promovemos entornos laborales emocionalmente saludables",
      icon: "/Services/business/clima.svg",
      title: "Clima Laboral Saludable Contigo Voy Psicología Online",
    },
    {
      id: 4,
      text: "Colaboradores con mejores herramientas psicológicas para gestionar sus emociones",
      icon: "/Services/business/mayor.svg",
      title: "Mejor gestión emocional Contigo Voy Psicología Online",
    },
    {
      id: 5,
      text: "Cuidamos el bienestar emocional para mantener equipos comprometidos",
      icon: "/Services/business/disminucion.svg",
      title: "Menor rotación de personal Contigo Voy Psicología Online",
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
    /* 
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
    */
  ],
};

export default function Home() {
  return <ServicesStructure service={terapiaEmpresarial} />;
}
