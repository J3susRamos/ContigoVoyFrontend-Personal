import { Metadata } from "next";
import FormContacto from "@/components/contactUs/FormContacto";

export const metadata: Metadata = {
  title: "Contáctanos - Centro psicológico | Contigo Voy",
  description: "En Contigo Voy te escuchamos, llena nuestro formulario de contacto y da el primer paso hacia tu bienestar con un equipo psicológico que te acompaña siempre",
};

const ContactUs = () => {
  
  return (
    <div className="flex flex-col justify-center min-h-screen w-full relative overflow-y-hidden overflow-x-clip bg-large-gradient"> 
      <div className="lg:relative overflow-y-hidden overflow-x-clip ">
        <div role="img" aria-label="Contactanos Terapia Psicológica Contigo Voy Online"
          className="mix-blend-multiply z-0 absolute pointer-events-none top-0 -left-[150px] lg:-left-0 -bottom-[20px] -right-[0] sm:-right-[130px]  bg-[url('/consulta-asesoría-psicológica-online.webp')] bg-no-repeat bg-[length:850px] sm:bg-[length:1250px] bg-bottom"
        ></div>
        <div className="relative z-10 max-w-scv18 mx-auto">
          <div className="container px-scv7 pt-scv7 sm:pt-scv8 sm:px-scv9">
              <div className="text-white space-y-6">
                <h1 style={{textShadow: "2px 3px 8px rgba(0,0,0,0.25), 1px 2px 3px rgba(0,0,0,0.32)"}} 
                    className="text-cv8 sm:text-cv9 sm:leading-[60px] font-bold w-full max-w-scv16">
                  ¡La solución que buscas, empieza aquí!
                </h1>
                <h3 style={{textShadow: "4px 5px 16px rgba(0,0,0,0.35), 2px 2px 3px rgba(0,0,0,0.45)"}} 
                  className="text-cv8 sm:text-cv8  font-bold mt-scv6">
                  Contáctanos
                </h3>
              </div>
              <div className="mt-scv5 w-full flex pb-scv9">
                <FormContacto />
              </div>
          </div>
        </div>
        
      </div>
      
    </div>
    
  );
};

export default ContactUs;
