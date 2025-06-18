"use client";
import React, { useEffect, useState } from "react";
import DashboardComponents from "@/components/User/Dashboard/DashboardComponents";
import { Citas, UsuarioLocalStorage } from "@/interface";
import CerrarSesion from "@/components/CerrarSesion";
import { GetCitasPsicologoPorMes } from "@/app/apiRoutes";

const PageHome = () => {
  const [user, setUser] = useState<UsuarioLocalStorage | null>(null);
  const [citasDelDia, setCitasDelDia] = useState<Citas[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser) as UsuarioLocalStorage);
      }

      GetCitasPsicologoPorMes().then(res => {
        const hoy = new Date();
        const citasHoy = res.result.filter((cita: Citas) => {
          const fecha = new Date(cita.fecha_inicio);
          return (
            fecha.getDate() === hoy.getDate() &&
            fecha.getMonth() === hoy.getMonth() &&
            fecha.getFullYear() === hoy.getFullYear()
          );
        });
        setCitasDelDia(citasHoy);
      });
    }
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <section className="bg-[#f8f8ff] dark:bg-background min-h-screen">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="m-5">
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
          <h1 className="text-2xl md:text-4xl font-bold text-primary dark:text-primary-foreground">
            Buenos días, {user.nombre} {user.apellido}
          </h1>
          <p className="text-base md:text-xl font-normal text-primary dark:text-primary-foreground">
            Prepárate para un gran día.
          </p>
          <p className="text-base md:text-xl font-bold text-primary dark:text-primary-foreground">
            Tienes {citasDelDia?.length} citas programadas para hoy
          </p>
          <p className="text-base md:text-xl font-normal text-primary dark:text-primary-foreground">
            Aprovecha para planificar tus próximos objetivos.
          </p>
        </>
      )}
        </div>
        <div className="mx-auto md:mx-0 m-4 md:m-5 flex items-center gap-4">
          <CerrarSesion />
        </div>
      </div>
      <DashboardComponents />
    </section>
  );
};
export default PageHome;
