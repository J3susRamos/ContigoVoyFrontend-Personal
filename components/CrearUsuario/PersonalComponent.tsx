"use client";
import React from "react";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Suceesfully } from "./SuccesFull";
import { PersonalForm } from "./DataFormularios";
import { DataView } from "./DataView";
import type { FormData } from "@/interface";
import { useRouter } from "next/navigation";

export const initialFormState: FormData = {
  name: "",
  apellido: "",
  fecha_nacimiento: today(getLocalTimeZone()),
  titulo: "",
  genero: "",
  pais: "",
  email: "",
  password: "",
  introduccion: null,
  imagen: null,
  experiencia: null,
  especialidades: [],
  horario: {
    Lunes: [["09:00", "12:00"]],
    Martes: [["10:00", "15:00"]],
    Miercoles: [["12:00", "16:00"]],
  },
};

export default function PersonalComponent() {
  const router = useRouter();

  const userData = typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("user") || "{}")
    : {};

  const isAdmin = userData.rol === "ADMIN" || userData.rol === "ADMINISTRADOR"|| userData.rol === "COMUNICACION"||userData.rol === "MARKETING";

  React.useEffect(() => {
    if (!isAdmin) {
      // Redirige si no es admin
      router.push("/unauthorized"); // o la ruta que prefieras
    }
  }, [isAdmin, router]);

  const [currentView, setCurrentView] = React.useState<"form" | "data">("form");
  const [formData, setFormData] = React.useState<FormData>(initialFormState);
  const [IsSend, setIsSend] = React.useState(false);

  const handleNext = (data: FormData) => {
    setFormData(data);
    setCurrentView("data");
  };

  const handleBack = () => {
    setCurrentView("form");
  };

  const resetForm = () => {
    setCurrentView("form");
    setIsSend(false);
    setFormData(initialFormState);
  };

  if (!isAdmin) {
    return null; // o un loader si prefieres
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-7xl">
        {!IsSend ? (
          currentView === "form" ? (
            <PersonalForm onNext={handleNext} initialFormData={formData} />
          ) : (
            <DataView
              formData={formData}
              onBack={handleBack}
              setFormData={setFormData}
              setIsSend={setIsSend}
            />
          )
        ) : (
          <div className="max-w-6xl mx-auto">
            <Suceesfully setIsSend={() => resetForm()} />
          </div>
        )}
      </div>
    </div>
  );
}
