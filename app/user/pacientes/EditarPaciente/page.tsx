"use client";
import EditarPaciente from "@/components/User/Pacientes/EditarPaciente";
import { useSearchParams } from "next/navigation";

const EditarPacientePage = () => {
  const params = useSearchParams();
  const id = params.get("id");
  console.log(id);
  
  return <EditarPaciente />;
};

export default EditarPacientePage;