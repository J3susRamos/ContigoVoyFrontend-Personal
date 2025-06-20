import { Button } from "@/components/ui/button";
import React, { useEffect, useRef } from "react";
import { NavItems } from "@/interface";
import Link from "next/link";
import Image from "next/image";

export function MobileNavbar({ navItems }: { navItems: NavItems[] }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      panelRef.current &&
      !panelRef.current.contains(event.target as Node) &&
      userRef.current &&
      !userRef.current.contains(event.target as Node)
    ) {}
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div>
      {/* NavBar */}
      <div className="fixed left-0 top-0 w-[80px] h-full p-4 bg-background z-50 rounded-r-2xl flex flex-col items-center">
        {/* Logo reducido */}
        <div className="flex justify-center mb-4">
          <Link href="/public">
            <Image src="/LOGO.webp" alt="logo" width={80} priority={true} height={60}  />
          </Link>
        </div>

        {/* Menú de navegación solo con iconos */}
        <div className="flex flex-col items-center gap-4 w-full">
          {navItems.map((items, idx) => (
            <div className="w-full flex justify-center" key={idx}>
              <Link href={items.link}>
                <Button className="w-full flex justify-center items-center bg-transparent text-[#634AE2] text-2xl border-none hover:bg-[#634AE2] hover:text-white transition-colors duration-300 rounded-full p-3">
                  <span
                    className="text-xl"
                    dangerouslySetInnerHTML={{
                      __html: items.icono.replace(
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
      </div>
    </div>
  );
}
