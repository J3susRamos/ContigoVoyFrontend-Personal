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
  // First effect to fetch user data (runs only once)
  useEffect(() => {
    const loadUser = async () => {
      try {
        await fetchUser(setUser);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // Call the async function and handle the returned promise
    loadUser().catch(error => {
      console.error("Failed to load user:", error);
    });
  }, []);

  // The second effect to log user data (runs when the user changes)
  useEffect(() => {
    console.log(user);
  }, [user]);

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

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div>
      {/* Header 
      <div className="flex-1 mt-4">
        <div>
          <nav className="rounded-2xl mt-3 bg-background h-[12vh] flex items-center fixed z-10 top-1 w-full p-4">
            <div className="flex items-center justify-between w-full mr-1">
              <div>
                <div className="text-3xl font-bold text-[#534489]">
                  <h1>¡Buenos dias! {user.name}</h1>
                </div>
                <div className="text-0xl font-bold text-[#6A90F1]">
                  Tienes{" "}
                  <span className="font-bold text-[#416cd8] ">x citas</span>
                </div>
              </div>
              <div className="flex items-center gap-x-3">
                <span
                  className="text-[#7b8484] hover:text-[#000] transition-colors "
                  dangerouslySetInnerHTML={{
                    __html: Icons.configuracion.replace(
                      /<svg /,
                      '<svg fill="currentColor" '
                    ),
                  }}
                  style={{
                    width: "1.2em",
                    height: "1.2em",
                  }}
                />
                <DataUser ref={userRef} estado={estado} setEstado={setEstado} />
                <ThemeToggle />
              </div>
            </div>
          </nav>
          <div className="mt-[12vh] relative z-30">
            <Panel ref={panelRef} estado={estado} setEstado={setEstado} />
          </div>
        </div>
      </div>*/}

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