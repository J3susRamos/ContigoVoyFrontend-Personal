import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState } from "react";
import { NavItems, UserInterface } from "@/interface";
import { fetchUser } from "@/utils/recuperarDataUser";
import Link from "next/link";
import Image from "next/image";

export function MobileNavbar({ navItems }: {navItems: NavItems[]}) {
  const [estado, setEstado] = useState<boolean>(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<UserInterface>({
    name: null,
    email: null,
    lastname: null,
    photo: null,
    iniciales: null,
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        await fetchUser(setUser);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    loadUser().catch(error => {
      console.error("Failed to load user:", error);
    });
  }, []);

  useEffect(() => {
    console.log(user);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        userRef.current &&
        !userRef.current.contains(event.target as Node)
      ) {
        setEstado(false);
        console.log(estado);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [estado]);

  return (
    <div>
      {/*NavBar*/}
      <div className="mt-28 fixed left-0 top-0 w-[80px] h-full p-4 bg-background z-50 rounded-r-2xl flex flex-col items-center">
        {/* Logo reducido */}
        <div className="flex justify-center mb-4">
          <Link href="/">
            <Image src={"/LOGO.webp"} alt="logo" width={80} height={60} />
          </Link>
        </div>

        {/* Menú de navegación solo con iconos */}
        <div className="flex flex-col items-center gap-4 w-full">
          {navItems.map((items,idx) => (
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
