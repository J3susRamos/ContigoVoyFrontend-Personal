"use client";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {UsuarioLocalStorage} from "@/interface";
import CerrarSesion from "@/components/CerrarSesion";
import Image from "next/image";

const EmailMarketingPage = () => {
    const router = useRouter();
    const [user, setUser] = useState<UsuarioLocalStorage | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser) as UsuarioLocalStorage);
            }
        }
    }, []);

    if (!user) return <div className="p-10 text-gray-600">Cargando...</div>;

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            {/* Encabezado */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-6 pt-6 pb-4">
                <div>
                    <h1 className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-white">
                        Estrategias de Marketing
                    </h1>
                </div>
                <div className="mt-4 md:mt-0">
                    <CerrarSesion/>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="min-h-[80vh] p-6">
                <div
                    className="max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 transition-colors duration-300">
                    <div className="flex flex-col lg:flex-row gap-6 h-[550px]">
                        {/* Columna izquierda */}
                        <div className="w-[80%] lg:w-1/2 flex flex-col items-start justify-start">
                            <section className="mb-8 w-[80%]">
                                <h1 className="text-5xl font-semibold text-[#7f7fee] mb-3">
                                    ¡Crea tu primera campaña email marketing!
                                </h1>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    ¿Quieres comunicarte con tus pacientes?<br/>
                                    Informa sobre las novedades de tu negocio, ofertas y promociones directamente a
                                    través de Contigo Voy.
                                </p>
                            </section>

                            {/* ✅ Botón que redirige a /templateString */}
                            <button
                                onClick={() => router.push("/user/marketing/crear")}
                                className="bg-[#8a8af3] hover:bg-[#6969d8] text-white font-bold py-2 px-6 rounded-2xl transition duration-200"
                            >
                                Crear mi primera campaña
                            </button>
                        </div>

                        {/* Columna derecha */}
                        <div className="w-full lg:w-1/2 flex items-end justify-center relative">
                            <div
                                className="bg-gray-200 dark:bg-gray-700  p-4 rounded-xl mb-6 text-gray-900 dark:text-white w-[80%] relative transition-colors duration-300">
                                <div className="mb-4 flex justify-center">
                                    <Image
                                        src="/marketing.svg"
                                        alt="Campaña Email Marketing"
                                        width={380}
                                        height={300}
                                        className="w-[380px] h-auto rounded-md"
                                        priority
                                    />
                                </div>

                                <div className="text-center">
                                    <p className="font-bold text-[#7f7fee] text-2xl mb-2">
                                        📢 ¡No dejes pasar esta oportunidad!
                                    </p>

                                    <p className="text-base mb-2">
                                        Descubre cómo este beneficio puede transformar tu experiencia. <br/>
                                        🎯 Únete hoy y accede a nuestra oferta exclusiva.
                                    </p>
                                </div>
                            </div>

                            <button
                                className="absolute -bottom-6 right-0 bg-[#8a8af3] hover:bg-[#6969d8] text-white font-bold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center shadow-md group"
                            >
                                Guardar y enviar
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 ml-2 transition-transform duration-200 group-hover:translate-x-1"
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
    );
};

export default EmailMarketingPage;