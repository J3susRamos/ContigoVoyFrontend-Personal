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
  setSelectedKeysAction: (keys: Set<React.Key>) => void;
  onCitaDeleted?: (idCita: number) => void;
  menuOpen: boolean;
}

export const TableCitas: React.FC<TableProps> = ({
  users,
  headerColumns,
  selectedKeys,
  setSelectedKeysAction,
  onCitaDeleted,
  menuOpen,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  //Funcion para eliminar Citas
  const HandleDeleteCitas = useCallback(
    async (idCita: number) => {
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
    },
    [onCitaDeleted]
  );

  const handleSelectAll = useCallback(() => {
    if (selectedKeys.size === users.length) {
      setSelectedKeysAction(new Set());
    } else {
      const allKeys = new Set(users.map((user) => user.codigo));
      setSelectedKeysAction(allKeys);
    }
  }, [selectedKeys, users, setSelectedKeysAction]);

  const handleSelectItem = useCallback(
    (id: string) => {
      const newSelectedKeys = new Set(selectedKeys);
      if (newSelectedKeys.has(id)) {
        newSelectedKeys.delete(id);
      } else {
        newSelectedKeys.add(id);
      }
      setSelectedKeysAction(newSelectedKeys);
    },
    [selectedKeys, setSelectedKeysAction]
  );

  const redirectToAtencion = (idCita: number) => {
    localStorage.setItem("idCita", String(idCita));
    window.location.href = "/user/historial/AtencionPaciente";
  };

  const handleDeleteCita = useCallback(
    (idCita: number) => {
      if (confirm("¿Estás seguro de eliminar esta cita?")) {
        HandleDeleteCitas(idCita).catch((error) => {
          console.error("Error deleting appointment:", error);
        });
      }
    },
    [HandleDeleteCitas]
  );

  const renderCell = useCallback(
    (user: Citas, columnKey: keyof Citas | "actions") => {
      if (columnKey === "actions") {
        return (
          <div className="pl-6 flex gap-4">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <span
                  className="text-lg text-primary dark:text-primary-foreground cursor-pointer active:opacity-50"
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
              onClick={() => handleDeleteCita(Number(user.idCita))}
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
                  ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
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
    [handleDeleteCita]
  );

  if (!isClient) {
    return null;
  }
  return (
    <div className="max-w-screen-2xl mx-auto w-full pt-9 px-8">
      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <div className="overflow-auto max-h-[calc(100vh-300px)] relative"> 
          <table className={`w-full border-separate border-spacing-y-4 ${menuOpen && "opacity-50"}`}>
            <thead className="sticky top-0 z-10 bg-clip-padding">
              <tr className="bg-[#6265f4] dark:bg-primary text-primary-foreground dark:text-primary-foreground h-11 relative"> 
                <th className="rounded-tl-full text-xl font-normal py-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#6265f4] dark:bg-primary -z-10 rounded-tl-full"></div>
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded-full border-[#634AE2] bg-white focus:ring-0 checked:bg-[#634AE2] appearance-none relative z-10"
                    checked={selectedKeys.size === users.length && users.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                {headerColumns.map((column) => (
                  <th
                    key={column.uid}
                    className="p-4 text-lg font-normal text-center text-primary-foreground dark:text-primary-foreground"
                  >
                    {column.name}
                  </th>
                ))}
                <th className="rounded-tr-full font-normal relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#6265f4] dark:bg-primary -z-10 rounded-tr-full"></div>
                  Más
                </th>
              </tr>
            </thead>
            <tbody className="relative text-center bg-card dark:bg-card text-primary dark:text-primary-foreground font-normal text-[16px] leading-[20px]">
              {users.map((item, index) => (
                <tr
                  key={index}
                  className="border-y-4 bg-card dark:bg-card hover:bg-muted dark:hover:bg-muted relative"
                >
                  <td className="p-4 text-center rounded-l-3xl">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded-full border-[#634AE2] border-3 bg-white focus:ring-0 checked:bg-[#634AE2] appearance-none"
                      checked={selectedKeys.has(item.codigo)}
                      onChange={() => handleSelectItem(item.codigo)}
                    />
                  </td>
                  {headerColumns.map((column) => (
                    <td key={column.uid} className="p-4 text-lg text-center">
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
      </div>

      {/* Mobile/Tablet Cards View */}
      <div className="lg:hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map((cita, index) => (
            <div
              key={index}
              className="bg-white dark:bg-card rounded-lg shadow-md border border-gray-200 dark:border-border p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-[#634AE2] bg-white focus:ring-0 checked:bg-[#634AE2] appearance-none"
                    checked={selectedKeys.has(cita.codigo)}
                    onChange={() => handleSelectItem(cita.codigo)}
                  />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-foreground">
                      {cita.paciente}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-muted-foreground">
                      Código: {cita.codigo}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      cita.estado === "Confirmado"
                        ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                    }`}
                  >
                    {cita.estado}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-gray-600 dark:text-muted-foreground">Motivo:</span>
                  <span className="text-sm text-gray-900 dark:text-foreground text-right max-w-[200px]">
                    {cita.motivo}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-muted-foreground">Fecha:</span>
                  <span className="text-sm text-gray-900 dark:text-foreground">
                    {new Date(cita.fecha_inicio).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-muted-foreground">Hora:</span>
                  <span className="text-sm text-gray-900 dark:text-foreground">
                    {new Date(cita.fecha_inicio).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-muted-foreground">Duración:</span>
                  <span className="text-sm text-gray-900 dark:text-foreground">{cita.duracion}</span>
                </div>
              </div>

              <div className="flex justify-around gap-2 pt-4 border-t border-gray-200 dark:border-border">
                <button className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-muted transition-colors">
                  <span
                    className="text-lg text-primary dark:text-primary-foreground"
                    dangerouslySetInnerHTML={{ __html: Icons.edit }}
                    style={{ width: "1.2em", height: "1.2em" }}
                  />
                  <span className="text-xs text-primary dark:text-primary-foreground mt-1">Editar</span>
                </button>

                <button
                  onClick={() => handleDeleteCita(Number(cita.idCita))}
                  className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-muted transition-colors"
                >
                  <span
                    className="text-lg text-[#B158FF]"
                    dangerouslySetInnerHTML={{ __html: Icons.delete }}
                    style={{ width: "1.2em", height: "1.2em" }}
                  />
                  <span className="text-xs text-[#B158FF] mt-1">Eliminar</span>
                </button>

                <button
                  onClick={() => redirectToAtencion(Number(cita.idCita))}
                  className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-muted transition-colors"
                >
                  <span
                    className="text-lg text-[#3df356]"
                    dangerouslySetInnerHTML={{ __html: Icons.hand }}
                    style={{ width: "1.2em", height: "1.2em", fill: "#3df356" }}
                  />
                  <span className="text-xs text-[#3df356] mt-1">Atención</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
