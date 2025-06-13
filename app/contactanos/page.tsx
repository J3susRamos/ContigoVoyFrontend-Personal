import { Metadata } from "next";
import FormContacto from "@/components/contactUs/FormContacto";

export const metadata: Metadata = {
  title: "Contactanos - ContigoVoy",
  description: "Contáctanos para recibir apoyo emocional y psicológico",
};

const ContactUs = () => {
  return (
    <div
      className="min-h-screen w-full lg:bg-auto bg-no-repeat lg:bg-bottom bg-bottom responsive-bg"
      style={{
        backgroundImage: `linear-gradient(#634AE27A, #634AE27A), url('/consulta-asesoría-psicológica-online.webp')`,
      }}
    >
      <div className="container mx-auto px-0 md:px-0 lg:px-0 py-20">
        <div className="grid lg:grid-row-2 gap-8 items-center">
          <div className="text-white space-y-6">
            <h1 className="text-2xl md:text-5xl lg:text-6xl xl:text-7xl ml-12 font-bold">
              <p className="mb-4">¡La solución que buscas,</p>
              <p className="mb-12">empieza aquí!</p>
            </h1>
            <h3 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold ml-12">
              Contáctanos
            </h3>
          </div>
          <div className="w-full md:w-96 lg:w-96 flex justify-center lg:justify-start">
            <FormContacto />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
