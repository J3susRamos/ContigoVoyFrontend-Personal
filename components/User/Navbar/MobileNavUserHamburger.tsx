import { useState } from "react";
import { ThemeToggle } from "../../Themetoggle";
import { Icons } from "@/icons";
import Link from "next/link";
import { NavItems } from "@/interface";
import CerrarSesion from "@/components/CerrarSesion";

export function MobileNavUserHamburger({ navItems }: { navItems: NavItems[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="absolute left-6 top-5 w-10">
      {/* Botón hamburguesa */}
      <button
        className="text-2xl focus:outline-none w-full"
        aria-label="Abrir menú"
        onClick={toggleMenu}
      >        <span
          dangerouslySetInnerHTML={{
            __html: Icons.hamburger.replace(/<svg /, '<svg fill="#634AE2" width="100%" height="100%" '),
          }}
        />
      </button>

      {/* Menú deslizable */}
      <div
        id="mobile-drawer-user"
        className={`fixed top-0 left-0 h-screen w-80 bg-[#E7E7FF] dark:bg-gray-800 shadow-lg transform transition-transform duration-400 ease-in-out flex flex-col z-50 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Encabezado del menú */}
        <div className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-600">
          <ThemeToggle />
          <button
            className="p-2 text-2xl focus:outline-none"
            aria-label="Cerrar menú"
            onClick={closeMenu}
          >
            <span
              dangerouslySetInnerHTML={{
                __html: Icons.arrow.replace(
                  /<svg /,
                  '<svg fill="#634AE2" stroke="#634AE2" stroke-width="2" '
                ),
              }}
              className="inline-block transform rotate-90"
              style={{
                width: "1.6em",
                height: "1.6em",
              }}
            />
          </button>
        </div>

        {/* Cuerpo del menú */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((navItem, idx) => (
              <div className="w-full" key={idx}>
                <Link href={navItem.link}>
                  <button
                    className="w-full flex items-center gap-4 text-[#634AE2] dark:text-purple-300 font-medium text-base text-left p-3 hover:bg-[#634AE2] hover:text-white dark:hover:bg-purple-600 rounded-lg transition-colors duration-200"
                    onClick={closeMenu}
                  >
                    <span
                      className="text-xl flex-shrink-0"
                      dangerouslySetInnerHTML={{
                        __html: navItem.icono.replace(
                          /<svg /,
                          '<svg fill="currentColor" width="20" height="20" '
                        ),
                      }}
                    />
                    <span className="truncate">{navItem.name}</span>
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>        {/* Footer con cerrar sesión */}
        <div className="p-4 border-t border-gray-300 dark:border-gray-600">
          <div onClick={closeMenu}>
            <CerrarSesion isMobile={true} />
          </div>
        </div>
      </div>

      {/* Overlay para cerrar el menú al hacer clic fuera */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMenu}
        />
      )}
    </div>
  );
}
