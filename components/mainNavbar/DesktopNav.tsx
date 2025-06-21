"use client";
import Link from "next/link";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../Themetoggle";
import { MobileNav } from "./MobileNav";
import { ChevronDown } from "lucide-react";

interface NavItem {
  name: string;
  link: string;
  isButton?: boolean;
}

interface DesktopNavProps {
  navItems: NavItem[];
}

interface ServiceLink {
  name: string;
  link: string;
}

export const DesktopNav: React.FC<DesktopNavProps> = ({ navItems }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const pathname = usePathname();

  const serviciosLinks: ServiceLink[] = [
    { name: "Terapia para Niños", link: "/servicios/terapia/infantes" },
    { name: "Terapia para Adolescentes", link: "/servicios/terapia/adolescentes" },
    { name: "Terapia para Adultos", link: "/servicios/terapia/adultos" },
    { name: "Terapia para Parejas", link: "/servicios/terapia/parejas" },
    { name: "Terapia Familiar", link: "/servicios/terapia/familia" },
    { name: "Terapia Empresarial", link: "/servicios/terapia/empresarial" },
  ];

  return (
    <>
      <div className="min-[1450px]:hidden ">
        <MobileNav navItems={navItems}  />
      </div>
      <motion.div
        onMouseLeave={() => setHovered(null)}
        className={cn(
          "relative z-[60] mx-auto hidden w-full flex-row items-center justify-between self-start rounded-full px-4 py-2 lg:flex",
          "inset-x-0 h-16"
        )}
      >
        <div className="flex items-center gap-6">
          <div className="hidden flex-1 flex-row items-center justify-center space-x-0 text-sm text-zinc-600 transition duration-200 hover:text-zinc-800 min-[1450px]:flex gap-1">
            {navItems.map((navItem: NavItem, idx: number) => (
              <div key={idx} className="relative">
                {navItem.isButton ? (
                  <Link href={navItem.link}>
                    <button
                      className={`text-sm sm:text-base border-2 transition-colors duration-300 rounded-full py-1 sm:py-2 px-3 sm:px-4 
                        ${
                          pathname === navItem.link
                            ? "bg-[#634AE2] text-white"
                            : "text-title border-title hover:bg-[#634AE2] hover:text-white"
                        }`}
                      onMouseEnter={() => setHovered(null)}
                    >
                      {navItem.name}
                    </button>
                  </Link>
                ) : navItem.name === "Servicios" ? (
                  <div
                    onMouseEnter={() => {
                      setHovered(idx);
                      setDropdownVisible(true);
                    }}
                    onMouseLeave={() => {
                      setHovered(null);
                      setDropdownVisible(false);
                    }}
                    className="relative"
                  >
                    <Link
                      className={`relative px-4 py-2 flex items-center gap-x-scv1 ${
                        hovered === idx || pathname.includes("/terapia")
                          ? "bg-[#634AE2] rounded-full text-white"
                          : "text-title hover:bg-[#634AE2] hover:text-white rounded-full"
                      }`}
                      href="#"
                    >
                      <span className="relative z-20 text-base ">Servicios</span>
                      <ChevronDown className={`transition-transform duration-300 ${hovered === idx ? "rotate-180": ""}`}/>
                    </Link>

                    {dropdownVisible && (
                      <motion.div
                        className="absolute border-b-2 border-warning-800  shadow-2xl top-full left-0 bg-background pt-scv4  rounded-lg w-60 z-10"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex flex-col gap-2 p-2">
                          {serviciosLinks.map((service) => (
                            <Link key={service.link} href={service.link}>
                              <div
                                className={`px-4 py-2 text-sm rounded-full ${
                                  pathname === service.link
                                    ? "bg-[#634AE2] text-white"
                                    : "text-title hover:bg-[#634AE2] hover:text-white"
                                }`}
                              >
                                {service.name}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <Link
                    onMouseEnter={() => setHovered(idx)}
                    className={`relative px-4 py-2 ${
                      pathname === navItem.link || hovered === idx
                        ? "bg-[#634AE2] rounded-full text-white"
                        : "text-title hover:bg-[#634AE2] hover:text-white rounded-full"
                    }`}
                    key={idx}
                    href={navItem.link}
                  >
                    {hovered === idx && (
                      <motion.div
                        className="absolute inset-0 h-full w-full rounded-full bg-[#634AE2]"
                      />
                    )}
                    <span className="relative z-20 text-base">
                      {navItem.name}
                    </span>
                  </Link>
                )}
              </div>
            ))}
            <ThemeToggle />
          </div>
        </div>

        
      </motion.div>
    </>
  );
};
