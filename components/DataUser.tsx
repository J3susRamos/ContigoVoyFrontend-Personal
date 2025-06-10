"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PanelProps, UserInterface } from "@/interface";
import React, { useEffect, useState } from "react";

export const fetchUser = async () => {
};

export const DataUser = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ estado, setEstado }, ref) => {
    const [user] = useState<UserInterface>({
      name: null,
      email: null,
      lastname: null,
      photo: null,
      iniciales: null,
    });
    useEffect(() => {
      fetchUser().catch(error => {
        console.error("Error fetching user:", error);
      });
    }, []);
    return (
      <div ref={ref}>
        <Avatar
          className="cursor-pointer"
          onClick={() => setEstado(!estado)} // Alterna el estado al hacer clic
        >
          <AvatarImage src={user.photo || "https://github.com/shadcn.png"} />
          <AvatarFallback>{user.iniciales}</AvatarFallback>
        </Avatar>
      </div>
    );
  }
);

DataUser.displayName = 'DataUser';
