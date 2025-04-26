"use client";
import { Icons } from "@/icons";
import { useEffect, useState, useCallback } from "react";
import React from "react";
import { Citas } from "@/interface";
import showToast from "@/components/ToastStyle";
import { parseCookies } from "nookies";

interface TableProps {
  users: Citas[];
  headerColumns: { name: string; uid: string; sortable?: boolean }[];
  selectedKeys: Set<React.Key>;
  setSelectedKeys: (keys: Set<React.Key>) => void;
  onCitaDeleted?: (idCita: number) => void;
}

export const TableCitas: React.FC<TableProps> = ({
  users,
  headerColumns,
  selectedKeys,
  setSelectedKeys,
  onCitaDeleted,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  //Funcion para eliminar Citas
  const HandleDeleteCitas = async (idCita: number) => {
    try {
      const cookies = parseCookies();
      const token = cookies["session"];
      const url = `${process.env.NEXT_PUBLIC_API_URL}api/citas/${idCita}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        showToast("success", "Cita eliminada correctamente");
        if (onCitaDeleted) {
          onCitaDeleted(idCita); 
        }
      } else {
        showToast(
          "error",
          data.status_message || "Error de conexión. Intenta nuevamente"
        );
      }
    } catch (error) {
      console.error(error);
      showToast("error", "Error de conexión. Intenta nuevamente");
    }
  };

  const handleSelectAll = useCallback(() => {
    if (selectedKeys.size === users.length) {
      setSelectedKeys(new Set());
    } else {
      const allKeys = new Set(users.map((user) => user.codigo));
      setSelectedKeys(allKeys);
    }
  }, [selectedKeys, users, setSelectedKeys]);

  const handleSelectItem = useCallback(
    (id: string) => {
      const newSelectedKeys = new Set(selectedKeys);
      if (newSelectedKeys.has(id)) {
        newSelectedKeys.delete(id);
      } else {
        newSelectedKeys.add(id);
      }
      setSelectedKeys(newSelectedKeys);
    },
    [selectedKeys, setSelectedKeys]
  );

  const redirectToAtencion = (idCita: number) => {
    localStorage.setItem("idCita", String(idCita));
    window.location.href = "/user/historial/AtencionPaciente";
  };

  const renderCell = useCallback(
    (user: Citas, columnKey: keyof Citas | "actions") => {
      if (columnKey === "actions") {
        return (
          <div className="pl-6 flex gap-4">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <span
                  className="text-lg text-[#634AE2] cursor-pointer active:opacity-50"
                  dangerouslySetInnerHTML={{ __html: Icons.edit }}
                  style={{ width: "1.2em", height: "1.2em" }}
                />
                <div className="absolute bottom-10 left-0 hidden group-hover:block bg-gray-700 text-white text-xs p-1 rounded">
                  Editar cita
                </div>
              </div>
              <span className="text-xs text-[#634AE2] mt-1">Editar</span>
            </div>

            <button
              onClick={() => {
                if (confirm("¿Estás seguro de eliminar esta cita?")) {
                  HandleDeleteCitas(Number(user.idCita));
                }
              }}
              className="flex flex-col items-center pt-1"
            >
              <div className="relative group">
                <span
                  className="text-lg text-[#B158FF] cursor-pointer active:opacity-50"
                  dangerouslySetInnerHTML={{ __html: Icons.delete }}
                  style={{ width: "1.2em", height: "1.2em" }}
                />
                <div className="absolute bottom-10 left-0 hidden group-hover:block bg-red-500 text-white text-xs p-1 rounded">
                  Eliminar cita
                </div>
              </div>
              <span className="text-xs text-[#B158FF] mt-2">Eliminar</span>
            </button>
            <button
              onClick={() => {
                redirectToAtencion(Number(user.idCita));
              }}
              className="flex flex-col items-center pt-1"
            >
            <div className="flex flex-col items-center pt-1">
                <span
                  className="text-lg text-[#3df356] cursor-pointer active:opacity-50"
                  dangerouslySetInnerHTML={{ __html: Icons.hand }}
                  style={{ width: "1.2em", height: "1.2em", fill: "#3df356" }}
                />
                <div className="absolute bottom-10 left-0 hidden group-hover:block bg-lime-500 text-white text-xs p-1 rounded">
                  Agregar Atencion
                </div>
                <span className="text-xs text-[#3df356] mt-2">Atencion</span>
            </div>
            </button>
          </div>
        );
      }

      const cellValue = user[columnKey];

      switch (columnKey) {
        case "paciente":
          return (
            <div className="flex flex-col">
              <span className="font-medium">{cellValue}</span>
            </div>
          );
        case "codigo":
          return (
            <div className="flex flex-col">
              <span className="font-medium">{cellValue}</span>
            </div>
          );
        case "estado":
          return (
            <span
              className={`px-3 py-1 rounded-full text-xs ${
                cellValue === "Confirmado"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {cellValue}
            </span>
          );
        case "fecha_inicio":
          return new Date(cellValue).toLocaleString();
        default:
          return cellValue;
      }
    },
    []
  );

  if (!isClient) {
    return null;
  }

  return (
    <div className="overflow-x-auto max-h-[585px] p-5 w-full mx-auto">
      <table className="w-full text-[#634AE2] border-separate border-spacing-y-2">
        <thead className="sticky top-0 bg-[#6364F4] text-[#fff]">
          <tr>
            <th className="p-4 text-center rounded-tl-full">
              <input
                type="checkbox"
                className="w-4 h-4 rounded-full border-[#634AE2] bg-white focus:ring-0 checked:bg-[#634AE2] appearance-none"
                checked={selectedKeys.size === users.length && users.length > 0}
                onChange={handleSelectAll}
              />
            </th>
            {headerColumns.map((column, index) => (
              <th
                key={column.uid}
                className={`p-4 text-lg font-normal text-center ${
                  index === headerColumns.length - 1 ? "" : ""
                }`}
              >
                {column.name}
              </th>
            ))}
            <th className="p-4 text-center rounded-tr-full">
              <div className="text-lg font-normal text-center">Más</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((item) => (
            <tr
              key={item.codigo}
              className="border-y-4 bg-white hover:bg-gray-100"
            >
              <td className="p-4 text-center rounded-l-3xl">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded-full border-[#634AE2] border-3 bg-white focus:ring-0 checked:bg-[#634AE2] appearance-none"
                  checked={selectedKeys.has(item.codigo)}
                  onChange={() => handleSelectItem(item.codigo)}
                />
              </td>

              {headerColumns.map((column, index) => (
                <td
                  key={column.uid}
                  className={`p-4 text-lg text-center ${
                    index === headerColumns.length - 1 ? "" : ""
                  }`}
                >
                  {renderCell(item, column.uid as keyof Citas)}
                </td>
              ))}
              <td className="p-4 text-center rounded-r-3xl">
                {renderCell(item, "actions")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
