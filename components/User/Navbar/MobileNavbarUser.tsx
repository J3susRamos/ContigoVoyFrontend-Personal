"use client";

import {Button} from "@/components/ui/button";
import React, {useEffect, useRef, useState} from "react";
import {NavItems} from "@/interface";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MobileNavbar({navItems}: { navItems: NavItems[] }) {
    const panelRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState<number | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const pathname = usePathname();

  const handleClickOutside = (event: MouseEvent) => {
    if (
      panelRef.current &&
      !panelRef.current.contains(event.target as Node) &&
      userRef.current &&
      !userRef.current.contains(event.target as Node)
    ) {
      // Lógica para cerrar elementos si es necesario
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleExpanded = (key: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  // Función helper para verificar si una ruta está activa
  const isActiveRoute = (itemLink?: string, children?: NavItems[]): boolean => {
    if (itemLink) {
      return pathname === itemLink;
    }
    
    if (children) {
      return children.some(child => pathname === child.link);
    }
    
    return false;
  };

  const renderNavItem = (item: NavItems, index: number) => {
    const hasChildren = item.hijos && item.hijos.length > 0;
    const isActive = isActiveRoute(item.link, item.hijos);
    const isExpanded = item.key ? expandedItems.has(item.key) : false;

    if (hasChildren) {
      return (
        <div key={index} className="w-full">
          {/* Elemento padre */}
          <div className="w-full flex justify-center relative">
            <Button
              className={cn(
                "w-full flex justify-center items-center text-2xl border-none transition-all duration-300 rounded-full p-3 relative",
                isActive
                  ? "bg-[#9494F3] text-white"
                  : "bg-transparent text-[#634AE2] hover:bg-[#634AE2] hover:text-white"
              )}
              onMouseEnter={() => setShowTooltip(index)}
              onMouseLeave={() => setShowTooltip(null)}
              onClick={() => item.key && toggleExpanded(item.key)}
            >
              <span
                className="text-xl"
                dangerouslySetInnerHTML={{
                  __html: item.icono.replace(
                    /<svg /,
                    '<svg fill="currentColor" '
                  ),
                }}
              />
              {/* Indicador de expansión */}
              <span
                className={cn(
                  "absolute -bottom-1 -right-1 text-xs w-4 h-4 rounded-full flex items-center justify-center transition-transform duration-200",
                  isActive ? "bg-white text-[#9494F3]" : "bg-[#634AE2] text-white",
                  isExpanded ? "rotate-180" : "rotate-0"
                )}
              >
                ▼
              </span>
            </Button>

            {/* Tooltip */}
            {showTooltip === index && (
              <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-50">
                {item.name}
                <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-800"></div>
              </div>
            )}
          </div>

          {/* Subelementos expandidos */}
          {isExpanded && (
            <div className="mt-2 space-y-2">
              {item.hijos?.map((child, childIndex) => (
                <div key={childIndex} className="w-full flex justify-center">
                  <Link href={child.link || '#'} className="w-full">
                    <Button
                      className={cn(
                        "w-full flex justify-center items-center text-lg border-none transition-all duration-300 rounded-lg p-2",
                        pathname === child.link
                          ? "bg-[#7c6df0] text-white"
                          : "bg-transparent text-[#937bbd] hover:bg-[#634ae240] hover:text-[#634AE2]"
                      )}
                    >
                      <span
                        className="text-base"
                        dangerouslySetInnerHTML={{
                          __html: child.icono.replace(
                            /<svg /,
                            '<svg fill="currentColor" '
                          ),
                        }}
                      />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Elemento simple sin hijos
    return (
      <div key={index} className="w-full flex justify-center relative">
        <Link href={item.link || '#'} className="w-full">
          <Button
            className={cn(
              "w-full flex justify-center items-center text-2xl border-none transition-all duration-300 rounded-full p-3",
              isActive
                ? "bg-[#9494F3] text-white"
                : "bg-transparent text-[#634AE2] hover:bg-[#634AE2] hover:text-white"
            )}
            onMouseEnter={() => setShowTooltip(index)}
            onMouseLeave={() => setShowTooltip(null)}
          >
            <span
              className="text-xl"
              dangerouslySetInnerHTML={{
                __html: item.icono.replace(
                  /<svg /,
                  '<svg fill="currentColor" '
                ),
              }}
            />
          </Button>
        </Link>

        {/* Tooltip */}
        {showTooltip === index && (
          <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-50">
            {item.name}
            <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-800"></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* NavBar */}
      <div
        ref={panelRef}
        className="fixed left-0 top-0 w-[80px] h-full p-4 bg-background z-50 rounded-r-2xl flex flex-col items-center"
      >
        {/* Logo reducido */}
        <div className="flex justify-center mb-4">
          <Link href="/public">
            <Image 
              src="/LOGO.webp" 
              alt="logo" 
              width={80} 
              priority={true} 
              height={60}
            />
          </Link>
        </div>

        {/* Menú de navegación solo con iconos */}
        <div className="flex flex-col items-center gap-4 w-full flex-1 overflow-y-auto">
          {navItems.map((item, idx) => renderNavItem(item, idx))}
        </div>
      </div>
    </div>
  );
}
