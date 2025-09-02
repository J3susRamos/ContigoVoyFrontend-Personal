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
import AddCitas from "@/components/User/Citas/AddCitas";

const PageHome = () => {
  const router = useRouter();
  const [view, setView] = useState("datos");
  const [idPaciente, setIdPaciente] = useState<number | null>(null);
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [viewModalCitas, setViewModalCitas] = useState<boolean>(false);
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
  const handleViewModalAddCitas = (view: boolean) =>{
      setViewModalCitas(view)
  }
  console.log(paciente)

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      {/* Header mejorado */}
      <div className="sticky top-0 z-50 bg-background/95 dark:bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border dark:border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/user/pacientes/"
                className="p-2 rounded-full bg-muted dark:bg-muted hover:bg-accent dark:hover:bg-accent transition-colors"
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: Icons.arrow.replace(
                      /<svg /,
                      '<svg fill="hsl(var(--primary))" transform="rotate(90)" width="1.5em" height="1.5em" stroke="hsl(var(--primary))" stroke-width="2" '
                    ),
                  }}
                />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground dark:text-foreground">
                  {paciente?.nombre} {paciente?.apellido}
                </h1>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">
                  Paciente #{idPaciente}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleViewModalAddCitas(true)}
                className="bg-primary dark:bg-primary text-primary-foreground dark:text-primary-foreground rounded-lg px-4 py-2 font-medium hover:bg-primary/90 dark:hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                + Nueva Cita
              </button>
              <CerrarSesion />
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section con imagen del paciente */}
      <div className="relative">
        <div className="h-64 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 dark:to-transparent">
          {paciente?.imagen ? (
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 dark:opacity-10"
              style={{
                backgroundImage: `url("${paciente.imagen}")`,
              }}
            />
          ) : null}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent dark:from-background/90" />
          
          {/* Patient avatar */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <div className="relative">
              {paciente?.imagen ? (
                <div
                  className="w-32 h-32 rounded-full border-4 border-background dark:border-background shadow-xl bg-cover bg-center"
                  style={{
                    backgroundImage: `url("${paciente.imagen}")`,
                  }}
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-background dark:border-background shadow-xl bg-muted dark:bg-muted flex items-center justify-center">
                  <span className="text-4xl font-bold text-muted-foreground dark:text-muted-foreground">
                    {paciente?.nombre?.[0]}{paciente?.apellido?.[0]}
                  </span>
                </div>
              )}
              
              {/* Status indicator */}
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-background dark:border-background"></div>
            </div>
          </div>
        </div>
        
        {/* Patient basic info */}
        <div className="pt-20 pb-8 text-center">
          <h2 className="text-3xl font-bold text-foreground dark:text-foreground mb-2">
            {paciente?.nombre} {paciente?.apellido}
          </h2>
          <div className="flex justify-center gap-6 text-sm text-muted-foreground dark:text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Activo
            </span>
            {paciente?.edad && (
              <span>{paciente.edad} años</span>
            )}
            {paciente?.genero && (
              <span className="capitalize">{paciente.genero}</span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation tabs mejoradas */}
      <div className="border-b border-border dark:border-border bg-background dark:bg-background sticky top-[73px] z-40">
        <div className="container mx-auto px-6">
          <div className="flex justify-center">
            <div className="flex bg-muted/50 dark:bg-muted/50 rounded-lg p-1 mx-auto">
              {navItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setView(item.key)}
                  className={`relative px-6 py-3 rounded-md font-medium text-sm transition-all duration-300 ${
                    view === item.key
                      ? "bg-background dark:bg-background text-primary dark:text-primary shadow-sm"
                      : "text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:hover:text-foreground hover:bg-background/50 dark:hover:bg-background/50"
                  }`}
                >
                  {item.name}
                  {view === item.key && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary dark:bg-primary rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido dinámico con mejor espaciado */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {view === "datos" && idPaciente && <DatosPaciente idPaciente={idPaciente} />}
          {view === "historial" && <HistorialClinico idPaciente={idPaciente} />}
          {view === "citas" && <CitasPaciente idPaciente={idPaciente} />}
        </div>
      </div>

      {/* Modal mejorado */}
      {viewModalCitas && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm" onClick={() => handleViewModalAddCitas(false)} />
          <div className="relative z-10 max-w-2xl w-full mx-4">
            {paciente && (
              <AddCitas
                open={handleViewModalAddCitas}
                dataPaciente={{
                  nombre: paciente.nombre,
                  apellido: paciente.apellido,
                  codigo: paciente.codigo,
                  idPaciente: paciente.idPaciente
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PageHome;
