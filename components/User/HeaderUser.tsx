import React from "react";
import CerrarSesion from "../CerrarSesion";
import Link from "next/link";
import { Icons } from "@/icons";

interface Props {
    title: string;
}

const HeaderUser = ({title}: Props) => {
  return (
    <header className="pt-10 pb-6 z-30 px-10">
       
      <div className="flex items-start justify-between ">
        <div className="flex items-center">
          <Link 
          href="#"
              onClick={(e) => {
                e.preventDefault();
                window.history.back();
              }}>
          <span
            dangerouslySetInnerHTML={{
              __html: Icons.arrow.replace(
                /<svg /,
                '<svg fill="hsl(var(--primary))" transform="rotate(90)" width="2em" height="2em" stroke="hsl(var(--primary))" stroke-width="2" '
              ),
            }}
          />
          </Link>
        <h1 className="text-2xl md:text-4xl font-bold text-[#634be3]">
          {title}
        </h1>
        </div>
        <div className="flex gap-x-5 ">
          <CerrarSesion />
        </div>
      </div>
    </header>
  );
};

export default HeaderUser;
