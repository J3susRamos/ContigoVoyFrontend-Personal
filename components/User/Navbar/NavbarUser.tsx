"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { DesktopNavUser } from "./DesktopNavUser";
import { Icons } from "@/icons";
import { MobileNavbar } from "./MobileNavbarUser";
import { UsuarioLocalStorage } from "@/interface";

const navItemsBase = [
  {
    name: "Dashboard",
    link: "/user/home",
    icono: Icons.dashboard,
  },
  {
    name: "Registro de personal",
    link: "/user/personal",
    icono:Icons.personal,
  },
  {
    name: "Pacientes",
    link: "/user/pacientes",
    icono: Icons.pacientes,
  },
  {
    name: "Psicologos",
    link: "/user/psicologos",
    icono: Icons.psicologos,
  },
  {
    name: "Citas",
    link: "/user/citas",
    icono: Icons.citas,
  },
  {
    name: "Historial",
    link: "/user/historial",
    icono: Icons.historial,
  },
  {
    name: "Calendario",
    link: "/user/calendario",
    icono: Icons.calendario,
  },
  {
    name: "Estadisticas",
    link: "/user/estadisticas",
    icono: Icons.estadisticas,
  },
  {
    name: "Blog",
    link: "/user/blog",
    icono: Icons.blog,
  },
  {
    name: "Marketing",
    link: "/user/marketing",
    icono: Icons.marketing,
  },
  {
    name: "Politicas y Privacidad",
    link: "/",
    icono: Icons.politicasyPriv,
  },
];

const NavbarUser = () => {
  const [estado, setEstado] = useState<boolean>(false);
  const [navItems, setNavItems] = useState(navItemsBase);
  const panelRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  
  const handleClickOutside = (event: MouseEvent) => {
    if (
      panelRef.current &&
      !panelRef.current.contains(event.target as Node) &&
      userRef.current &&
      !userRef.current.contains(event.target as Node)
    ) {
      setEstado(false);
      console.log(estado);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      const user: UsuarioLocalStorage = JSON.parse(userJson);
      let items = [...navItemsBase];

      if (user.rol === "PSICOLOGO") {
        items = items.filter(item =>
          item.name !== "Registro de personal" &&
          item.name !== "Psicologos"
        );
      }
      
      if (user.rol === "ADMIN") {
        items = items.filter(item =>
          item.name !== "Pacientes" &&
          item.name !== "Citas" &&
          item.name !== "Historial"
        );
      }
      
      setNavItems(items);
    }
  }, []);

  return (
    <div className="flex flex-row bg-[#f8f8ff] dark:bg-background">
      {/* mainNavbar Mobile*/}
      <div className="lg:hidden bg-[#f8f8ff] dark:bg-background">
        <MobileNavbar navItems={navItems} />
      </div>

      {/* mainNavbar */}
      <div className="hidden lg:flex w-72 h-screen fixed bg-[#f8f8ff] dark:bg-background">
        <div className="bg-card dark:bg-card w-full h-full rounded-tr-3xl pt-7 flex flex-col">
          <Link href="/">
            <h1 className="font-normal text-3xl flex justify-center items-center">
              <Image src={"/LOGO.webp"} priority={true} width={200} height={150} alt="logo" />
            </h1>
          </Link>
          <div className="flex flex-col items-center mt-8 pt-7 mr-7">
            <DesktopNavUser navItems={navItems} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarUser;
