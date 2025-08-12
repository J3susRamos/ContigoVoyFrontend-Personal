"use client";
import { Button } from "@heroui/react";
import { ThemeToggle } from "./Themetoggle";
import { useAuth } from "@/components/auth/loginsec";
import { useEffect, useState } from "react";
import { UsuarioLocalStorage } from "@/interface";
import Image from "next/image";
import { ChevronDown, LogOut, Edit } from "lucide-react";

export default function CerrarSesion() {
  const { logout } = useAuth();
  const [user, setUser] = useState<UsuarioLocalStorage | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser) as UsuarioLocalStorage;
        setUser(parsed);
      }
    }
    
    // Cleanup timeout on unmount
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  const handleUpdateUser = (updatedUser: UsuarioLocalStorage) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setIsEditOpen(false);
  };

  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setMenuOpen(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setMenuOpen(false);
    }, 150); // 150ms de delay para permitir movimiento del mouse
    setHoverTimeout(timeout);
  };

  if (!isClient) {
    return (
      <>
        {/* Versión Desktop */}
        <div className="hidden md:flex flex-row justify-end items-center gap-x-5">
          <ThemeToggle />
          <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse"></div>
          <div className="w-20 h-10 rounded-full bg-gray-300 animate-pulse"></div>
        </div>
        
        {/* Versión Mobile */}
        <div className="md:hidden flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
          <div className="flex items-center justify-between w-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 border border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse"></div>
              <ThemeToggle />
            </div>
            <div className="w-20 h-9 rounded-full bg-gray-300 animate-pulse"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Versión Desktop */}
      <div className="hidden md:flex flex-row justify-end items-center gap-x-5">
        <ThemeToggle />
        {user?.imagen ? (
          <Image
            src={user.imagen}
            width={40}
            height={40}
            className="rounded-full w-10 h-10 object-cover"
            alt="avatar"
            priority
          />
        ) : (
          <svg
            className="bg-primary dark:bg-primary rounded-full"
            xmlns={" http://www.w3.org/2000/svg"}
            height="32px"
            viewBox="0 -960 960 960"
            width="32px"
            fill="currentColor"
          >
            <path d="M480-481q-66 0-108-42t-42-108q0-66 42-108t108-42q66 0 108 42t42 108q0 66-42 108t-108 42ZM160-220v-34q0-38 19-65t49-41q67-30 128.5-45T480-420q62 0 123 15.5T731-360q31 14 50 41t19 65v34q0 25-17.5 42.5T740-160H220q-25 0-42.5-17.5T160-220Z" />
          </svg>
        )}
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className={`flex items-center gap-2 border-primary border-2 min-w-fit dark:border-primary-foreground rounded-3xl text-primary dark:text-primary-foreground transition-all duration-200 h-10 px-6 text-medium font-semibold shadow-md hover:shadow-lg ${
              menuOpen ? "bg-[#634AE2] text-white dark:bg-[#634AE2]" : ""
            }`}
          >
            Opciones
            <ChevronDown
              className={`transition-transform duration-200 ${
                menuOpen ? "rotate-180" : ""
              }`}
              size={20}
            />
          </button>
          {menuOpen && (
            <>
              {/* Puente invisible para conectar botón con dropdown */}
              <div className="absolute right-0 top-full w-48 h-2 bg-transparent" />
              <div 
                className="absolute right-0 top-full mt-2 w-48 z-[99999]"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="w-48 bg-[#634AE2] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-600 py-2 text-base flex flex-col">
                  <Button
                    className="text-white px-4 py-2 text-center flex justify-start text-base bg-[#634AE2] hover:bg-[#4b36b3] hover:text-yellow-300 transition-colors rounded-none"
                    onPress={() => {
                      setIsEditOpen(true);
                      setMenuOpen(false);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                    <p className="text-white ml-2">Editar Perfil</p>
                  </Button>
                  <Button
                    className="text-white px-4 py-2 text-center text-base flex justify-start bg-[#634AE2] hover:bg-[#4b36b3] hover:text-red-400 transition-colors rounded-none"
                    onPress={logout}
                  >
                    <LogOut className="w-4 h-4" />
                    <p className="text-white ml-2">Cerrar sesión</p>
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Versión Mobile */}
      <div className="md:hidden flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
        <div className="flex items-center justify-between w-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 border border-gray-200 dark:border-gray-600">
          <div className="flex items-center gap-3">
            {user?.imagen ? (
              <Image
                src={user.imagen}
                width={32}
                height={32}
                className="rounded-full w-8 h-8 object-cover"
                alt="avatar"
                priority
              />
            ) : (
              <svg
                className="bg-primary dark:bg-primary rounded-full"
                xmlns={" http://www.w3.org/2000/svg"}
                height="28px"
                viewBox="0 -960 960 960"
                width="28px"
                fill="currentColor"
              >
                <path d="M480-481q-66 0-108-42t-42-108q0-66 42-108t108-42q66 0 108 42t42 108q0 66-42 108t-108 42ZM160-220v-34q0-38 19-65t49-41q67-30 128.5-45T480-420q62 0 123 15.5T731-360q31 14 50 41t19 65v34q0 25-17.5 42.5T740-160H220q-25 0-42.5-17.5T160-220Z" />
              </svg>
            )}
            <ThemeToggle />
          </div>
          
          <div className="relative">
            <button
              className={`flex items-center gap-2 border-primary border-2 dark:border-primary-foreground rounded-full text-primary dark:text-primary-foreground transition-all duration-200 h-9 px-4 text-sm font-semibold shadow-md hover:shadow-lg ${
                menuOpen ? "bg-[#634AE2] text-white dark:bg-[#634AE2]" : ""
              }`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              Opciones
              <ChevronDown
                className={`transition-transform duration-200 ${
                  menuOpen ? "rotate-180" : ""
                }`}
                size={16}
              />
            </button>
            
            {menuOpen && (
              <>
                {/* Overlay para cerrar el menú */}
                <div 
                  className="fixed inset-0 z-[99998] bg-black/20 backdrop-blur-sm"
                  onClick={() => setMenuOpen(false)}
                />
                
                {/* Menú móvil */}
                <div className="absolute right-0 top-full mt-2 w-48 z-[99999]">
                  <div className="w-48 bg-[#634AE2] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-600 py-2 text-base flex flex-col">
                    <Button
                      className="text-white px-4 py-3 text-center flex justify-start text-base bg-[#634AE2] hover:bg-[#4b36b3] hover:text-yellow-300 transition-colors rounded-none"
                      onPress={() => {
                        setIsEditOpen(true);
                        setMenuOpen(false);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                      <p className="text-white ml-2">Editar Perfil</p>
                    </Button>
                    <Button
                      className="text-white px-4 py-3 text-center text-base flex justify-start bg-[#634AE2] hover:bg-[#4b36b3] hover:text-red-400 transition-colors rounded-none"
                      onPress={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      <p className="text-white ml-2">Cerrar sesión</p>
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Edición de Perfil */}
      {isEditOpen && user && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999999] flex items-center justify-center p-4 min-h-screen">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md mx-auto my-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Editar Perfil
            </h2>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const updatedUser = {
                ...user,
                nombre: formData.get('nombre') as string,
                apellido: formData.get('apellido') as string,
                email: formData.get('email') as string,
              };
              handleUpdateUser(updatedUser);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    defaultValue={user.nombre}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#634AE2] focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Apellido
                  </label>
                  <input
                    type="text"
                    name="apellido"
                    defaultValue={user.apellido}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#634AE2] focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={user.email}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#634AE2] focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#634AE2] text-white rounded-lg hover:bg-[#4b36b3] transition-colors"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
