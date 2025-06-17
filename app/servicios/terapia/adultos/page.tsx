import ServicesStructure from "@/components/Services/ServicesStructure"
import { ServicesStructureProps } from "@/interface"

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terapia para Adultos Online | Contigo Voy Psicólogos para Bienestar Emocional",
  description: "Terapia psicológica para adultos online. Manejo de estrés, ansiedad y duelo con psicólogos certificados. Mejora tu bienestar emocional hoy.",
};


 const AdultoTerapias:ServicesStructureProps[] =[{

  title: "Terapia para adultos",
  edad: "de 19 años a más",
  motto:
    "¿Sientes que las preocupaciones del día a día están afectando tu bienestar emocional?",
  background: "/Services/adult/Terapia_adultos_Mujer_agarrándose_rostro_feliz.webp",
  bgdown:"/Services/adult/Terapia_adultos_Mujer_afro_feliz_tablet.webp",
  bgup:"/Services/adult/bgupadultos.webp",

  description:
    "Estamos aquí para ayudarte a recuperar el equilibrio. A través de la terapia para adultos, encontrarás un espacio para comprenderte mejor, gestionar las situaciones difíciles y fortalecer tu bienestar emocional.¡Es el momento de dar el primer paso hacia una vida más equilibrada y plena!",
  tittleIcon:
    "¡Recupera tu bienestar emocional! A través de la terapia para adultos,te ayudamos a enfrentar desafíos.",
  iconos: [
    {
      id: 1,
      text: "Estrés",
      iconImage: "/Services/adult/estres.webp",
    },
    {
      id: 2,
      text: "Desafíos laborales",
      iconImage: "/Services/adult/laborales.webp",
    },
    {
      id: 3,
      text: "Dificultades emocionales",
      iconImage: "/Services/adult/dificultades.webp",
    },
    {
      id: 4,
      text: "Proceso de duelo",
      iconImage: "/Services/adult/duelo.webp",
    },
    {
      id: 5,
      text: "Crecimiento personal",
      iconImage: "/Services/adult/personal.webp",
    },
  ],
  tittlecards: "Beneficios de la terapia para adultos",
  cards: [
    {
      id: 1,
      text: "Aprenderás a manejar el estrés y la ansiedad para recuperar tu equilibrio emocional.",
      icon: "/Services/adult/therapy/manejar.webp",
    },
    {
      id: 2,
      text: "Comprenderás y gestionarás tus emociones, tomando decisiones más conscientes.",
      icon: "/Services/adult/therapy/comprender.webp",
    },
    {
      id: 3,
      text: "Fortalecerás tu confianza al trabajar en tus habilidades y superar límites.",
      icon: "/Services/adult/therapy/fortalecer.webp",
    },
    {
      id: 4,
      text: "Te enseñaremos cómo enfrentar los desafíos de la vida diaria de manera saludable y resiliente.",
      icon: "/Services/adult/therapy/enfrentar.webp",
    },
    {
      id: 5,
      text: "Te ayudará a gestionar conflictos emocionales y mejorar tus relaciones personales y laborales.",
      icon: "/Services/adult/therapy/gestion.webp",
    },
  ],
  textfooter:
    "Estamos aquí para acompañarte y ayudarte a transformar<br/>tus retos en oportunidades de crecimiento personal.",
    textfootermobile:
    "Estamos aquí para acompañarte y <br/>ayudarte a transformartus retos en <br/>oportunidades de crecimiento personal.",
  },

]

export default function Home() {


  return <ServicesStructure services={AdultoTerapias} />

  }