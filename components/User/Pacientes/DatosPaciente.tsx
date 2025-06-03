"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { DatosPacienteProps, Paciente } from "@/interface";
import { getPaciente } from "@/components/User/Pacientes/getPacienteData";

const DatosPaciente: React.FC<DatosPacienteProps> = ({ idPaciente }) => {
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const HandleGetPaciente = async (idPaciente: number) => {
    const result = await getPaciente(idPaciente);
    if (result.success) {
      setPaciente(result.data);
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
          <div className="bg-card dark:bg-card text-card-foreground dark:text-card-foreground mt-4 rounded-3xl p-4 flex justify-around w-full h-full shadow-lg">
            <div className="text-primary dark:text-primary font-bold flex flex-col gap-y-6">
              {/* Datos del paciente existente*/}
              <div className="flex gap-6">
                <div className="w-28">Nombre</div>
                <div className="font-normal text-foreground dark:text-foreground">{paciente?.nombre}</div>
              </div>
              <div className="flex gap-6">
                <div className="w-28">Apellido</div>
                <div className="font-normal text-foreground dark:text-foreground">{paciente?.apellido}</div>
              </div>
              <div className="flex gap-6">
                <div className="w-28">Género</div>
                <div className="font-normal text-foreground dark:text-foreground">{paciente?.genero}</div>
              </div>
              <div className="flex gap-6">
                <div className="w-28">Fecha de Nacimiento</div>
                <div className="font-normal text-foreground dark:text-foreground">
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
                <div className="font-normal text-foreground dark:text-foreground">{paciente?.ocupacion}</div>
              </div>
              <div className="flex gap-6">
                <div className="w-28">Estado Civil</div>
                <div className="font-normal text-foreground dark:text-foreground">{paciente?.estadoCivil}</div>
              </div>
              <div className="flex gap-6">
                <div className="w-28">DNI</div>
                <div className="font-normal text-foreground dark:text-foreground">{paciente?.DNI}</div>
              </div>
              <div className="flex gap-6">
                <div className="w-28">Celular</div>
                <div className="font-normal text-foreground dark:text-foreground">{paciente?.celular}</div>
              </div>
              <div className="flex gap-6">
                <div className="w-28">Correo</div>
                <div className="font-normal text-foreground dark:text-foreground">{paciente?.email}</div>
              </div>
              <div className="flex gap-6">
                <div className="w-28">Dirección</div>
                <div className="font-normal text-foreground dark:text-foreground">{paciente?.direccion}</div>
              </div>
            </div>

            <div className="mt-2">
              <Link
                  href={`/user/pacientes/DatosCrearPaciente/${idPaciente}`}
                  className={cn(
                      "bg-transparent text-primary dark:text-primary border-primary dark:border-primary border rounded-full py-2 px-4 mt-4 hover:bg-primary dark:hover:bg-primary hover:text-primary-foreground dark:hover:text-primary-foreground transition-colors duration-200"
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
