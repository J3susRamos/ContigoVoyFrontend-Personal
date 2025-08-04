"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ThemeToggle } from "../Themetoggle";
import { Link } from "@heroui/react";
import { HoverDropBox } from "./HoverDropBox";
import { NavItem, DesktopNavProps } from "./types/navBar.types";

export const DesktopNav: React.FC<DesktopNavProps> = ({ navItems }) => {

  return (

      <motion.div
        className={cn(
          "relative z-[60] mx-auto hidden w-full flex-row items-center justify-between self-start rounded-full px-4 py-2 lg:flex ",
          "inset-x-0 h-16"
        )}
      >
        <div className="hidden flex-1 flex-row items-center justify-center space-x-0 text-sm text-zinc-600 transition duration-200 hover:text-zinc-800 md:flex gap-x-scv4">
          {navItems.map((navItem: NavItem, idx: number) => (
            <div key={idx} className="relative">
              {navItem.isButton ? (
                <Link href={navItem.link}>
                  <button
                    className={`text-sm sm:text-base border-2 transition-colors duration-300 rounded-sm py-1 sm:py-2 px-3 sm:px-4 text-title border-title hover:bg-[#634AE2] hover:text-white`}
                  >
                    {navItem.name}
                  </button>
                </Link>
              ) : navItem.name === "Reservar Cita" ? (
                <Link href={navItem.link}>
                  <button
                    className="px-5 py-2 rounded-xl font-bold text-white bg-gradient-to-r from-[#634AE2] via-[#7B5FE8] to-[#9494F3] shadow-lg border-2 border-[#634AE2] hover:from-[#7B5FE8] hover:to-[#634AE2] hover:scale-105 transition-all duration-300"
                  >
                    {navItem.name}
                  </button>
                </Link>
              ) : navItem.name === "Servicios" ||
                navItem.name == "ContigoVoy" ? (
                <HoverDropBox key={navItem.name} navItem={navItem}/>
              ) : (
                <Link
                  className={`transition-all duration-75 relative px-4 py-2 rounded-sm text-title hover:bg-[#634AE2] hover:scale-85 hover:opacity-60 hover:text-white`}
                  key={idx}
                  href={navItem.link}
                >
                  <span className="relative z-20 text-base">
                    {navItem.name}
                  </span>
                </Link>
              )}
            </div>
          ))}
          <ThemeToggle />
        </div>
      </motion.div>
 
  );
};
