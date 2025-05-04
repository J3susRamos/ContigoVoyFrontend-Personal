"use client";

import ListarPacientes from "@/components/PacientesLista/ListarPacientes";

export default function Pacientes() {
  return (
    <div className="bg-background min-h-screen p-4 flex flex-col gap-4">  
   <ListarPacientes />
    </div>
  );
}