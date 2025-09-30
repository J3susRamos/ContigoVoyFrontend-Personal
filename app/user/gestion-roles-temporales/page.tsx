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
  // ✅ NUEVOS ESTADOS para búsqueda en agregar permisos
  const [userAdd, setUserAdd] = useState<User | null>(null);
  const [isSearchingAdd, setIsSearchingAdd] = useState(false);

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

  // -------------------- buscar usuario por email (AGREGAR) --------------------
  const fetchUserForAdd = async () => {
    if (!emailAdd) return toast.error("Debe ingresar un correo válido");

    try {
      setIsSearchingAdd(true);
      const cookies = parseCookies();
      const token = cookies["session"];

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/personal/permissions/by-email/${emailAdd}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const data = await res.json();
      if (res.ok) {
        setUserAdd({
          id: data.result.id,
          name: data.result.name,
          email: data.result.email,
          rol: data.result.rol,
          permissions: data.result.permissions,
        });
        setSelectedAdd([]); // Limpiar selección al buscar nuevo usuario
        
        toast.info(`Usuario encontrado con ${data.result.permissions.length} permisos existentes`);
      } else {
        toast.error(data.message || "Usuario no encontrado");
        setUserAdd(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al buscar usuario");
      setUserAdd(null);
    } finally {
      setIsSearchingAdd(false);
    }
  };

  // -------------------- guardar permisos (AGREGAR) --------------------
  const handleSaveAdd = async () => {
    if (!userAdd || selectedAdd.length === 0) return;

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
            email: userAdd.email,
            permissions: selectedAdd,
          }),
        }
      );

      const data = await res.json();
      
      if (res.ok) {
        toast.success(`✅ ${data.permissions_added} permisos agregados correctamente a ${userAdd.name}`);
        
        // ✅ ACTUALIZAR permisos del usuario localmente
        setUserAdd({
          ...userAdd,
          permissions: [...userAdd.permissions, ...selectedAdd]
        });
        
        // Limpiar selección pero mantener usuario
        setSelectedAdd([]);
        
      } else {
        if (data.error_type === 'duplicate_permissions') {
          const duplicateList = data.duplicate_permissions.join(', ');
          toast.error(
            `❌ Error: ${userAdd.name} ya cuenta con: ${duplicateList}`,
            { autoClose: 8000 }
          );
        } else {
          toast.error(data.message || "Error al agregar permisos");
        }
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
    if (!userToEdit || selectedRemove.length === 0) return;

    try {
      setIsSavingRemove(true);
      const cookies = parseCookies();
      const token = cookies["session"];

      // ✅ Usar el nuevo endpoint DELETE para quitar permisos específicos
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/personal/permissions/remove-by-email`,
        {
          method: "DELETE", // ✅ Cambiado a DELETE
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: userToEdit.email,
            permissions: selectedRemove, // ✅ Enviamos solo los permisos a quitar
          }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success("Permisos eliminados correctamente");
        
        // Actualizar el estado local - quitar los permisos eliminados
        const updatedPermissions = userToEdit.permissions.filter(
          (perm) => !selectedRemove.includes(perm)
        );
        
        setUserToEdit({ ...userToEdit, permissions: updatedPermissions });
        setSelectedRemove([]);
      } else {
        toast.error(data.message || "Error al eliminar permisos");
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

        {/* Buscar usuario por correo - ✅ MODIFICADO */}
        <div className="mb-6">
          <label className="block mb-2 text-gray-700 dark:text-gray-300">
            Correo del usuario
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              value={emailAdd}
              onChange={(e) => {
                setEmailAdd(e.target.value);
                // ✅ Limpiar usuario cuando cambia el email
                if (userAdd && userAdd.email !== e.target.value) {
                  setUserAdd(null);
                  setSelectedAdd([]);
                }
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="ejemplo@correo.com"
            />
            <Button
              onPress={fetchUserForAdd}
              disabled={isSearchingAdd}
              className="bg-primary text-white px-6"
            >
              {isSearchingAdd ? "Buscando..." : "Buscar"}
            </Button>
          </div>
        </div>

        {/* ✅ NUEVO: Mostrar información del usuario encontrado */}
        {userAdd && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">
              Usuario encontrado: {userAdd.name}
            </h3>
            <p className="text-sm text-blue-700 mb-2">
              <strong>Email:</strong> {userAdd.email} | 
              <strong> Rol:</strong> {userAdd.rol || 'No asignado'}
            </p>
            {userAdd.permissions.length > 0 ? (
              <div>
                <p className="text-sm text-blue-700 mb-1">
                  <strong>Permisos existentes ({userAdd.permissions.length}):</strong>
                </p>
                <div className="flex flex-wrap gap-1">
                  {userAdd.permissions.map((perm) => (
                    <span 
                      key={perm}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-blue-700">
                Este usuario no tiene permisos asignados.
              </p>
            )}
          </div>
        )}

        {/* Select de permisos - ✅ MODIFICADO: solo mostrar si hay usuario */}
        {userAdd && (
          <div className="mb-6">
            <label className="block mb-2 text-gray-700 dark:text-gray-300">
              Selecciona permisos para agregar
            </label>
            <Select
              selectionMode="multiple"
              placeholder="Selecciona los permisos a agregar"
              selectedKeys={new Set(selectedAdd)}
              onSelectionChange={(keys) => {
                setSelectedAdd(Array.from(keys) as string[]);
              }}
            >
              {permissionsList
                .filter(perm => !userAdd.permissions.includes(perm.name)) // ✅ Filtrar permisos que ya tiene
                .map((perm) => (
                  <SelectItem key={perm.name} textValue={perm.name}>
                    {perm.name}
                  </SelectItem>
                ))
              }
            </Select>
            <p className="text-xs text-gray-500 mt-2">
              Solo se muestran permisos que el usuario no tiene asignados
            </p>
          </div>
        )}

        {/* Botón guardar - ✅ MODIFICADO: solo mostrar si hay usuario */}
        {userAdd && (
          <div className="flex justify-center">
            <Button
              onPress={handleSaveAdd}
              disabled={isSavingAdd || selectedAdd.length === 0}
              className="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-md"
            >
              {isSavingAdd ? "Guardando..." : `Agregar ${selectedAdd.length} permisos`}
            </Button>
          </div>
        )}
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