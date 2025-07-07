"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Importar useRouter
import { UsuarioLocalStorage } from "@/interface";
import CerrarSesion from "@/components/CerrarSesion";

const EmailMarketingPage = () => {
  const router = useRouter(); // ✅ Instanciar el router
  const [user, setUser] = useState<UsuarioLocalStorage | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser) as UsuarioLocalStorage);
      }
    }
  }, []);
  if (!user) return (
    <div className="h-screen flex items-center justify-center bg-[#f8f8ff] dark:bg-background">
      <div className="text-lg font-medium text-primary dark:text-primary-foreground">Cargando...</div>
    </div>
  );

  return (
    <div className="bg-[#f8f8ff] dark:bg-background min-h-screen flex flex-col">
      {/* Header principal */}
      <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center w-full mt-6 md:mt-10 mb-4 md:mb-6 px-4 md:px-8 gap-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <h1 className="font-bold text-2xl md:text-[32px] leading-7 md:leading-[40px] text-primary dark:text-primary-foreground text-center md:text-left">
            Estrategias de Marketing
          </h1>
        </div>
        <div className="flex items-center gap-4 justify-center md:justify-end">
          <CerrarSesion />
        </div>
      </div>      {/* Contenido principal */}
      <div className="flex-1 px-4 md:px-8 pb-8 flex items-center">
        <div className="max-w-7xl mx-auto bg-background dark:bg-background rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden w-full">
          <div className="flex flex-col lg:flex-row h-[500px] lg:h-[450px]">
            {/* Columna izquierda */}
            <div className="w-full lg:w-1/2 flex flex-col items-start justify-center p-8 lg:p-12">
              <div className="w-full max-w-lg">
                <h2 className="text-3xl lg:text-5xl font-bold text-primary dark:text-primary mb-6 leading-tight">
                  ¡Crea tu primera campaña email marketing!
                </h2>
                <p className="text-lg text-[#8a8af3] dark:text-[#9999ff] mb-8 leading-relaxed">
                  ¿Quieres comunicarte con tus pacientes?<br />
                  Informa sobre las novedades de tu negocio, ofertas y promociones directamente a través de Contigo Voy.
                </p>
                <button
                  onClick={() => router.push("/user/marketing/crear")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Crear mi primera campaña
                </button>
              </div>
            </div>

            {/* Columna derecha */}
            <div className="w-full lg:w-1/2 flex items-center justify-center relative p-8 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
              <div className="bg-background dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md relative border border-gray-200 dark:border-gray-700">
                <div className="mb-6 flex justify-center">
                  <img
                    src="/marketing.svg"
                    alt="Campaña Email Marketing"
                    className="w-[300px] h-auto rounded-md"
                  />
                </div>

                <div className="text-center space-y-4">
                  <h3 className="font-bold text-primary dark:text-primary text-xl">
                    📢 ¡No dejes pasar esta oportunidad!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    Descubre cómo este beneficio puede transformar tu experiencia.<br />
                    🎯 Únete hoy y accede a nuestra oferta exclusiva.
                  </p>
                </div>

                <button
                  className="absolute left-1/2 -translate-x-1/2 -bottom-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:scale-105 group"
                  onClick={() => router.push("/user/marketing/crear")}
                >
                  <span className="mr-2">Comenzar</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailMarketingPage;
