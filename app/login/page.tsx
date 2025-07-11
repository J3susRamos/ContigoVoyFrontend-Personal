"use client";
import Login from "@/components/auth/login";
import { useEffect } from "react";

export default function Logeo() {
  useEffect(() => {
    document.title = "Tu Proceso, Siempre Contigo | Inicia Sesión Contigo Voy";

    const metaDescription = document.querySelector("meta[name='description']");

    if (metaDescription) {
      metaDescription.setAttribute(
        "content",

        "Ingresa con tu usuario para acceder a tus terapias online, horarios y seguimiento. Una plataforma segura creada para continuar tu proceso con Contigo Voy."
      );
    } else {
      const meta = document.createElement("meta");

      meta.name = "description";

      meta.content =
        "Ingresa con tu usuario para acceder a tus terapias online, horarios y seguimiento. Una plataforma segura creada para continuar tu proceso con Contigo Voy.";

      document.head.appendChild(meta);
    }
  }, []);
  return (
    <Login />
  );
}
