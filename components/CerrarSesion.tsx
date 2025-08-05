"use client";
import { Button } from "@heroui/react";
import { ThemeToggle } from "./Themetoggle";
import { useAuth } from "@/components/auth/loginsec";
import { useEffect, useState } from "react";
import { UsuarioLocalStorageUpdate } from "@/interface";
import Image from "next/image";
import Editar from "./Editar";

export default function CerrarSesion() {
  const { logout } = useAuth();
  const [user, setUser] = useState<UsuarioLocalStorageUpdate | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser) as UsuarioLocalStorageUpdate;
        setUser(parsed);
      }
    }
  }, []);

  // Función para actualizar el usuario global
  const handleUpdateUser = (updatedUser: UsuarioLocalStorageUpdate) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  if (!isClient) {
    return (
      <div className="flex-row justify-end items-center gap-x-5 mr-8 hidden md:flex">
        <ThemeToggle />
        <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse"></div>
        <div className="w-20 h-10 rounded-full bg-gray-300 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="flex-row justify-end items-center gap-x-5 mr-8 hidden md:flex">
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
      <button
        className="border-primary border-2 min-w-fit dark:border-primary-foreground rounded-3xl text-primary dark:text-primary-foreground bg-background dark:bg-background hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary-foreground dark:hover:text-primary transition-all duration-200 h-10 px-6 text-medium font-semibold shadow-md hover:shadow-lg"
        onClick={() => setIsEditOpen(true)}
      >
        Editar Perfil
      </button>
      <Button
        radius="full"
        className="border-primary border-2 min-w-fit dark:border-primary-foreground text-primary-foreground dark:text-primary-foreground bg-[#634AE2] dark:bg-background hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary-foreground dark:hover:text-primary transition-all duration-200 h-10 px-6 text-medium font-semibold shadow-md hover:shadow-lg"
        onPress={logout}
      >
        Cerrar sesión
      </Button>
      <Editar
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
        onUpdateUser={handleUpdateUser}
      />
    </div>
  );
}
