"use client";

import { useSearchParams } from "next/navigation";
import EditarPaciente from "@/components/User/Pacientes/EditarPaciente";

const EditarPacienteWrapper = () => {
  const params = useSearchParams();
  const id = params.get("id");

  if (!id) {
    return <p className="text-center text-red-500 mt-10">ID no encontrado en la URL.</p>;
  }

  return <EditarPaciente id={id} />;
};

export default EditarPacienteWrapper;
