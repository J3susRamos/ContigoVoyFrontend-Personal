import ServicesStructure from "@/components/Services/ServicesStructure"
import { ServicesStructureProps } from "@/interface"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terapia Familiar Online | Contigo Voy fortalece los lazos en tu hogar",
  description: "Recupera la armonía con terapia familiar online. Mejora la comunicación, resuelve conflictos y fortalece los vínculos entre los miembros de tu familia.",
};

 const FamilyTerapias: ServicesStructureProps[] = [
   {
     title: "Terapia familiar",
     edad: "Para todos los miembros",
     motto:
       "¿Sientes que los conflictos familiares están afectando el bienestar de tu hogar?",
     background: "/Services/family/terapia-familiar-online.webp",
     bgdown: "/Services/family/terapia-para-mejorar-relaciones-familiares.webp",
     bgup: "/Services/family/bgupfamily.webp",
     description:
       "Estamos aquí para ayudarte a sanar y fortalecer los lazos entre ustedes. En la terapia familiar,encontrarás un espacio para comunicarse, comprenderse mejor y resolver las dificultades que afectan a tu familia. Juntos podemos restaurar el equilibrio y la armonía.",
     tittleIcon:
       "¡Recupera la armonía en tu hogar! A través de la terapia familiar,te ayudamos a enfrentar juntos los desafíos.",
     iconos: [
       {
         id: 1,
         text: "Conflictos familiares",
         iconImage: "/Services/family/familiares.webp",
       },
       {
         id: 2,
         text: "Problemas de comunicación",
         iconImage: "/Services/family/problemascomu.webp",
       },
       {
         id: 3,
         text: "Problemas de divorcio o separación",
         iconImage: "/Services/family/divorcio.webp",
       },
       {
         id: 4,
         text: "Relaciones tensas",
         iconImage: "/Services/family/tensas.webp",
       },
       {
         id: 5,
         text: "Desacuerdos en la gestión del hogar",
         iconImage: "/Services/family/desacuerdo.webp",
       },
     ],
     tittlecards: "Beneficios de la terapia familiar",
     cards: [
       {
         id: 1,
         text: "Fomenta una comunicación más abierta y respetuosa.",
         icon: "/Services/family/therapy/respeto.webp",
       },
       {
         id: 2,
         text: "Ayuda a resolver conflictos de manera constructiva.",
         icon: "/Services/family/therapy/resolver.webp",
       },
       {
         id: 3,
         text: "Fortalece los lazos afectivos entre los miembros de la familia.",
         icon: "/Services/family/therapy/lazos.webp",
       },
       {
         id: 4,
         text: "Promueve un ambiente emocionalmente seguro y saludable.",
         icon: "/Services/family/therapy/ambiente.webp",
       },
       {
         id: 5,
         text: "Facilita la adaptación a cambios importantes en la vida familiar.",
         icon: "/Services/family/therapy/adaptacion.webp",
       },
     ],
     textfooter:
       "¡Es el momento de dar el primer paso hacia un hogar<br/>más unido y saludable!",
     textfootermobile:
       "¡Es el momento de dar el primer <br/>paso hacia un hogar<br/>más unido y saludable!",
     promotionCards: [
       {
         id: 1,
         title: "Terapia familiar",
         preciounit: "s/129",
         cents: ".00",
         regularprice: "Precio regular: s/139.00",
         list: [
           {
             id: 1,
             text: "Sesiones online de 40 a 50 minutos.",
           },
           {
             id: 2,
             text: "Estrategias para resolver conflictos.",
           },
           {
             id: 3,
             text: "Unión familiar y entendimiento mutuo.",
           },
           { id: 4, text: "Psicólogos expertos en dinámicas familiares." },
         ],
       },
     ],
   },
 ];

export default function Home() {


  return <ServicesStructure services={FamilyTerapias} />

  }