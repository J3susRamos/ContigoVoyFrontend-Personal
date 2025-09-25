"use client";
import React, { useEffect, useState } from "react";
import DashboardComponents from "@/components/User/Dashboard/DashboardComponents";
import { Citas, UsuarioLocalStorage } from "@/interface";
import CerrarSesion from "@/components/CerrarSesion";
import { GetCitasPsicologoPorMes } from "@/app/apiRoutes";
import showToast from "@/components/ToastStyle";
import { useRouter } from "next/navigation";

const PageHome = () => {
  const [user, setUser] = useState<UsuarioLocalStorage | null>(null);
  const [citasDelDia, setCitasDelDia] = useState<Citas[]>([]);
  const [currentTime, setCurrentTime] = useState<string>("");
  const router = useRouter();

  // Función para actualizar la hora
  const updateTime = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    setCurrentTime(timeString);
  };

  // Effect para actualizar la hora
  useEffect(() => {
    updateTime(); // Actualizar inmediatamente
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser) as UsuarioLocalStorage;
        setUser(userData);
        
        // Si es administrador, redirigir directamente a citas sin pagar
        if (userData.rol === "ADMIN") {  //
          router.push("/user/citas-sin-pagar");
          return;
        }
      }

      GetCitasPsicologoPorMes().then(res => {
        const hoy = new Date();
        const citasHoy = res.result.filter((cita: Citas) => {
          const fecha = new Date(cita.fecha_inicio);
          return (
            fecha.getDate() === hoy.getDate() &&
            fecha.getMonth() === hoy.getMonth() &&
            fecha.getFullYear() === hoy.getFullYear() &&
              (cita.estado === "Pendiente")
          );
        });
        setCitasDelDia(citasHoy);
      }).catch(err => {
        console.log(err)
        return showToast("success", "No tienes citas agendadas para hoy")}
      );
    }
  }, [router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <section className="bg-white dark:bg-[#020202] min-h-screen pt-16 sm:pt-20 md:pt-6">

      <div className="flex flex-col md:flex-row justify-between">
        <div className="m-5 mt-2 sm:mt-4 md:mt-5">
        {user.rol === "ADMIN" ? (
        <>
          <h1 className="text-2xl md:text-4xl font-bold text-primary dark:text-primary-foreground">
            Bienvenido, administrador {user.nombre} {user.apellido}
          </h1>
          <p className="text-base md:text-xl font-normal text-primary dark:text-primary-foreground">
            Este espacio está diseñado para la gestión estratégica del equipo.
          </p>
          <p className="text-base md:text-xl font-normal text-primary dark:text-primary-foreground">
            Revisa y organiza el personal de forma eficiente.
          </p>
        </>
      ) : (
        <>
          {/* Saludo personalizado con hora al lado */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4 mb-4 border-l-4 border-purple-600">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Contenido principal del saludo */}
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-800 dark:text-white mb-2">
                  <span className="flex items-center gap-2">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span className="break-words">Buenos días, {user.nombre} {user.apellido}</span>
                  </span>
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 mb-2">
                  Prepárate para un gran día de trabajo.
                </p>
                
                {/* Citas del día destacadas */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-white dark:bg-gray-600 rounded-lg p-3 shadow-sm mb-2">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-semibold text-blue-800 dark:text-blue-200 text-sm sm:text-base">
                      {citasDelDia?.length} cita{citasDelDia?.length !== 1 ? 's' : ''} programada{citasDelDia?.length !== 1 ? 's' : ''} para hoy
                    </span>
                  </div>
                </div>
                
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  💡 Aprovecha para planificar tus próximos objetivos
                </p>
              </div>

              {/* Hora actual al lado en desktop */}
              <div className="lg:flex-shrink-0">
                <div className="flex items-center gap-3 bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm border border-purple-200 dark:border-gray-600">
                  <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Hora actual</p>
                    <p className="text-lg font-bold text-purple-600 dark:text-purple-400 font-mono">
                      {currentTime}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
        </div>
        <div className="mx-auto md:mx-0 m-4 md:m-5 mt-2 md:mt-5 flex items-center gap-4">
          <CerrarSesion />
        </div>
      </div>
      <DashboardComponents />
    </section>
  );
};
export default PageHome;
