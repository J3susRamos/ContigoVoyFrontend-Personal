"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ReactSVG } from "react-svg";
import { DesktopNavUser } from "./DesktopNavUser";
import { Icons } from "@/icons";
import { MobileNavUserHamburger } from "./MobileNavUserHamburger";
import { UsuarioLocalStorage } from "@/interface";

const navItemsBase = [
  {
    name: "Dashboard",
    link: "/user/home",
    icono: Icons.dashboard,
  },
  {
    name: "Citas Sin Pagar",
    link: "/user/citas-sin-pagar",
    icono: Icons.citas,
  },
  {
    name: "Registro de personal",
    link: "/user/personal",
    icono: Icons.personal,
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
    link: "/user/politicas",
    icono: Icons.politicasyPriv,
  },
];

const NavbarUser = () => {
  const [estado, setEstado] = useState<boolean>(false);
  const [navItems, setNavItems] = useState(navItemsBase);
  const panelRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const cancelarCitasVencidas = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/citas/cancelar-citas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: 'Sin pagar' }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Error al cancelar citas:', data);
      } else {

      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
    }
  };

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
        items = items.filter(
          (item) =>
            item.name !== "Registro de personal" && item.name !== "Psicologos" && item.name !== "Citas Sin Pagar"
        );
      }

      if (user.rol === "ADMIN") {
        items = items.filter(
          (item) => item.name !== "Citas" && item.name !== "Historial" && item.name !== "Dashboard"
        );
      } else {
        items = items.map((item) => {
          if (item.name === "Citas") {
            return {
              ...item,
              onClick: () => {
                cancelarCitasVencidas();
              },
            };
          }
          return item;
        });
      }

      setNavItems(items);
    }
  }, []);
  return (
    <div className="flex flex-row bg-[#E7E7FF] dark:bg-[#19191a]">
      {/* Mobile Navbar - Menú hamburguesa para pantallas menores a 1024px */}
      <div className="lg:hidden bg-[#E7E7FF] dark:bg-[#19191a] flex-1">
        <nav className="bg-background h-[80px] flex items-center sticky w-full z-40 top-0 border-gray-500 border-b-2">
          <div className="w-full p-6 flex items-center justify-between">
            <Link href="/" className="ml-[60px] z-0">
              <ReactSVG
                src="/logoHeader.svg"
                title="Contigo Voy Psicología | Centro Psicologico Online"
                width={143}
                height={50}
                style={{ height: "auto" }}
                className="w-[143px] lg:max-w-[160px] h-auto"
                beforeInjection={(svg) => {
                  svg.classList.add("fill-[#5d4bdd]", "dark:fill-gray-100");
                }}
              />
            </Link>

            <div className="flex items-center gap-x-5">
              <MobileNavUserHamburger navItems={navItems} />
            </div>
          </div>
        </nav>
      </div>

      {/* Desktop Navbar - Solo para pantallas de 1024px o más */}
      <div className="hidden lg:flex w-72 h-screen fixed bg-[#f8f8ff] dark:bg-background">
        <div className="bg-card dark:bg-[#19191a] w-full h-full pt-7 flex flex-col">

          <Link href="/">
            <h1 className="font-normal text-3xl flex justify-center items-center">
              <ReactSVG
                src="/logoHeader.svg"
                title="Contigo Voy Psicología | Centro Psicologico Online"
                style={{ height: "auto" }}
                className="w-[163px] -ml-scv5"
                beforeInjection={(svg) => {
                  svg.classList.add("fill-[#5d4bdd]", "dark:fill-gray-100");
                }}
              />
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
