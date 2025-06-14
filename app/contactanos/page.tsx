import { Metadata } from "next";
import FormContacto from "@/components/contactUs/FormContacto";

export const metadata: Metadata = {
  title: "Contactanos - ContigoVoy",
  description: "Contáctanos para recibir apoyo emocional y psicológico",
};

const ContactUs = () => {
  return (
    <div className="w-full relative overflow-y-hidden over overflow-x-clip"
        style={{
          backgroundImage: 'linear-gradient(90.11deg, rgba(54, 22, 216, 0.48) 44.23%, rgba(120, 99, 227, 0.48) 94.52%)'
        }}    
    > 
      <div
        className="z-0 absolute pointer-events-none top-0 left-0 -bottom-[20px] -right-[5vw] bg-[url('/consulta-asesoría-psicológica-online.webp')] bg-no-repeat bg-[length:850px] sm:bg-[length:1300px] bg-bottom opacity-50"
      ></div>
      <div className="relative z-10 max-w-scv18 mx-auto min-h-screen">
        <div className="container px-scv7 pt-scv7 sm:pt-scv8 sm:px-scv9">
            <div className="text-white space-y-6">
              <h1 style={{textShadow: "2px 3px 8px rgba(0,0,0,0.25), 1px 2px 3px rgba(0,0,0,0.32)"}} 
                  className="text-cv6 sm:text-cv10 sm:leading-[60px] font-bold w-full max-w-scv17">
                ¡La solución que buscas, empieza aquí!
              </h1>
              <h3 style={{textShadow: "4px 5px 16px rgba(0,0,0,0.35), 2px 2px 3px rgba(0,0,0,0.45)"}} 
                className="text-cv7 sm:text-cv8  font-bold mt-scv6">
                Contáctanos
              </h3>
            </div>
            <div className="mt-scv5 w-full flex pb-scv9">
              <FormContacto />
            </div>
        </div>
      </div>
    </div>
    
  );
};

export default ContactUs;
