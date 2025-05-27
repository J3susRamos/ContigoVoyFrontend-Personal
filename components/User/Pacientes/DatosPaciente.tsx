"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { DatosPacienteProps, Paciente } from "@/interface";
import { parseCookies } from "nookies";
import showToast from "@/components/ToastStyle";

const DatosPaciente: React.FC<DatosPacienteProps> = ({ idPaciente }) => {
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const HandleGetPaciente = async (idPaciente: number) => {
    try {
      const cookies = parseCookies();
      const token = cookies["session"];
      const url = `${process.env.NEXT_PUBLIC_API_URL}api/pacientes/${idPaciente}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setPaciente(data.result); // Asume que data.result es un objeto Paciente
        showToast("success", "Paciente obtenido correctamente");
      } else {
        showToast("error", data.message || "Error al obtener el paciente");
      }
    } catch (error) {
      console.error(error);
      showToast("error", "Error de conexión. Intenta nuevamente.");
    }
  };

  useEffect(() => {
    if (idPaciente) {
      HandleGetPaciente(idPaciente).catch(error => {
        console.error("Error fetching patient data:", error);
      });
    }
  }, [idPaciente]);

  return (
    <div>
      <div className="flex justify-center"
        style={{ position: "relative", zIndex: 100, marginTop: "-160px" }}>
      <div className="bg-background mt-4 rounded-3xl p-4 flex justify-around w-full h-full">
        <div className="text-[#634AE2] font-bold flex flex-col gap-y-6">
          {/* Datos del paciente */}
          <div className="flex gap-6">
            <div className="w-28">Nombre</div>
            <div className="font-normal">{paciente?.nombre}</div>
          </div>
          <div className="flex gap-6">
            <div className="w-28">Apellido</div>
            <div className="font-normal">{paciente?.apellido}</div>
          </div>
          <div className="flex gap-6">
            <div className="w-28">Género</div>
            <div className="font-normal">{paciente?.genero}</div>
          </div>
          <div className="flex gap-6">
            <div className="w-28">Fecha de Nacimiento</div>
            <div className="font-normal">
              {paciente
                ? new Date(paciente.fecha_nacimiento).toLocaleDateString(
                    "es-ES",
                    {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    }
                  )
                : "Fecha no disponible"}
            </div>
          </div>
          <div className="flex gap-6">
            <div className="w-28">Ocupación</div>
            <div className="font-normal">{paciente?.ocupacion}</div>
          </div>
          <div className="flex gap-6">
            <div className="w-28">Estado Civil</div>
            <div className="font-normal">{paciente?.estadoCivil}</div>
          </div>
          <div className="flex gap-6">
            <div className="w-28">DNI</div>
            <div className="font-normal">{paciente?.DNI}</div>
          </div>
          <div className="flex gap-6">
            <div className="w-28">Celular</div>
            <div className="font-normal">{paciente?.celular}</div>
          </div>
          <div className="flex gap-6">
            <div className="w-28">Correo</div>
            <div className="font-normal">{paciente?.email}</div>
          </div>
          <div className="flex gap-6">
            <div className="w-28">Dirección</div>
            <div className="font-normal">{paciente?.direccion}</div>
          </div>
        </div>

        <div className="mt-2">
          <Link
            href={`/user/pacientes/DatosPaciente/${idPaciente}`}
            className={cn(
              "bg-transparent text-[#634AE2] border-[#634AE2] border-1 rounded-full py-2 px-4 mt-4 hover:bg-[#634AE2] hover:text-[#fff]"
            )}
          >
            Editar
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
};

export default DatosPaciente;