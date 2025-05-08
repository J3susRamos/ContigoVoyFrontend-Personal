"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const NavbarPaciente = () => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [idPaciente, setIdPaciente] = useState<number | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const idLocal = localStorage.getItem("idPaciente");
    const parsed = idLocal ? parseInt(idLocal) : null;

    if (!parsed || isNaN(parsed)) {
      router.push("/user/pacientes");
    } else {
      setIdPaciente(parsed);
    }
  }, [router]);

  const navItems = [
    { name: "Datos Personales", path: "/user/pacientes/DetallePaciente" },
    { name: "Historial Clinico", path: "/user/pacientes/HistorialClinico" },
    { name: "Citas", path: "/user/pacientes/Citas" },
  ];

  if (!idPaciente) return null;

  return (
    <div>
      <div className="flex w-full mt-4 pl-8 h-72">
        <div
          className="flex items-center pr-[200px] pl-8 rounded-3xl"
          style={{
            backgroundImage: `url(/Paciente.webp)`,
            backgroundPosition: "right top",
            backgroundSize: "auto",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="bg-[#6364F4] w-full h-[8vh] flex flex-row items-center px-4 mt-10 ">
          <div className="flex flex-row gap-4">
            <div className="w-full max-w-xl flex flex-row gap-4 justify-between">
              {navItems.map((item, idx) => {
                const isActive = pathname === item.path;

                return (
                  <Link
                    key={idx}
                    href={item.path}
                    onMouseEnter={() => setHovered(idx)}
                    onMouseLeave={() => setHovered(null)}
                    className={cn(
                      "text-[#fff] rounded-full hover:bg-[#fff] hover:text-[#6364F4] px-4 py-2",
                      isActive || hovered === idx
                        ? "bg-[#fff] text-[#6364F4]"
                        : ""
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarPaciente;
