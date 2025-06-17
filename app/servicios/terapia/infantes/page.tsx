import ServicesStructure from "@/components/Services/ServicesStructure"
import { ServicesStructureProps } from "@/interface"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terapia Infantil Online en Contigo Voy | Psicólogos para niños de 3 a 12 años",
  description: "Recupera la armonía con terapia familiar online. Mejora la comunicación, resuelve conflictos y fortalece los vínculos entre los miembros de tu familia.Terapia psicológica infantil online. Ayudamos a tu hijo a manejar emociones y crecer feliz. Psicólogos expertos en desarrollo emocional. Terapia en línea.",
};

const NinosTerapias:ServicesStructureProps[] =[{

  title: "Terapia para niños",
    edad: "De 3 a 12 años de edad",
    motto:
      "¿Por qué no darle a tu pequeño la oportunidad de crecer emocionalmente con la ayuda de un profesional?",
    background: "/Services/niños/terapia-psicologica-para-ninos.webp",
    bgdown:"/Services/niños/ayuda-emocional-para-ninos-madre-tablet.webp",
    bgup:"/Services/ninos/bgupinfante.webp",

    description:
      "  Ayuda a tu hijo a superar sus desafíos emocionales con nuestra terapia infantil. Apoyamos a los niños a comprender y manejar sus emociones, mejorando su bienestar de manera accesible y con la participación activa de los padres en cada sesión online.  ",
    tittleIcon:
      "En Contigo Voy, puedes encontrar a un psicólogo infantil online para ayudar a tu hijo a enfrentar una variedad de temas.",
      
    iconos: [
      {
        id: 1,
        text: "Dificultades en el desarrollo del lenguaje",
        iconImage: "/Services/ninos/lenguaje.webp",
      },
      {
        id: 2,
        text: "Habilidades sociales",
        iconImage: "/Services/ninos/sociales.webp",
      },
      {
        id: 3,
        text: "Manejo de la fustración",
        iconImage: "/Services/ninos/frustracion.webp",
      },
      {
        id: 4,
        text: "Vinculo de apego",
        iconImage: "/Services/ninos/apego.webp",
      },
      {
        id: 5,
        text: "Dificultades académicas",
        iconImage: "/Services/ninos/academicas.webp",
      },
    ],
    tittlecards: "Beneficios de la terapia infantil",
    cards: [
      {
        id: 1,
        text: "Detecta y modifica patrones que afectan su desarrollo, promoviendo un crecimiento equilibrado.",
        icon: "/Services/ninos/therapy/cerebro.webp",
      },
      {
        id: 2,
        text: "Mejora la interacción, promoviendo respeto, colaboración y relaciones positivas.",
        icon: "/Services/ninos/therapy/charla.webp",
      },
      {
        id: 3,
        text: "Ayuda a los niños a desarrollar una imagen positiva, promoviendo su felicidad y confianza.",
        icon: "/Services/ninos/therapy/positiva.webp",
      },
      {
        id: 4,
        text: "Enseña a los niños a manejar sus emociones y enfrentar desafíos con resiliencia.",
        icon: "/Services/ninos/therapy/rompe.webp",
      },
      {
        id: 5,
        text: "Proporciona herramientas personalizadas para enfrentar dificultades y adaptarse asertivamente.",
        icon: "/Services/ninos/therapy/herramientas.webp",
      },
    ],
    textfooter:
      "¿Tu pequeño enfrenta desafíos como falta de atención?<br/>¿Tiene una conducta agresiva?",

      textfootermobile:
      "¿Tu pequeño enfrenta desafíos como falta de atención?<br/> ¿Tiene una conducta agresiva?",
    
  }


]

export default function Ninos() {


  return <ServicesStructure services={NinosTerapias} />

  }