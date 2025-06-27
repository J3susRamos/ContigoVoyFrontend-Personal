"use client";
import React from "react";
import { Citas } from "@/interface";
import DataTable from "@/components/ui/DataTable";
import { Icons } from "@/icons";

interface TableProps {
  filteredCitas: Citas[];
  onDeleteInit: (id: number) => void;
}

export const TableCitas: React.FC<TableProps> = ({
  filteredCitas,
  onDeleteInit,
}) => {
  const headers = [
    "Paciente",
    "Código",
    "Motivo",
    "Estado",
    "Fecha de Inicio",
    "Duración",
    "Más",
  ];

  const redirectToAtencion = (idCita: number) => {
    localStorage.setItem("idCita", String(idCita));
    window.location.href = "/user/historial/AtencionPaciente";
  };

  return (
    <DataTable
      headers={headers}
      data={filteredCitas}
      renderRow={(cita) => (
        <>
          <td className="pl-9 py-4 text-2xl rounded-l-[27px]">O</td>
          <td className="px-2 py-4">{cita.paciente}</td>
          <td className="px-2 py-4">{cita.codigo}</td>
          <td className="px-2 py-4">{cita.motivo}</td>
          <td className="px-2 py-4">{cita.estado}</td>
          <td className="px-2 py-4">{cita.fecha_inicio}</td>
          <td className="px-2 py-4">{cita.duracion}</td>
          <td className="py-4 pr-5 rounded-r-[27px]">
            <div className="w-full h-full flex items-center justify-center">
              <div className="flex flex-row items-center justify-center gap-x-4 mt">

                {/* Editar */}
                <button className="flex flex-col items-center text-2xl dark:text-[#babaff]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="34px"
                    viewBox="0 -960 960 960"
                    width="34px"
                    fill="currentColor"
                    className="text-primary dark:text-[#babaff]"
                  >
                    <path d="M120-120v-142l559.33-558.33q9.34-9 21.5-14 12.17-5 25.5-5 12.67 0 25 5 12.34 5 22 14.33L821-772q10 9.67 14.5 22t4.5 24.67q0 12.66-4.83 25.16-4.84 12.5-14.17 21.84L262-120H120Zm607.33-560.67L772.67-726l-46-46-45.34 45.33 46 46Z" />
                  </svg>
                  <span className="font-light text-sm">Editar</span>
                </button>

                {/* Eliminar */}
                <button
                  onClick={() => onDeleteInit(Number(cita.idCita))}
                  className="flex flex-col items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="34px"
                    viewBox="0 -960 960 960"
                    width="34px"
                    fill="#B158FF"
                    className="text-purple-500 dark:text-purple-400"
                  >
                    <path d="M282.98-140q-25.79 0-44.18-18.39t-18.39-44.18v-532.05H180v-50.25h174.05v-30.51h251.9v30.51H780v50.25h-40.41v532.05q0 25.79-18.39 44.18T677.02-140H282.98Zm96.56-133.23h50.25v-379.08h-50.25v379.08Zm150.67 0h50.25v-379.08h-50.25v379.08Z" />
                  </svg>
                  <span className="text-purple-500 dark:text-purple-400 font-light text-sm">
                    Eliminar
                  </span>
                </button>
                <button className="flex flex-col items-center pt-1 gap-1" onClick={() => {
                redirectToAtencion(Number(cita.idCita));
              }}>
                  <span
                    className="text-2xl text-[#3df356] cursor-pointer active:opacity-50"
                    dangerouslySetInnerHTML={{ __html: Icons.hand }}
                    style={{ width: "1.2em", height: "1.2em", fill: "#3df356" }}
                  />
                  <span className="font-light text-sm text-[#3df356]">Atencion</span>
                </button>
              </div>
            </div>
          </td>
        </>
      )}
    />

  );
};
