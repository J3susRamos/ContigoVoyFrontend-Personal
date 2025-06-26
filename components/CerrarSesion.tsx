"use client";
import { Button } from "@heroui/react";
import { ThemeToggle } from "./Themetoggle";
import { useAuth } from "@/components/auth/loginsec";
import { useEffect, useState } from "react";
import { UsuarioLocalStorage } from "@/interface";
import Image from "next/image";

export default function CerrarSesion({ isMobile = false }: { isMobile?: boolean }) {
  const { logout } = useAuth();
  const [user, setUser] = useState<UsuarioLocalStorage | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser) as UsuarioLocalStorage);
      }
    }
  }, []);

  if (isMobile) {
    // Versión móvil - simplificada
    return (
      <Button
        radius="full"
        className="w-full border-[#634AE2] border-2 text-[#634AE2] bg-transparent hover:bg-[#634AE2] hover:text-white font-bold text-base py-2 transition-colors"
        onPress={logout}
      >
        Cerrar Sesión
      </Button>
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
      <Button
        radius="full"
        className="border-primary border-1 dark:border-primary-foreground text-primary dark:text-primary-foreground bg-transparent hover:bg-primary/10 dark:hover:bg-primary-foreground/10 h-8 mx-auto px-8 text-medium"
        onPress={logout}
      >
        Cerrar sesión
      </Button>
    </div>
  );
}
