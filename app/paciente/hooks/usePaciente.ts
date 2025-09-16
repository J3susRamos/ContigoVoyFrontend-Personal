import { useState, useEffect } from "react";
import { Paciente } from "../types/pacienteInterfaces";

const usePaciente = () => {
  const [paciente, setPaciente] = useState<Paciente | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.rol === "PACIENTE") {
        setPaciente({
          id: +user.id,
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.email || "paciente@contigo.voy",
          telefono: user.telefono || "+51 999 888 777",
          fechaNacimiento: user.fechaNacimiento || "1990-01-01",
        });
      }
    }
  }, []);

  return paciente;
};

export default usePaciente;
