"use client";
import React from "react";
import { Icons } from "@/icons";

type Cita = {
  id: number;
  hora: string;
  descripcion: string;
};

const DEFAULT_APPOINTMENT_DESCRIPTION = "No hay cita programada";

const generateDefaultAppointments = (startHour: number = 1, endHour: number = 24): Cita[] => {
    return Array.from({length: endHour - startHour + 1}, (_, index) => {
        const hour = startHour + index;
        const displayHour = hour === 24 ? 0 : hour;

        return {
            id: hour,
            hora: `${displayHour.toString().padStart(2, '0')}:00`,
            descripcion: DEFAULT_APPOINTMENT_DESCRIPTION
        };
    });
};

const cita: Cita[] = generateDefaultAppointments();

const columns = [
  { key: "hora", label: "Hora" },
  { key: "descripcion", label: "Descripción" },
];

export default function DashboardCitas() {
  return (
    <div className="bg-card w-full pt-8 rounded-2xl">
      <div className="flex rounded-r-full py-5 text-[#fff] bg-[#6364F4] justify-center font-normal text-2xl w-4/6">
        Citas del día
        <button
          className="ml-4 -mt-2 group cursor-pointer outline-none"
          dangerouslySetInnerHTML={{
            __html: Icons.plus.replace(/<svg /, '<svg fill="#E7E7FF" '),
          }}
          style={{
            width: "1.2em",
            height: "1.2em",
          }}
        />
      </div>
      <div className="flex rounded-r-full pl-8 py-2 mt-4 text-[#634AE2] bg-[#E7E7FF] justify-start font-bold text-lg w-4/12">
        Fecha:
        <span className="ml-4 justify-start font-light text-[#634AE2] text-lg">
          Feb,15
        </span>
      </div>

      <div className="flex rounded-r-full pl-8 py-2 mt-3 text-[#634AE2] bg-[#E7E7FF] justify-start font-bold text-lg w-4/12">
        Hora:
      </div>

      <div className="h-[600px] overflow-y-auto p-6 custom-scrollbar">
        <table className="min-w-full table-auto">
          <tbody>
            {cita.map((item) => (
              <tr key={item.id} className="border-b-1 border-[#BABAFF]">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`
                      ${
                        column.key === "hora"
                          ? "font-light text-xl text-[#634AE2] border-r border-[#BABAFF]"
                          : ""
                      } 
                      ${
                        column.key === "descripcion"
                          ? "pr-32 font-light text-lg text-[#BABAFF]"
                          : ""
                      } 
                      py-2 px-4`}
                  >
                    {item[column.key as keyof Cita]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
