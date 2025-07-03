import RegistroFamiliar from "@/components/User/Pacientes/RegistroFamiliar";
import { useSearchParams } from "next/navigation";
import React from "react";

const RegistroFamiliarWrapper = () => {
  const params = useSearchParams();
  const id = params.get("id");

  if (!id) {
    return (
      <p className="text-center text-red-500 mt-10">
        ID no encontrado en la URL.
      </p>
    );
  }
  return <RegistroFamiliar id={id}/>;
};

export default RegistroFamiliarWrapper;
