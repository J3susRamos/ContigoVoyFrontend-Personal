"use client";
import Link from "next/link";
import React, {  useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { NavItems } from "@/interface";

export const DesktopNavUser = ({ navItems }:{navItems:NavItems[]}) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const pathname = usePathname();

  return (
    <>
      <motion.div
        onMouseLeave={() => setHovered(null)}
        className={cn(
          "relative z-[60] hidden w-full flex-col items-center justify-center self-center py-4 lg:flex",
          "inset-x-5 h-auto"
        )}
      >
        <div className="ml-5 flex flex-col items-center gap-3 mr-7">
          {navItems.map((items, idx) => (
            <div
              key={idx}
              className="w-full flex justify-center gap-6"
            >
              {" "}
              <Link
                onMouseEnter={() => setHovered(idx)}
                className={`w-full relative flex px-3 py-3 text-muted-foreground ${
                  pathname === items.link || hovered === idx
                    ? "bg-[#9494F3] rounded-xl"
                    : ""
                }`}
                href={items.link}
              >
                <span
                  className={cn(
                    " z-20 text-lg",
                    hovered === idx || pathname === items.link
                      ? "text-white"
                      : "text-[#937bbd] dark:text-primary"
                  )}
                  dangerouslySetInnerHTML={{
                    __html: items.icono.replace(
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
                  hovered === idx || pathname === items.link ? "text-white" : ""
                  )}
                >
                  {items.name}
                </span>
              </Link>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
};
