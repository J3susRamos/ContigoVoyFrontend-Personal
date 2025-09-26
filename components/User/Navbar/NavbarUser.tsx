"use client";
import React, { useEffect, useState } from "react";
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
    role: "both"
  },
  {
    name: "Citas",
    icono: Icons.citas,
    key: 'citas-parent',
    role: 'admin',
    hijos: [
      {
        name: "Citas sin Pagar",
        link: "/user/citas-sin-pagar",
        icono: Icons.citas,
      },
      {
        name: "Citas Pagadas",
        link: "/user/citas-pagadas",
        icono: Icons.citas,
      }
    ]
  },
  {
    name: "Registro de personal",
    link: "/user/personal",
    icono: Icons.personal,
    role: "admin"
  },
  {
    name: "Gestión de Trabajadores",
    link: "/user/trabajadores",
    icono: Icons.personal,
    role: "admin"
  },
  {
    name: "Gestión de Roles en Usuarios",
    link: "/user/gestion-roles-temporales",
    icono: Icons.personal,
    role: "admin"
  },
  {
    name: "Pacientes",
    link: "/user/pacientes",
    icono: Icons.pacientes,
    role: "both"
  },
  {
    name: "Psicologos",
    link: "/user/psicologos",
    icono: Icons.psicologos,
    role: "admin"
  },
  {
    name: "Citas",
    link: "/user/citas",
    icono: Icons.citas,
    role: 'psico'
  },
  {
    name: "Historial",
    link: "/user/historial",
    icono: Icons.historial,
    role: "psico"
  },
  {
    name: "Calendario",
    link: "/user/calendario",
    icono: Icons.calendario,
    role: "both"
  },
  {
    name: "Estadisticas",
    link: "/user/estadisticas",
    icono: Icons.estadisticas,
    role: "both"
  },
  {
    name: "Blog",
    link: "/user/blog",
    icono: Icons.blog,
    role: "psico"
  },
  {
    name: "Marketing",
    link: "/user/marketing",
    icono: Icons.marketing,
    role: "psico"
  },
  {
    name: "Politicas y Privacidad",
    link: "/user/politicas",
    icono: Icons.politicasyPriv,
    role: "psico"
  },
];

// Interface debe estar FUERA del componente
interface UsuarioConRolesTemporales {
  id: number;
  name: string;
  email: string;
  rol: string;
  all_roles?: string[];
}

const NavbarUser = () => {
  const [navItems, setNavItems] = useState(navItemsBase);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      try {
        const user: UsuarioConRolesTemporales = JSON.parse(userJson);
        let items = [...navItemsBase];

        // Obtener todos los roles del usuario (permanentes + temporales)
        const userRoles = user.all_roles || [user.rol];

        console.log("Roles del usuario:", userRoles);

        // Filtrar items basado en todos los roles del usuario
        if (userRoles.includes("ADMIN")) {
          items = items.filter(
            (item) => item.role === "admin" || item.role === "both"
          );
        } else if (userRoles.includes("PSICOLOGO")) {
          items = items.filter(
            (item) => item.role === "psico" || item.role === "both"
          );
        } else if (userRoles.includes("MARKETING")) {
          items = items.filter(
            (item) => item.role === "marketing" || item.role === "both"
          );
        } else if (userRoles.includes("PACIENTE")) {
          items = items.filter(
            (item) => item.role === "paciente" || item.role === "both"
          );
        }

        // Lógica adicional para usuarios con múltiples roles
        const hasAdmin = userRoles.includes("ADMIN");
        const hasPsico = userRoles.includes("PSICOLOGO");
        const hasMarketing = userRoles.includes("MARKETING");

        if ((hasAdmin && hasPsico) || (hasAdmin && hasMarketing) || (hasPsico && hasMarketing)) {
          // CORRECCIÓN: Define el tipo de allowedRoles
          const allowedRoles: string[] = []; // ← AÑADE EL TIPO AQUÍ
          if (hasAdmin) allowedRoles.push("admin");
          if (hasPsico) allowedRoles.push("psico");
          if (hasMarketing) allowedRoles.push("marketing");
          allowedRoles.push("both");

          items = items.filter(item => allowedRoles.includes(item.role));
        }

        setNavItems(items);

      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-20 bg-[#E7E7FF] dark:bg-[#19191a]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#634AE2]"></div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Navbar - Menú hamburguesa para pantallas menores a 1024px */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50">
        <nav className="bg-[#E7E7FF] dark:bg-[#19191a] h-[80px] flex items-center border-b border-gray-200 dark:border-gray-700">
          <div className="w-full px-6 flex items-center justify-between">
            <MobileNavUserHamburger navItems={navItems} />
            
            <Link href="/" className="flex-1 flex justify-center">
              <ReactSVG
                src="/logoHeader.svg"
                title="Contigo Voy Psicología | Centro Psicologico Online"
                className="w-[143px] h-auto"
                beforeInjection={(svg) => {
                  svg.classList.add("fill-[#5d4bdd]", "dark:fill-gray-100");
                }}
              />
            </Link>

            <div className="w-10"></div> {/* Espaciador para centrar el logo */}
          </div>
        </nav>
      </div>

      {/* Desktop Navbar - Solo para pantallas de 1024px o más */}
      <div className="hidden lg:flex w-72 h-screen fixed top-0 left-0 bg-[#f8f8ff] dark:bg-[#19191a] z-40 shadow-lg">
        <div className="bg-card dark:bg-[#19191a] w-full h-full pt-7 flex flex-col border-r border-gray-200 dark:border-gray-700">
          <Link href="/" className="mb-8">
            <h1 className="font-normal text-3xl flex justify-center items-center">
              <ReactSVG
                src="/logoHeader.svg"
                title="Contigo Voy Psicología | Centro Psicologico Online"
                className="w-[163px] h-auto"
                beforeInjection={(svg) => {
                  svg.classList.add("fill-[#5d4bdd]", "dark:fill-gray-100");
                }}
              />
            </h1>
          </Link>
          
          <div className="flex-1">
            <DesktopNavUser navItems={navItems} />
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarUser;