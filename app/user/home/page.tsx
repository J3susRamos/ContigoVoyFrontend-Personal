"use client";
import React, { useEffect, useState } from "react";
import DashboardComponents from "@/components/User/Dashboard/DashboardComponents";
import { UsuarioLocalStorage } from "@/interface";
import CerrarSesion from "@/components/CerrarSesion";

const PageHome = () => {
  const [user, setUser] = useState<UsuarioLocalStorage | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser) as UsuarioLocalStorage);
      }
    }
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <section className="bg-background min-h-screen">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="m-5">
        <h1 className="text-2xl md:text-4xl  font-bold text-primary dark:text-primary-foreground">
          Buenos días, {user.nombre} {user.apellido}
        </h1>
        <p className="text-base md:text-xl font-normal text-primary dark:text-primary-foreground">
          Prepárate para un gran día.
        </p>
        <p className="text-base md:text-xl font-bold text-primary dark:text-primary-foreground">
          Tienes x citas programadas para hoy
        </p>
        <p className="text-base md:text-xl font-normal text-primary dark:text-primary-foreground">
          Aprovecha para planificar tus próximos objetivos.
        </p>
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
