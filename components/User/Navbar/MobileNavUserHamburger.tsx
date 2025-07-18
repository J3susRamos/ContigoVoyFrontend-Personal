import { useState } from "react";
import { ThemeToggle } from "../../Themetoggle";
import { Icons } from "@/icons";
import Link from "next/link";
import { NavItems } from "@/interface";
import { Button } from "@heroui/react";
import { useAuth } from "@/components/auth/loginsec";
import { useEffect } from "react";
import { UsuarioLocalStorage } from "@/interface";
import { usePathname } from "next/navigation";
import Image from "next/image";

export function MobileNavUserHamburger({ navItems }: { navItems: NavItems[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useAuth();
  const [user, setUser] = useState<UsuarioLocalStorage | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser) as UsuarioLocalStorage);
      }
    }
  }, []);

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
        className={`fixed top-0 left-0 h-screen w-80 bg-[#E7E7FF] dark:bg-[#1f1e22] shadow-lg transform transition-transform duration-400 ease-in-out flex flex-col z-50 ${
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
                    className={`w-full flex items-center gap-4 font-medium text-base text-left p-3 rounded-xl transition-colors duration-200
                    ${pathname === navItem.link
                    ? "bg-[#9494F3] text-white"
                    : "text-[#634AE2] dark:text-[#634AE2] hover:bg-[#634AE2] hover:text-white dark:hover:bg-[#634ae264]"
                    }`}
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
          <div className="flex flex-col items-center gap-4">
            {user?.imagen ? (
              <Image
                src={user.imagen}
                width={50}
                height={50}
                className="rounded-full w-12 h-12 object-cover"
                alt="avatar"
              />
            ) : (
              <svg
                className="bg-primary dark:bg-primary rounded-full w-12 h-12 p-2"
                xmlns="http://www.w3.org/2000/svg"
                height="32px"
                viewBox="0 -960 960 960"
                width="32px"
                fill="currentColor"
              >
                <path d="M480-481q-66 0-108-42t-42-108q0-66 42-108t108-42q66 0 108 42t42 108q0 66-42 108t-108 42ZM160-220v-34q0-38 19-65t49-41q67-30 128.5-45T480-420q62 0 123 15.5T731-360q31 14 50 41t19 65v34q0-25-17.5 42.5T740-160H220q-25 0-42.5-17.5T160-220Z" />
              </svg>
            )}
            <Button
              radius="full"
              className="w-full border-primary border-2 dark:border-primary-foreground text-primary dark:text-primary-foreground bg-background dark:bg-background hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary-foreground dark:hover:text-primary transition-all duration-200 h-12 px-6 text-medium font-semibold shadow-lg hover:shadow-xl"
              onPress={() => {
                logout();
                closeMenu();
              }}
            >
              Cerrar sesión
            </Button>
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
