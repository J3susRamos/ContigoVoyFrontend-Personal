import { useState } from "react";
import { ThemeToggle } from "../Themetoggle";
import { Icons } from "@/icons";
import Link from "next/link";
import { NavItem } from "@/interface";

export function MobileNav({ navItems }: { navItems: NavItem[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Si estamos cerrando el menú, también cerramos el submenú de servicios
    if (isMenuOpen) {
      setIsServicesOpen(false);
    }
  };

  const toggleServices = () => {
    setIsServicesOpen(!isServicesOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsServicesOpen(false);
  };

  return (
    <div className="absolute left-6 top-5 lg:top-9 w-10">
      {/* Botón para abrir el menú */}
      <button
        className="text-2xl focus:outline-none w-full"
        aria-label="Abrir menú"
        onClick={toggleMenu}
      >
        <span
          dangerouslySetInnerHTML={{
            __html: Icons.hamburger.replace(/<svg /, '<svg fill="#634AE2" width=100% height=100%'),
          }}
        />
      </button>

      {/* Menú deslizable */}
      <div
        id="mobile-drawer"
        className={`fixed top-0 left-0 h-screen w-80 bg-[#E7E7FF] shadow-lg transform transition-transform duration-400 ease-in-out flex flex-col ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Encabezado del menú */}
        <div className="flex justify-between items-center p-4">
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
        <div className="flex-1 p-4">
          <div className="grid">
            {navItems.map((navItem, idx) => (
              <div className="w-full" key={idx}>
                {navItem.name === "Iniciar Sesión" ? (
                  <div className="flex justify-center items-center h-full">
                    <Link href={navItem.link} className="w-2/3 bg-none text-[#634AE2] font-bold text-base border-2 border-[#634AE2] text-center py-2 rounded-full mt-10">
                      <button onClick={closeMenu}>
                        {navItem.name}
                      </button>
                    </Link>
                  </div>
                ) : (
                  <>
                    {navItem.name === "Servicios" ? (
                      <button
                        className="w-full bg-none text-[#634AE2] font-bold text-xl text-left pl-8 mt-5"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleServices();
                        }}
                      >
                        {navItem.name}
                      </button>
                    ) : (
                      <Link href={navItem.link}>
                        <button
                          className="w-full bg-none text-[#634AE2] font-bold text-xl text-left pl-8 mt-5"
                          onClick={closeMenu}
                        >
                          {navItem.name}
                        </button>
                      </Link>
                    )}

                    {/* Subelementos de "Servicios" */}
                    {navItem.name === "Servicios" && isServicesOpen && (
                      <div className="pl-8 mt-2 space-y-2">
                        <Link href="/servicios/terapia/infantes/">
                          <button 
                            className="w-full bg-none text-[#634AE2] text-lg text-left"
                            onClick={closeMenu}
                          >
                            Terapia para niños
                          </button>
                        </Link>
                        <Link href="/servicios/terapia/adolescentes/">
                          <button 
                            className="w-full bg-none text-[#634AE2] text-lg text-left"
                            onClick={closeMenu}
                          >
                            Terapia para adolescentes
                          </button>
                        </Link>
                        <Link href="/servicios/terapia/adultos/">
                          <button 
                            className="w-full bg-none text-[#634AE2] text-lg text-left"
                            onClick={closeMenu}
                          >
                            Terapia para adultos
                          </button>
                        </Link>
                        <Link href="/servicios/terapia/parejas/">
                          <button 
                            className="w-full bg-none text-[#634AE2] text-lg text-left"
                            onClick={closeMenu}
                          >
                            Terapia de parejas
                          </button>
                        </Link>
                        <Link href="/servicios/terapia/familia/">
                          <button 
                            className="w-full bg-none text-[#634AE2] text-lg text-left"
                            onClick={closeMenu}
                          >
                            Terapia familiar
                          </button>
                        </Link>
                        <Link href="/servicios/terapia/empresarial/">
                          <button 
                            className="w-full bg-none text-[#634AE2] text-lg text-left"
                            onClick={closeMenu}
                          >
                            Terapia empresarial
                          </button>
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}