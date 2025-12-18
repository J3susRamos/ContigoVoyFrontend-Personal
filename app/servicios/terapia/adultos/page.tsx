import ServicesStructure from "@/components/Services/ServicesStructure";
import { ServicesStructureProps } from "@/interface";

import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Terapia para adultos – Bienestar y apoyo | Contigo Voy",
  description:
    "Terapia psicológica para adultos online. Manejo de estrés, ansiedad y duelo con psicólogos certificados. Mejora tu bienestar emocional hoy.",
  authors: [{ name: "Contigo Voy" }],
  verification: {
    google: "E00tvOVfRX6v6wc1XmzuZ3gmrwWyisgcyp4c2uNt7CY",
  },
  keywords: [
    "psicoterapia para adultos",
    "terapia para adultos",
    "ansiedad en adultos",
    "manejo del estrés",
    "terapia cognitiva conductual",
  ],
  alternates: {
    canonical:
      "https://www.centropsicologicocontigovoy.com/servicios/terapia/adultos/",
  },
  robots: {
    index: true,
    follow: true,
    noimageindex: true,
  },
};

const AdultoTerapias: ServicesStructureProps = {
  title: "Adultos felices en Contigo Voy",
  titleMobil: "Adultos felices",
  edad: "de 19 años a más",
  edadMobil: "19 +",
  motto: (
    <p>
      ¿Sientes que las preocupaciones del día a día están afectando tu bienestar{" "}
      <span className="text-yellow-300" /*className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent" */>
        {" "}
        emocional
      </span>
      ?
    </p>
  ),
  backgroundDesktop:"/Services/adult/Escritorio-Terapia_adultos_Mujer_agarrándose_rostro_feliz.webp",
  backgroundMobile: "/Services/adult/Terapia_adultos_Mujer_agarrándose_rostro_feliz.webp",
  bgdown: "/Services/adult/Terapia_adultos_Mujer_afro_feliz_tablet.webp",
  bgup: "/Services/adult/bgupadultos.webp",
  bgdownAlt:
    " ¡Recupera tu bienestar emocional! A través de la terapia para adultos,te ayudamos a enfrentar desafíos",
  bgdownTitle: "Contigo Voy Psicología Online",
  description:
    "Terapia psicológica para adultos online. Manejo de estrés, ansiedad y duelo con psicólogos certificados. Mejora tu bienestar emocional hoy.",
  tittleIcon:
    "¡Recupera tu bienestar emocional! A través de la terapia para adultos,te ayudamos a enfrentar desafíos.",
  iconos: [
    {
      id: 1,
      title: "Estrés en adultos Contigo Voy Psicología Online",
      text: "Estrés",
      iconImage: "/Services/adult/estres.svg",
    },
    {
      id: 2,
      title: "Desafíos en el trabajo Adultos Contigo Voy Psicología Online",
      text: "Desafíos laborales",
      iconImage: "/Services/adult/laborales.svg",
    },
    {
      id: 3,
      title:
        "Dificultades para manejar emociones en adultos Contigo Voy Psicología Online",
      text: "Dificultades emocionales",
      iconImage: "/Services/adult/dificultades.svg",
    },
    {
      id: 4,
      title: "Acompañamiento en el duelo Adultos Contigo Voy Psicología Online",
      text: "Proceso de duelo",
      iconImage: "/Services/adult/duelo.svg",
    },
    {
      id: 5,
      title: "Crecimiento personal en Adultos Contigo Voy Psicología Online",
      text: "Crecimiento personal",
      iconImage: "/Services/adult/personal.svg",
    },
  ],
  tittlecards: "Beneficios de la terapia para adultos",
  cards: [
    {
      id: 1,
      title: "Manejo de estrés en Adultos Contigo Voy Psicología Online",
      text: "Aprenderás a manejar el estrés y la ansiedad para recuperar tu equilibrio emocional.",
      icon: "/Services/adult/therapy/manejar.svg",
    },
    {
      id: 2,
      title: "Control de emociones en adultos Contigo Voy Psicología Online",
      text: "Comprenderás y gestionarás tus emociones, tomando decisiones más conscientes.",
      icon: "/Services/adult/therapy/comprender.svg",
    },
    {
      id: 3,
      title: "Confianza en Adultos Contigo Voy Psicología Online",
      text: "Fortalecerás tu confianza al trabajar en tus habilidades y superar límites.",
      icon: "/Services/adult/therapy/fortalecer.svg",
    },
    {
      id: 4,
      title: "Desafíos en la vida adulta Contigo Voy Psicología Online",
      text: "Te enseñaremos cómo enfrentar los desafíos de la vida diaria de manera saludable y resiliente.",
      icon: "/Services/adult/therapy/enfrentar.svg",
    },
    {
      id: 5,
      title: "Gestión de conflictos en adultos Contigo Voy Psicología Online",
      text: "Te ayudará a gestionar conflictos emocionales y mejorar tus relaciones personales y laborales.",
      icon: "/Services/adult/therapy/gestion.svg",
    },
  ],
  textfooter:
    "Estamos aquí para acompañarte y ayudarte a transformar<br/>tus retos en oportunidades de crecimiento personal.",
  textfootermobile:
    "Estamos aquí para acompañarte y <br/>ayudarte a transformartus retos en <br/>oportunidades de crecimiento personal.",
  promotionCards: [
    {
      id: 1,
      title: "Terapia para adultos",
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
      id: 1,
      title: "Terapia para adultos",
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
      id: 1,
      title: "Terapia para adultos",
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
      id: 1,
      title: "Terapia para adultos",
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
  return <ServicesStructure service={AdultoTerapias} />;
}
