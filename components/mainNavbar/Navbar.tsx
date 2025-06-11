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
  return (
    <nav className="bg-background h-[102px] lg:h-[115px] flex items-center fixed w-full z-40 top-0 border-gray-500 border-b-2">
      <div className="w-full p-6 flex items-center justify-between  ">
        <Link href="/" className="pl-[60px] min-[1450px]:pl-[58px] z-0">
          <Image
            src="/LOGO.webp"
            alt="Company Logo"
            width={143}
            height={50}
            priority
            style={{height: 'auto' }}
            className="w-[143px] sm:w-[160px] lg:w-[179px] lg:max-w-[179px] h-auto"
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
