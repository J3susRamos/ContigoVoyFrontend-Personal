"use client";
import Link from "next/link";
import React from "react";
import { DesktopNav } from "./DesktopNav";
import Image from "next/image";

const navItems = [
  {
    name: "Inicio",
    link: "/",
  },
  {
    name: "Sobre Nosotros",
    link: "/sobreNosotros",
  },
  {
    name: "Servicios",
    link: "/#",
  },
  {
    name: "Contáctanos",
    link: "/contactanos",
  },
  {
    name: "Preguntas Frecuentes",
    link: "/PreguntasFrecuentes",
  },
  {
    name: "Blog",
    link: "/blog",
  },
  {
    name: "Reservar Cita",
    link: "/ReservarCita",
  },
  {
    name: "Iniciar Sesión",
    link: "/login",
    isButton: true,
  },
];

const Navbar = () => {
  return (    <nav className="bg-background h-[80px] flex items-center sticky w-full z-40 top-0 border-gray-500 border-b-2">
      <div className="w-full px-4 lg:px-6 flex items-center justify-between relative">
        <Link href="/" className="ml-16  xl:ml-[60px] min-[1450px]:ml-[58px] z-10">
          <Image
            src="/LOGO.webp"
            alt="Centro Psicológico Contigo Voy Online"
            width={143}
            height={50}
            priority
            style={{height: 'auto' }}
            className="w-[143px] lg:max-w-[160px] h-auto"
            suppressHydrationWarning
          />
        </Link>
        <div className="flex items-center gap-x-5">
          <DesktopNav navItems={navItems} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
