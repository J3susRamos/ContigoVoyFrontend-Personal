import ServicesStructure from "@/components/Services/ServicesStructure"
import { ServicesStructureProps } from "@/interface"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terapia Infantil Online en Contigo Voy | Psicólogos para niños de 3 a 12 años",
  description: "Recupera la armonía con terapia familiar online. Mejora la comunicación, resuelve conflictos y fortalece los vínculos entre los miembros de tu familia.Terapia psicológica infantil online. Ayudamos a tu hijo a manejar emociones y crecer feliz. Psicólogos expertos en desarrollo emocional. Terapia en línea.",
};

const NinosTerapias: ServicesStructureProps[] = [
  {
    title: "Terapia para niños",
    edad: "De 3 a 12 años de edad",
    motto:
      "¿Por qué no darle a tu pequeño la oportunidad de crecer emocionalmente con la ayuda de un profesional?",
    background: "/Services/niños/terapia-psicologica-para-ninos.webp",
    bgdown: "/Services/niños/ayuda-emocional-para-ninos-madre-tablet.webp",
    bgup: "/Services/ninos/bgupinfante.webp",

    description:
      "  Ayuda a tu hijo a superar sus desafíos emocionales con nuestra terapia infantil. Apoyamos a los niños a comprender y manejar sus emociones, mejorando su bienestar de manera accesible y con la participación activa de los padres en cada sesión online.  ",
    tittleIcon:
      "En Contigo Voy, puedes encontrar a un psicólogo infantil online para ayudar a tu hijo a enfrentar una variedad de temas.",

    iconos: [
      {
        id: 1,
        title: "Terapia de lenguaje en niños Contigo Voy Psicología Online",
        text: "Dificultades en el desarrollo del lenguaje",
        iconImage: "/Services/ninos/lenguaje.webp",
      },
      {
        id: 2,
        title: "Terapia social infantil Contigo Voy Psicología Online",
        text: "Habilidades sociales",
        iconImage: "/Services/ninos/sociales.webp",
      },
      {
        id: 3,
        title: "Terapia en frustración infantil Contigo Voy Psicología Online",
        text: "Manejo de la fustración",
        iconImage: "/Services/ninos/frustracion.webp",
      },
      {
        id: 4,
        title: "Apego emocional infantil Contigo Voy Psicología Online",
        text: "Vinculo de apego",
        iconImage: "/Services/ninos/apego.webp",
      },
      {
        id: 5,
        title: "Estrés académico infantil Contigo Voy PSicología Online",
        text: "Dificultades académicas",
        iconImage: "/Services/ninos/academicas.webp",
      },
    ],
    tittlecards: "Beneficios de la terapia infantil",
    cards: [
      {
        id: 1,
        title: "Salud Mental Infantil Contigo Voy Psicología Online",
        text: "Detecta y modifica patrones que afectan su desarrollo, promoviendo un crecimiento equilibrado.",
        icon: "/Services/ninos/therapy/cerebro.webp",
        title: "Desarrollo emocional del infante",
      },
      {
        id: 2,
        title: "Relaciones Interpersonales en Infantes Contigo Voy Psicología Online",
        text: "Mejora la interacción, promoviendo respeto, colaboración y relaciones positivas.",
        icon: "/Services/ninos/therapy/charla.webp",
        title: "Interacción con el infante",
      },
      {
        id: 3,
        title: "Ayuda emocional infantil Contigo Voy Psicología Online",
        text: "Ayuda a los niños a desarrollar una imagen positiva, promoviendo su felicidad y confianza.",
        icon: "/Services/ninos/therapy/positiva.webp",
        title: "Imagen positiva del infante",
      },
      {
        id: 4,
        title: "Manejo de emociones en niños Contigo Voy Psicología Online",
        text: "Enseña a los niños a manejar sus emociones y enfrentar desafíos con resiliencia.",
        icon: "/Services/ninos/therapy/rompe.webp",
        title: "Manejo de desafíos del infante",
      },
      {
        id: 5,
        title: "Herramientas para niños Contigo Voy Psicología Online",
        text: "Proporciona herramientas personalizadas para enfrentar dificultades y adaptarse asertivamente.",
        icon: "/Services/ninos/therapy/herramientas.webp",
        title: "Herramientas del infante",
      },
    ],
    textfooter:
      "¿Tu pequeño enfrenta desafíos como falta de atención?<br/>¿Tiene una conducta agresiva?",

    textfootermobile:
      "¿Tu pequeño enfrenta desafíos como falta de atención?<br/> ¿Tiene una conducta agresiva?",
    promotionCards: [
      {
        id: 1,
        title: "Terapia para niños",
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
            text: "Evaluación de habilidades cognitivas.",
          },
          {
            id: 3,
            text: "Juegos terapéuticos adaptados para niños.",
          },
          { id: 4, text: "Psicólogos expertos en desarrollo infantil." },
        ],
      },
    ],
  },
];

export default function Ninos() {


  return <ServicesStructure services={NinosTerapias} />

}