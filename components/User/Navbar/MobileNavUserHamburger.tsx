"use client";
import { useState } from "react";
import { ThemeToggle } from "../../Themetoggle";
import { Icons } from "@/icons";
import Link from "next/link";
import { NavItems, UsuarioLocalStorageUpdate } from "@/interface";
import { Button } from "@heroui/react";
import { useAuth } from "@/components/auth/loginsec";
import { useEffect } from "react";
import { UsuarioLocalStorage } from "@/interface";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Editar from "@/components/Editar";
import EditarIcon from "@/icons/EditarIcon";

export function MobileNavUserHamburger({ navItems }: { navItems: NavItems[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const { logout } = useAuth();
  const [user, setUser] = useState<UsuarioLocalStorage | null>(null);
  const pathname = usePathname();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleUpdateUser = (updatedUser: UsuarioLocalStorageUpdate) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

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
  const isActiveRoute = (currentPath: string, itemLink?: string, children?: NavItems[]): boolean => {
    if (itemLink) {
      return currentPath === itemLink;
    }
    
    if (children) {
      return children.some(child => currentPath === child.link);
    }
    
    return false;
  };

  // Función para renderizar item de navegación
  const renderNavItem = (item: NavItems, index: number) => {
    const isActive = isActiveRoute(pathname, item.link, item.hijos);
    const hasChildren = item.hijos && item.hijos.length > 0;
    const isExpanded = item.key ? expandedItems.has(item.key) : false;

    if (hasChildren) {
      return (
        <div key={index} className="w-full">
          {/* Elemento padre expandible */}
          <button
            className={`w-full flex items-center justify-between gap-4 font-medium text-base text-left p-3 rounded-xl transition-colors duration-200 ${
              isActive
                ? "bg-[#9494F3] text-white"
                : "text-[#634AE2] dark:text-[#634AE2] hover:bg-[#634AE2] hover:text-white dark:hover:bg-[#634ae264]"
            }`}
            onClick={() => item.key && toggleExpanded(item.key)}
          >
            <div className="flex items-center gap-4">
              <span
                className="text-xl flex-shrink-0"
                dangerouslySetInnerHTML={{
                  __html: item.icono.replace(
                    /<svg /,
                    '<svg fill="currentColor" width="20" height="20" '
                  ),
                }}
              />
              <span className="truncate">{item.name}</span>
            </div>
            {/* Icono de flecha para expandir/contraer */}
            <span
              className={`transform transition-transform duration-200 text-sm ${
                isExpanded ? 'rotate-180' : 'rotate-0'
              }`}
            >
              ▼
            </span>
          </button>

          {/* Subelementos */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="pl-6 mt-2 space-y-1">
              {item.hijos?.map((child, childIndex) => (
                <Link key={childIndex} href={child.link || '#'}>
                  <button
                    className={`w-full flex items-center gap-3 font-medium text-sm text-left p-2 rounded-lg transition-colors duration-200 ${
                      pathname === child.link
                        ? "bg-[#7c6df0] text-white"
                        : "text-[#634AE2] dark:text-[#634AE2] hover:bg-[#634AE2] hover:text-white dark:hover:bg-[#634ae264]"
                    }`}
                    onClick={closeMenu}
                  >
                    <span
                      className="text-lg flex-shrink-0"
                      dangerouslySetInnerHTML={{
                        __html: child.icono.replace(
                          /<svg /,
                          '<svg fill="currentColor" width="16" height="16" '
                        ),
                      }}
                    />
                    <span className="truncate">{child.name}</span>
                  </button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Elemento simple sin hijos
    return (
      <div key={index} className="w-full">
        <Link href={item.link || '#'}>
          <button
            className={`w-full flex items-center gap-4 font-medium text-base text-left p-3 rounded-xl transition-colors duration-200 ${
              isActive
                ? "bg-[#9494F3] text-white"
                : "text-[#634AE2] dark:text-[#634AE2] hover:bg-[#634AE2] hover:text-white dark:hover:bg-[#634ae264]"
            }`}
            onClick={closeMenu}
          >
            <span
              className="text-xl flex-shrink-0"
              dangerouslySetInnerHTML={{
                __html: item.icono.replace(
                  /<svg /,
                  '<svg fill="currentColor" width="20" height="20" '
                ),
              }}
            />
            <span className="truncate">{item.name}</span>
          </button>
        </Link>
      </div>
    );
  };

  return (
    <>
      {/* Botón hamburguesa */}
      <button
        className="p-2 text-2xl focus:outline-none"
        aria-label="Abrir menú"
        onClick={toggleMenu}
      >
        <span
          dangerouslySetInnerHTML={{
            __html: Icons.hamburger.replace(/<svg /, '<svg fill="#634AE2" width="24" height="24" '),
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
                  '<svg fill="#634AE2" stroke="#634AE2" stroke-width="2" width="24" height="24" '
                ),
              }}
              className="inline-block transform rotate-90"
            />
          </button>
        </div>

        {/* Cuerpo del menú */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((navItem, idx) => renderNavItem(navItem, idx))}
          </div>
        </div>

        {/* Footer con cerrar sesión */}
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
            {user?.rol === 'PSICOLOGO' ? (
              <Button
                className="text-white px-4 py-6 flex justify-center text-base bg-[#634AE2] hover:bg-[#4b36b3] hover:text-yellow-300 transition-colors rounded-full w-full h-12"
                onPress={() => {
                  setIsEditOpen(true);
                  closeMenu();
                }}
              >
                <EditarIcon/>
                <p className="text-white">Editar Perfil</p>
              </Button>
            ) : null}
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

      <Editar
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
        onUpdateUser={handleUpdateUser}
      />

      {/* Overlay para cerrar el menú al hacer clic fuera */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMenu}
        />
      )}
    </>
  );
}