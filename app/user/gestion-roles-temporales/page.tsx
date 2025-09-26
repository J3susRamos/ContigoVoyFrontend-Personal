"use client";

import React, { useEffect, useState } from "react";
import { Button, Select, SelectItem } from "@heroui/react";
import { toast } from "react-toastify";
import { parseCookies } from "nookies";

interface Permission {
  id: number;
  name: string;
}

interface User {
  id?: number;
  name: string;
  email: string;
  rol?: string;
  permissions: string[];
}

export default function Page() {
  // -------------------- estados generales --------------------
  const [permissionsList, setPermissionsList] = useState<Permission[]>([]);

  // -------------------- sección AGREGAR permisos --------------------
  const [emailAdd, setEmailAdd] = useState("");
  const [selectedAdd, setSelectedAdd] = useState<string[]>([]);
  const [isSavingAdd, setIsSavingAdd] = useState(false);

  // -------------------- sección QUITAR permisos --------------------
  const [emailSearch, setEmailSearch] = useState("");
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [selectedRemove, setSelectedRemove] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSavingRemove, setIsSavingRemove] = useState(false);

  // -------------------- cargar lista de permisos dinámicos --------------------
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies["session"];

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/urls/enlaces`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const data = await res.json();
        if (res.ok) {
          setPermissionsList(
            data.result.map((p: any) => ({
              id: p.id,
              name: p.name,
            }))
          );
        } else {
          toast.error(data.message || "Error al cargar permisos");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error de conexión al cargar permisos");
      }
    };

    fetchPermissions();
  }, []);

  // -------------------- guardar permisos (AGREGAR) --------------------
  const handleSaveAdd = async () => {
    if (!emailAdd) return toast.error("Debe ingresar un correo válido");
    try {
      setIsSavingAdd(true);
      const cookies = parseCookies();
      const token = cookies["session"];

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/personal/permissions/update-by-email`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: emailAdd,
            permissions: selectedAdd, // enviamos los names de los permisos
          }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success("Permisos actualizados correctamente");
      } else {
        toast.error(data.message || "Error al actualizar permisos");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error de conexión");
    } finally {
      setIsSavingAdd(false);
    }
  };

  // -------------------- buscar usuario por email (QUITAR) --------------------
  const fetchUserByEmail = async () => {
    if (!emailSearch) return toast.error("Debe ingresar un correo válido");

    try {
      setIsSearching(true);
      const cookies = parseCookies();
      const token = cookies["session"];

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/personal/permissions/by-email/${emailSearch}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const data = await res.json();
      if (res.ok) {
        setUserToEdit({
          id: data.result.id,
          name: data.result.name,
          email: data.result.email,
          rol: data.result.rol,
          permissions: data.result.permissions,
        });
        setSelectedRemove([]);
      } else {
        toast.error(data.message || "Usuario no encontrado");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al buscar usuario");
    } finally {
      setIsSearching(false);
    }
  };

  // -------------------- guardar permisos (QUITAR) --------------------
  const handleSaveRemove = async () => {
    if (!userToEdit) return;

    try {
      setIsSavingRemove(true);
      const cookies = parseCookies();
      const token = cookies["session"];

      const updatedPermissions = userToEdit.permissions.filter(
        (perm) => !selectedRemove.includes(perm)
      );

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/personal/permissions/update-by-email`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: userToEdit.email,
            permissions: updatedPermissions,
          }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success("Permisos eliminados correctamente");
        setUserToEdit({ ...userToEdit, permissions: updatedPermissions });
        setSelectedRemove([]);
      } else {
        toast.error(data.message || "Error al actualizar permisos");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error de conexión");
    } finally {
      setIsSavingRemove(false);
    }
  };

  // -------------------- render --------------------
  return (
    <div className="w-full flex flex-col gap-12 px-4">
      {/* ---------- SECCIÓN AGREGAR PERMISOS ---------- */}
      <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Agregar permisos a un usuario
        </h2>

        {/* Email del usuario */}
        <div className="mb-6">
          <label className="block mb-2 text-gray-700 dark:text-gray-300">
            Correo del usuario
          </label>
          <input
            type="email"
            value={emailAdd}
            onChange={(e) => setEmailAdd(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="ejemplo@correo.com"
          />
        </div>

        {/* Select de permisos */}
        <div className="mb-6">
          <label className="block mb-2 text-gray-700 dark:text-gray-300">
            Selecciona permisos
          </label>
          <Select
            selectionMode="multiple"
            placeholder="Selecciona uno o más permisos"
            selectedKeys={new Set(selectedAdd)}
            onSelectionChange={(keys) => {
              setSelectedAdd(Array.from(keys) as string[]);
            }}
          >
            {permissionsList.map((perm) => (
              <SelectItem key={perm.name} textValue={perm.name}>
                {perm.name}
              </SelectItem>
            ))}
          </Select>
        </div>

        {/* Botón guardar */}
        <div className="flex justify-center">
          <Button
            onPress={handleSaveAdd}
            disabled={isSavingAdd}
            className="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-md"
          >
            {isSavingAdd ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </div>

      {/* ---------- SECCIÓN QUITAR PERMISOS ---------- */}
      <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Quitar permisos a un usuario
        </h2>

        {/* Buscar usuario por correo */}
        <div className="mb-6">
          <label className="block mb-2 text-gray-700 dark:text-gray-300">
            Correo del usuario
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              value={emailSearch}
              onChange={(e) => setEmailSearch(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="ejemplo@correo.com"
            />
            <Button
              onPress={fetchUserByEmail}
              disabled={isSearching}
              className="bg-primary text-white px-6"
            >
              {isSearching ? "Buscando..." : "Buscar"}
            </Button>
          </div>
        </div>

        {/* Lista de permisos actuales */}
        {userToEdit && (
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Permisos actuales de {userToEdit.name}:
            </h3>
            {userToEdit.permissions.length > 0 ? (
              <>
                <Select
                  selectionMode="multiple"
                  placeholder="Selecciona permisos a quitar"
                  selectedKeys={new Set(selectedRemove)}
                  onSelectionChange={(keys) =>
                    setSelectedRemove(Array.from(keys) as string[])
                  }
                >
                  {userToEdit.permissions.map((perm) => (
                    <SelectItem key={perm} textValue={perm}>
                      {perm}
                    </SelectItem>
                  ))}
                </Select>

                <div className="flex justify-center mt-6">
                  <Button
                    onPress={handleSaveRemove}
                    disabled={isSavingRemove || selectedRemove.length === 0}
                    className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md"
                  >
                    {isSavingRemove
                      ? "Guardando..."
                      : "Quitar permisos seleccionados"}
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                Este usuario no tiene permisos asignados.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

