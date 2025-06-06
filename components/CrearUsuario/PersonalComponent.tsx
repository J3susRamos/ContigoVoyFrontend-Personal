"use client";
import type { FormData } from "@/interface";
import React from "react";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Suceesfully } from "./SuccesFull";
import { PersonalForm } from "./DataFormularios";
import { DataView } from "./DataView";

export const initialFormState: FormData = {
  name: "",
  apellido: "",
  fecha_nacimiento: today(getLocalTimeZone()),
  titulo: "",
  genero: "",
  pais: "",
  email: "",
  password: "",
  introduccion: "",
  imagen: "",
  experiencia: 0,
  especialidades: [1, 3],
  horario: {
    Lunes: [["09:00", "12:00"]],
    Martes: [["10:00", "15:00"]],
    Miercoles: [["12:00", "16:00"]],
  },
};

export default function PersonalComponent() {
  const [currentView, setCurrentView] = React.useState<"form" | "data">("form");
  const [formData, setFormData] = React.useState<FormData>(initialFormState);

  const handleNext = (data: FormData) => {
    setFormData(data); 
    setCurrentView("data"); 
  };

  const handleBack = () => {
    setCurrentView("form"); 
  };

  const [IsSend, setIsSend] = React.useState(false);

  const resetForm = () => {
    setCurrentView("form");
    setIsSend(false);
    setFormData(initialFormState);
  };

  return (
    <>
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
        <Suceesfully setIsSend={() => resetForm()} />
      )}
    </>
  );
}
