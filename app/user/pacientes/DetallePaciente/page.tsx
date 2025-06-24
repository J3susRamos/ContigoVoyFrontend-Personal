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
    const loadPaciente = async () => {
      const id = localStorage.getItem("idPaciente");
      if (!id) {
        router.push("/user/pacientes");
      } else {
        const idParsed = parseInt(id);
        setIdPaciente(idParsed);
        try {
          await fetchPaciente(idParsed);
        } catch (error) {
          console.error("Error fetching paciente:", error);
        }
      }
    };

    loadPaciente().catch(error => {
      console.error("Error in loadPaciente:", error);
    });
  }, [router]);

  const navItems = [
    { name: "Datos Personales", key: "datos" },
    { name: "Historial Clínico", key: "historial" },
    { name: "Citas", key: "citas" },
  ];
  return (
    <div className="min-h-screen bg-background dark:bg-background flex flex-col">
      {/* Cabecera */}
      <div className="bg-background dark:bg-background w-full z-30 mt-4">
        <div>
          <nav className="bg-background dark:bg-background rounded-2xl mt-3 h-[12vh] flex items-center w-[calc(95vw-270px)] p-4">
            <div className="bg-background dark:bg-background flex items-start justify-between w-full">
              <div className="flex justify-between gap-5">
                <Link href={`/user/pacientes/`}>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: Icons.arrow.replace(
                        /<svg /,
                        '<svg fill="hsl(var(--primary))" transform="rotate(90)" width="2em" height="2em" stroke="hsl(var(--primary))" stroke-width="2" '
                      ),
                    }}
                  />
                </Link>
                <h1 className="text-4xl font-bold text-primary dark:text-primary">
                  {paciente?.nombre} {paciente?.apellido} #{idPaciente}
                </h1>
                <button className="bg-primary dark:bg-primary text-primary-foreground dark:text-primary-foreground rounded-full text-base px-4 py-2 font-normal hover:bg-primary/90 dark:hover:bg-primary/90 transition-colors">
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
      <div className="flex w-full mt-4 pl-8 h-72 bg-background dark:bg-background">
                                   
      {paciente?.imagen ? (
          <div
            className="flex items-center min-h-72 pr-[200px] pl-8 rounded-3xl bg-muted dark:bg-muted"
            style={{
              backgroundImage: `url("${paciente.imagen}")`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              height: "200px",
            }}
          />
        ):<div className="flex items-center min-h-72 pr-[200px] pl-8 rounded-3xl bg-muted dark:bg-muted"></div>}

        <div className="bg-primary dark:bg-primary w-full h-[8vh] flex flex-row items-center px-4 mt-10">
          <div className="flex flex-row gap-4 w-full max-w-xl justify-between">
            {navItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setView(item.key)}
                className={`rounded-full px-4 py-2 font-bold text-base transition-all duration-200 ${
                  view === item.key
                    ? "bg-background dark:bg-background text-primary dark:text-primary"
                    : "text-primary-foreground dark:text-primary-foreground hover:bg-background dark:hover:bg-background hover:text-primary dark:hover:text-primary"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido dinámico */}
      <div className="flex-1 bg-background dark:bg-background">
        <div className="flex justify-center z-10 relative">
          {view === "datos" && idPaciente && <DatosPaciente idPaciente={idPaciente} />}
          {view === "historial" && <HistorialClinico idPaciente={idPaciente} />}
          {view === "citas" && <CitasPaciente idPaciente={idPaciente} />}
        </div>
      </div>
    </div>
  );
};

export default PageHome;
