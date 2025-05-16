"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useEffect, useState } from "react";
import { PanelProps, UserInterface } from "@/interface";
import { fetchUser } from "@/utils/recuperarDataUser";

export const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ estado, setEstado }, ref) => {
   // const router = useRouter();
    const [visible, setVisible] = useState<boolean>(estado);
    const [user, setUser] = useState<UserInterface>({
      name: null,
      email: null,
      lastname: null,
      photo: null,
      iniciales: null,
    });

    useEffect(() => {
      fetchUser(setUser);
    }, []);

    useEffect(() => {
      if (estado) {
        setVisible(true);
      } else {
        const timer = setTimeout(() => setVisible(false), 300);
        return () => clearTimeout(timer);
      }
    }, [estado]);

    setEstado(false);
    return (
      <div
        className={`fixed w-64 bg-primary right-0 font-semibold transform transition-transform duration-300 ${
          estado ? "translate-x-0" : "translate-x-full"
        }`}
        ref={ref}
      >
        {visible && (
          <div
            className={`w-full transition-opacity duration-300 ${
              estado ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="flex w-full items-center justify-between text-center h-10 text-sm border-b ">
              <div className="flex flex-1 justify-center px-4">Contigo Voy</div>
              <div
                className="justify-center flex px-4 hover:bg-[#7777b8] h-full cursor-pointer items-center"
                //onClick={handleSignOut}
              >
                Cerrar Sesión
              </div>
            </div>
            <div className="flex w-full h-28 pr-3">
              <div className="flex justify-center items-center px-3">
                <Avatar className="cursor-pointer w-20 h-20">
                  <AvatarImage
                    src={user.photo || "https://github.com/shadcn.png"}
                    alt="@shadcn"
                  />
                  <AvatarFallback>{user.iniciales}</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-1 justify-center flex-col">
                <div className="text-xl font-extrabold truncate w-[9rem]">
                  User - {user.name} {user.lastname}
                </div>
                <div className="text-sm truncate w-[9rem]">{user.email}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

Panel.displayName = "Panel"; // Add display name
