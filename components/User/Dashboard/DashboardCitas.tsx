"use client";
import React from "react";
import { Icons } from "@/icons";

type Cita = {
  id: number;
  hora: string;
  descripcion: string;
};

const cita: Cita[] = [
  { id: 1, hora: "01:00", descripcion: "No hay cita programada" },
  { id: 2, hora: "02:00", descripcion: "No hay cita programada" },
  { id: 3, hora: "03:00", descripcion: "No hay cita programada" },
  { id: 4, hora: "04:00", descripcion: "No hay cita programada" },
  { id: 5, hora: "05:00", descripcion: "No hay cita programada" },
  { id: 6, hora: "06:00", descripcion: "No hay cita programada" },
  { id: 7, hora: "07:00", descripcion: "No hay cita programada" },
  { id: 8, hora: "08:00", descripcion: "No hay cita programada" },
  { id: 9, hora: "09:00", descripcion: "No hay cita programada" },
  { id: 10, hora: "10:00", descripcion: "No hay cita programada" },
  { id: 11, hora: "11:00", descripcion: "No hay cita programada" },
  { id: 12, hora: "12:00", descripcion: "No hay cita programada" },
  { id: 13, hora: "13:00", descripcion: "No hay cita programada" },
  { id: 14, hora: "14:00", descripcion: "No hay cita programada" },
  { id: 15, hora: "15:00", descripcion: "No hay cita programada" },
  { id: 16, hora: "16:00", descripcion: "No hay cita programada" },
  { id: 17, hora: "17:00", descripcion: "No hay cita programada" },
  { id: 18, hora: "18:00", descripcion: "No hay cita programada" },
  { id: 19, hora: "19:00", descripcion: "No hay cita programada" },
  { id: 20, hora: "20:00", descripcion: "No hay cita programada" },
  { id: 21, hora: "21:00", descripcion: "No hay cita programada" },
  { id: 22, hora: "22:00", descripcion: "No hay cita programada" },
  { id: 23, hora: "23:00", descripcion: "No hay cita programada" },
  { id: 24, hora: "24:00", descripcion: "No hay cita programada" },
];

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
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px; /* Ancho del scrollbar */
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1; /* Color del track */
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #BABAFF; /* Color del thumb */
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #BABAFF; /* Color del thumb al hacer hover */
        }
      `}</style>
    </div>
  );
}