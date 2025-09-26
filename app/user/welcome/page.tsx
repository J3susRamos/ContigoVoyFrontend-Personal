"use client";
import React, { useEffect, useState } from "react";
import { UsuarioLocalStorage } from "@/interface";
import CerrarSesion from "@/components/CerrarSesion";
import { useRouter } from "next/navigation";

const Welcome = () => {
  const [user, setUser] = useState<UsuarioLocalStorage | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser) as UsuarioLocalStorage;
        setUser(userData);
      }
    }
  }, [router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white dark:bg-[#020202] min-h-screen flex flex-col">
      <div className="flex justify-between w-full mt-10 mb-6 px-11">
        <h1 className="flex items-center font-bold text-[32px] leading-[40px] text-primary dark:text-primary-foreground">
          Inicio
        </h1>
        <CerrarSesion />
      </div>

      <section className="flex flex-col justify-center items-center text-center px-6 flex-grow">
        <h2 className="text-3xl md:text-5xl font-extrabold text-primary dark:text-primary-foreground mb-4">
          Bienvenido, {user.nombre} {user.apellido}
        </h2>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-2">
          Que tengas un excelente día en tu rol como{" "}
          <span className="font-semibold text-primary">{user.rol}</span>.
        </p>
        <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-2xl">
          Este es tu espacio de trabajo. Aquí podrás gestionar tus actividades,
          mantenerte organizado y aprovechar al máximo tus herramientas.
        </p>
      </section>
    </div>
  );
};

export default Welcome;
