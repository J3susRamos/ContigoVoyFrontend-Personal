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
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="animate-pulse text-xl font-semibold text-gray-600 dark:text-gray-300">
          Cargando...
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-[#020202] dark:via-[#0a0a0a] dark:to-[#1a1a1a] min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center w-full py-6 px-10 border-b border-gray-200 dark:border-gray-700">
        <h1 className="font-bold text-2xl md:text-3xl text-primary dark:text-primary-foreground tracking-tight">
          Panel de Inicio
        </h1>
        <CerrarSesion />
      </div>

      {/* Main content */}
      <section className="flex flex-col justify-center items-center text-center px-6 flex-grow">
        <h2 className="text-3xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 mb-4 animate-fade-in">
          ¡Bienvenido, {user.nombre} {user.apellido}!
        </h2>

        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-3 animate-fade-in delay-100">
          Nos alegra tenerte de vuelta en tu rol como{" "}
          <span className="font-semibold text-primary">{user.rol}</span>.
        </p>

        <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl animate-fade-in delay-200">
          Este es tu espacio de trabajo. Aquí podrás gestionar tus actividades,
          mantenerte organizado y aprovechar al máximo todas las herramientas a tu disposición.
        </p>
      </section>

      {/* Footer */}
      <footer className="text-center py-4 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        © {new Date().getFullYear()} Contigo Voy. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default Welcome;
