import React from "react";
import CerrarSesion from "../CerrarSesion";

interface Props {
    title: string;
}

const HeaderUser = ({title}: Props) => {
  return (
    <header className="pt-10 pb-6 z-30 px-10">
      <div className="flex items-start justify-between w-[calc(95vw-270px)]">
        <h1 className="text-2xl md:text-4xl font-bold text-[#634be3] dark:text-primary-foreground">
          {title}
        </h1>
        <div className="flex gap-x-5 ">
          <CerrarSesion />
        </div>
      </div>
    </header>
  );
};

export default HeaderUser;
