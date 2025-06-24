"use client";
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import EditarPacienteWrapper from "./EditarPacienteWrapper";

export default function EditarPacientePage() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Cargando paciente...</p>}>
      <EditarPacienteWrapper />
    </Suspense>
  );
}

