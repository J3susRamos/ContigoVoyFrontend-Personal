"use client";

import { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import { useRouter } from "next/navigation";
import CerrarSesion from "@/components/CerrarSesion";
import { Icons } from "@/icons";
import DatosPaciente from "@/components/User/Pacientes/DatosPaciente";
import Link from "next/link";
import HistorialClinico from "@/components/User/Pacientes/HistorialClinico";
import CitasPaciente from "@/components/User/Pacientes/CitasPaciente";
import { Paciente } from "@/interface";

const PageHome = () => {
  const router = useRouter();
  const [view, setView] = useState("datos");
  const [idPaciente, setIdPaciente] = useState<number | null>(null);
  const [paciente, setPaciente] = useState<Paciente | null>(null);

  const fetchPaciente = async (id: number) => {
    try {
      const token = parseCookies().session;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/pacientes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) setPaciente(data.result);
    } catch (err) {
      console.error("Error al obtener paciente:", err);
    }
  };

  useEffect(() => {
    const id = localStorage.getItem("idPaciente");
    if (!id) {
      router.push("/user/pacientes");
    } else {
      const idParsed = parseInt(id);
      setIdPaciente(idParsed);
      fetchPaciente(idParsed);
    }
  }, []);

  const navItems = [
    { name: "Datos Personales", key: "datos" },
    { name: "Historial Clínico", key: "historial" },
    { name: "Citas", key: "citas" },
  ];

  return (
    <div className="pb-4 bg-[#eaeded]">
      {/* Cabecera */}
      <div className="flex flex-1 bg-[#eaeded] w-full z-30 mt-4">
        <div>
          <nav className="bg-[#eaeded] rounded-2xl mt-3 h-[12vh] flex items-center w-[calc(95vw-270px)] p-4">
            <div className="bg-[#eaeded] flex items-start justify-between w-full">
              <div className="flex justify-between gap-5">
                <Link href={`/user/pacientes/`}>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: Icons.arrow.replace(
                        /<svg /,
                        '<svg fill="#634AE2" transform="rotate(90)" width="2em" height="2em" stroke="#634AE2" stroke-width="2" '
                      ),
                    }}
                  />
                </Link>
                <h1 className="text-4xl font-bold text-[#634AE2]">
                  {paciente?.nombre} {paciente?.apellido} #{idPaciente}
                </h1>
                <button className="bg-[#634AE2] text-white rounded-full text-base px-4 py-2 font-normal">
                  Nueva Cita
                </button>
              </div>
              <div className="flex gap-x-2 mt-2">
                <CerrarSesion />
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* mainNavbar estilo personalizado */}
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
        <div className="bg-[#6364F4] w-full h-[8vh] flex flex-row items-center px-4 mt-10">
          <div className="flex flex-row gap-4 w-full max-w-xl justify-between">
            {navItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setView(item.key)}
                className={`rounded-full px-4 py-2 font-bold text-base transition-all duration-200 ${
                  view === item.key
                    ? "bg-white text-[#6364F4]"
                    : "text-white hover:bg-white hover:text-[#6364F4]"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido dinámico */}
      <div className="flex justify-center z-10 relative">
        {view === "datos" && idPaciente && <DatosPaciente idPaciente={idPaciente} />}
        {view === "historial" && <HistorialClinico idPaciente={idPaciente} />}
        {view === "citas" && <CitasPaciente idPaciente={idPaciente} />}
      </div>
    </div>
  );
};

export default PageHome;
