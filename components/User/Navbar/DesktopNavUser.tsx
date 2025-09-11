"use client";
import Link from "next/link";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { NavItems } from "@/interface";

export const DesktopNavUser = ({ navItems }: { navItems: NavItems[] }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const pathname = usePathname();
  const router = useRouter();

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
    const isHovered = hovered === index;

    if (hasChildren) {
      return (
        <div key={index} className="w-full">
          {/* Elemento padre expandible */}
          <div className="w-full flex justify-center gap-6">
            <button
              onMouseEnter={() => setHovered(index)}
              className={cn(
                "w-full relative flex px-3 py-3 text-muted-foreground transition-all duration-200",
                isActive || isHovered
                  ? "bg-[#9494F3] rounded-xl"
                  : "hover:bg-[#634ae220] rounded-xl"
              )}
              onClick={() => item.key && toggleExpanded(item.key)}
            >
              <span
                className={cn(
                  "z-20 text-lg",
                  isHovered || isActive
                    ? "text-white"
                    : "text-[#937bbd] dark:text-primary"
                )}
                dangerouslySetInnerHTML={{
                  __html: item.icono.replace(
                    /<svg /,
                    '<svg fill="currentColor" '
                  ),
                }}
                style={{
                  width: "1.2em",
                  height: "1.2em",
                  marginRight: "1.5em",
                }}
              />
              <span
                className={cn(
                  "relative z-20 text-sm font-bold pt-1 text-[#634AE2] dark:text-[#634AE2] flex-1 text-left",
                  isHovered || isActive ? "text-white" : ""
                )}
              >
                {item.name}
              </span>
              {/* Flecha indicadora */}
              <span
                className={cn(
                  "z-20 text-xs transition-transform duration-200 pt-1",
                  isExpanded ? "rotate-180" : "rotate-0",
                  isHovered || isActive ? "text-white" : "text-[#937bbd]"
                )}
              >
                ▼
              </span>
            </button>
          </div>

          {/* Subelementos con animación */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pl-6 space-y-2 mt-2">
                  {item.hijos?.map((child, childIndex) => (
                    <div key={childIndex} className="w-full flex justify-center">
                      <Link
                        href={child.link || '#'}
                        className={cn(
                          "w-full relative flex px-3 py-2 text-muted-foreground transition-all duration-200",
                          pathname === child.link
                            ? "bg-[#7c6df0] rounded-lg"
                            : "hover:bg-[#634ae220] rounded-lg"
                        )}
                      >
                        <span
                          className={cn(
                            "z-20 text-base",
                            pathname === child.link
                              ? "text-white"
                              : "text-[#937bbd] dark:text-primary"
                          )}
                          dangerouslySetInnerHTML={{
                            __html: child.icono.replace(
                              /<svg /,
                              '<svg fill="currentColor" '
                            ),
                          }}
                          style={{
                            width: "1em",
                            height: "1em",
                            marginRight: "1.5em",
                          }}
                        />
                        <span
                          className={cn(
                            "relative z-20 text-xs font-medium pt-0.5 text-[#634AE2] dark:text-[#634AE2]",
                            pathname === child.link ? "text-white" : ""
                          )}
                        >
                          {child.name}
                        </span>
                      </Link>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    // Elemento simple sin hijos
    return (
      <div key={index} className="w-full">
        <div className="w-full flex justify-center gap-6">
          <Link
            onMouseEnter={() => setHovered(index)}
            className={cn(
              "w-full relative flex px-3 py-3 text-muted-foreground transition-all duration-200",
              isActive || isHovered
                ? "bg-[#9494F3] rounded-xl"
                : "hover:bg-[#634ae220] rounded-xl"
            )}
            href={item.link || '#'}
          >
            <span
              className={cn(
                "z-20 text-lg",
                isHovered || isActive
                  ? "text-white"
                  : "text-[#937bbd] dark:text-primary"
              )}
              dangerouslySetInnerHTML={{
                __html: item.icono.replace(
                  /<svg /,
                  '<svg fill="currentColor" '
                ),
              }}
              style={{
                width: "1.2em",
                height: "1.2em",
                marginRight: "2em",
              }}
            />
            <span
              className={cn(
                "relative z-20 text-sm font-bold pt-1 text-[#634AE2] dark:text-[#634AE2]",
                isHovered || isActive ? "text-white" : ""
              )}
            >
              {item.name}
            </span>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "relative z-[60] hidden w-full flex-col items-center justify-center self-center py-4 lg:flex pl-4",
        "h-auto"
      )}
    >
      <div className="ml-5 flex flex-col items-center gap-3 mr-7 w-full">
        {navItems.map((item, idx) => renderNavItem(item, idx))}
      </div>
    </motion.div>
  );
};