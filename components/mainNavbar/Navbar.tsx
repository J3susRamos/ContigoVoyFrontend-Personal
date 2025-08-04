"use client";
import Link from "next/link";
import React from "react";
import { DesktopNav } from "./DesktopNav";
import Image from "next/image";
import { MobileNav } from "./MobileNav";
import { NavLink, NavItem } from "./types/navBar.types";

const serviciosLinks: NavLink[] = [
  { name: "Terapia para Niños", link: "/servicios/terapia/infantes" },
  {
    name: "Terapia para Adolescentes",
    link: "/servicios/terapia/adolescentes",
  },
  { name: "Terapia para Adultos", link: "/servicios/terapia/adultos" },
  { name: "Terapia para Parejas", link: "/servicios/terapia/parejas" },
  { name: "Terapia Familiar", link: "/servicios/terapia/familia" },
  { name: "Terapia Empresarial", link: "/servicios/terapia/empresarial" },
];

const contigoLinks: NavLink[] = [
  { name: "Inicio", link: "/" },
  { name: "Sobre nosotros", link: "/sobreNosotros" },
  { name: "Contáctanos", link: "/contactanos" },
  { name: "Preguntas frecuentes", link: "/PreguntasFrecuentes" },
];

const navItemsDesktop : NavItem[] = [
  {
    name: "ContigoVoy",
    link: "/",
    dropList: contigoLinks
  },
  {
    name: "Servicios",
    link: "/#",
    dropList: serviciosLinks
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

const navItemsMobil : NavItem[]= [
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
    <nav className="bg-white dark:bg-gray-900 h-[80px] flex items-center sticky w-full z-40 top-0 border-b-2 border-gray-300 dark:border-gray-700">
      <div className="w-full px-4 lg:px-6 flex items-center justify-between relative">
        <Link
          href="/"
          className="ml-16  xl:ml-[60px] min-[1450px]:ml-[58px] z-10"
        >
          <Image
            src="/LOGO.webp"
            title="Contigo Voy Psicología | Centro Psicologico Online"
            alt="Centro Psicológico Contigo Voy Online"
            width={143}
            height={50}
            priority
            style={{ height: "auto" }}
            className="w-[143px] lg:max-w-[160px] h-auto"
            suppressHydrationWarning
          />
        </Link>
        <div className="flex items-center gap-x-5">
          <DesktopNav navItems={navItemsDesktop} />
          <div className="lg:hidden ">
            <MobileNav navItems={navItemsMobil} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
