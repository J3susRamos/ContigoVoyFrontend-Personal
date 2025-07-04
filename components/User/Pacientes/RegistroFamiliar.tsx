import { FormFamilia } from "@/interface";
import { parseCookies } from "nookies";
import showToastFunction from "../../ToastStyle";
import React, { useCallback, useEffect, useState } from "react";
import HeaderUser from "../HeaderUser";
import Link from "next/link";
import ConfirmDeleteModal from "@/components/ui/confirm-delete-modal";

const RegistroFamiliar = ({ id }: { id: string | null }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasFamily, setHasFamily] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormFamilia>({
    nombre_madre: "",
    estado_madre: "",
    nombre_padre: "",
    estado_padre: "",
    nombre_apoderado: "",
    estado_apoderado: "",
    cantidad_hijos: 0,
    cantidad_hermanos: 0,
    integracion_familiar: "",
    historial_familiar: "",
    paciente: {
      idPaciente: "",
      nombre: "",
      apellido: "",
      codigo: "",
    },
  });

  const handleGetFamilia = useCallback(async () => {
    try {
      const cookies = parseCookies();
      const token = cookies["session"];
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const urlApi = `${apiUrl}api/registros/${id}`;
      const response = await fetch(urlApi, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();

        if (data && data.result) {
          setFormData({
            nombre_madre: data.result.nombre_madre || "",
            estado_madre: data.result.estado_madre || "",
            nombre_padre: data.result.nombre_padre || "",
            estado_padre: data.result.estado_padre || "",
            nombre_apoderado: data.result.nombre_apoderado || "",
            estado_apoderado: data.result.estado_apoderado || "",
            cantidad_hijos: data.result.cantidad_hijos || 0,
            cantidad_hermanos: data.result.cantidad_hermanos || 0,
            integracion_familiar: data.result.integracion_familiar || "",
            historial_familiar: data.result.historial_familiar || "",
            paciente: {
              nombre: data.result.paciente.nombre || "",
              codigo: data.result.paciente.codigo || "",
              apellido: data.result.paciente.apellido || "",
              idPaciente: data.result.paciente.idPaciente || "",
            },
          });
          setHasFamily(true);
        } else {
          setHasFamily(false);
        }
      } else {
        console.log(`No se encontró registro familiar para el paciente`);
        setHasFamily(false);
      }
    } catch (error) {
      console.error("Error al obtener a los familiares:", error);
      setHasFamily(false);
    }
  }, [id]);

  const handleUpdateFamilia = useCallback(async () => {
    try {
      const cookies = parseCookies();
      const token = cookies["session"];
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const urlApi = `${apiUrl}api/registros/${id}`;

      const updateData = {
        nombre_madre: formData.nombre_madre,
        estado_madre: formData.estado_madre,
        nombre_padre: formData.nombre_padre,
        estado_padre: formData.estado_padre,
        nombre_apoderado: formData.nombre_apoderado,
        estado_apoderado: formData.estado_apoderado,
        cantidad_hijos: formData.cantidad_hijos,
        cantidad_hermanos: formData.cantidad_hermanos,
        integracion_familiar: formData.integracion_familiar,
        historial_familiar: formData.historial_familiar,
      };

      const response = await fetch(urlApi, {
        method: !hasFamily ? "POST" : "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Registro familiar actualizado exitosamente:", data);
        showToastFunction(
          "success",
          "Registro familiar actualizado correctamente"
        );
        if (!hasFamily) {
          setHasFamily(true);
        }
      } else {
        console.error("Error al actualizar:", data);
        showToastFunction("error", "Error al actualizar registro familiar");
      }
    } catch (error) {
      console.error("Error al actualizar el registro familiar:", error);
    }
  }, [id, formData, hasFamily]);

  const handleDeleteFamilia = useCallback(async () => {
    if (!id) return false;

    setIsDeleting(true);
    try {
      const cookies = parseCookies();
      const token = cookies["session"];
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const urlApi = `${apiUrl}api/registros/${id}`;

      const response = await fetch(urlApi, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        showToastFunction(
          "success",
          "Registro familiar eliminado exitosamente."
        );
        setHasFamily(false);
        setShowDeleteModal(false);
        setFormData({
          nombre_madre: "",
          estado_madre: "",
          nombre_padre: "",
          estado_padre: "",
          nombre_apoderado: "",
          estado_apoderado: "",
          cantidad_hijos: 0,
          cantidad_hermanos: 0,
          integracion_familiar: "",
          historial_familiar: "",
          paciente: {
            idPaciente: "",
            nombre: "",
            apellido: "",
            codigo: "",
          },
        });
      } else {
        const data = await response.json();
        console.error("Error al eliminar:", data);
      }
    } catch (error) {
      console.error("Error al eliminar el registro familiar:", error);
    } finally {
      setIsDeleting(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      handleGetFamilia();
    }
  }, [id, handleGetFamilia, hasFamily]);

  return (
    <>
      <div className="p-4 dark:bg-[#2e3033] h-[100vh]">
        {/* Header */}
        <HeaderUser title="Registro Familiar" />

        {/* Main Content */}
        <div className="mt-4 sm:mt-6 text-[#634AE2] font-bold text-semibold dark:text-white">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Primera Columna */}
            <div className="bg-[#fff] dark:bg-[#272726] rounded-2xl p-4 sm:p-6 lg:p-8">
              {hasFamily && (
                <div className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="px-4 sm:px-8">
                      <label className="block text-md font-semibold mb-2 text-center">
                        Código del Paciente
                      </label>
                        <input
                          type="text"
                          value={formData.paciente?.codigo}
                          disabled
                          className="w-full pl-4 pr-12 py-2 text-md outline-none focus:ring-0 focus:outline-none rounded-full border-none bg-[#F3F3F3] dark:bg-[#1e1e23] placeholder:text-[#634AE2]"
                        />
                    </div>
                    <div className="px-4 sm:px-8">
                      <label className="block text-md font-semibold mb-2 text-center">
                        Nombre del Paciente
                      </label>
                        <input
                          type="text"
                          value={
                            formData.paciente?.nombre +
                            " " +
                            formData.paciente?.apellido
                          }
                          disabled
                          className="w-full pl-4 pr-12 py-2 text-md outline-none focus:ring-0 focus:outline-none rounded-full border-none bg-[#F3F3F3] dark:bg-[#1e1e23] placeholder:text-[#634AE2]"
                        />
                      </div>
                  </div>
                  </div>
              )}

              {/* Campos de la madre */}
              <div className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <label className="block text-center text-md font-semibold">
                    Nombre de la madre
                  </label>
                  <div className="px-4 sm:px-8">
                    <input
                      type="text"
                      value={formData.nombre_madre}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nombre_madre: e.target.value,
                        })
                      }
                      className="w-full pl-4 pr-3 py-2 text-md outline-none focus:ring-0 focus:outline-none rounded-full border-none bg-[#F3F3F3] dark:bg-[#1e1e23] placeholder:text-[#634AE2]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-center text-md font-semibold">
                    Estado de la madre
                  </label>
                  <div className="px-4 sm:px-8">
                  <select
                      value={formData.estado_madre}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          estado_madre: e.target.value,
                        })
                      }
                      className="w-full pl-4 pr-3 py-2 text-md outline-none focus:ring-0 focus:outline-none rounded-full border-none font-medium bg-[#F3F3F3] dark:bg-[#1e1e23] text-[#634AE2] dark:text-white"
                    >
                      <option value="" disabled>
                        Selecciona el estado del madre
                      </option>
                      <option value="Vivo">Vivo</option>
                      <option value="Fallecido">Fallecido</option>
                      <option value="Desconocido">Desconocido</option>
                      <option value="Ausente">Ausente</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-center text-md font-semibold">
                    Nombre del padre
                  </label>
                  <div className="px-4 sm:px-8">
                    <input
                      type="text"
                      value={formData.nombre_padre}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nombre_padre: e.target.value,
                        })
                      }
                      className="w-full pl-4 pr-3 py-2 text-md outline-none focus:ring-0 focus:outline-none rounded-full border-none bg-[#F3F3F3] dark:bg-[#1e1e23] placeholder:text-[#634AE2]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-center text-md font-semibold">
                    Estado del padre
                  </label>
                  <div className="px-4 sm:px-8">
                  <select
                      value={formData.estado_padre}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          estado_padre: e.target.value,
                        })
                      }
                      className="w-full pl-4 pr-3 py-2 text-md outline-none focus:ring-0 focus:outline-none rounded-full border-none font-medium bg-[#F3F3F3] dark:bg-[#1e1e23] text-[#634AE2] dark:text-white"
                    >
                      <option value="" disabled>
                        Selecciona el estado del padre
                      </option>
                      <option value="Vivo">Vivo</option>
                      <option value="Fallecido">Fallecido</option>
                      <option value="Desconocido">Desconocido</option>
                      <option value="Ausente">Ausente</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Segunda Columna */}
            <div className="bg-[#fff] dark:bg-[#272726] rounded-2xl p-4 sm:p-6 lg:p-8">
              <div className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <label className="block text-center text-md font-semibold">
                    Nombre del apoderado
                  </label>
                  <div className="px-4 sm:px-8">
                    <input
                      type="text"
                      value={formData.nombre_apoderado}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nombre_apoderado: e.target.value,
                        })
                      }
                      className="w-full pl-4 pr-3 py-2 text-md outline-none focus:ring-0 focus:outline-none rounded-full border-none bg-[#F3F3F3] dark:bg-[#1e1e23] placeholder:text-[#634AE2]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="block text-center text-md font-semibold">
                    Estado del apoderado
                  </div>
                  <div className="px-4 sm:px-8">
                    <select
                      value={formData.estado_apoderado}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          estado_apoderado: e.target.value,
                        })
                      }
                      className="w-full pl-4 pr-3 py-2 text-md outline-none focus:ring-0 focus:outline-none rounded-full border-none font-medium bg-[#F3F3F3] dark:bg-[#1e1e23] text-[#634AE2] dark:text-white"
                    >
                      <option value="" disabled>
                        Selecciona el estado del apoderado
                      </option>
                      <option value="Vivo">Vivo</option>
                      <option value="Fallecido">Fallecido</option>
                      <option value="Desconocido">Desconocido</option>
                      <option value="Ausente">Ausente</option>
                    </select>
                  </div>
                </div>

                {/* Campos en línea para cantidades */}

                <div className="px-4 sm:px-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="block text-center text-md font-semibold">
                      Cantidad de hijos
                    </label>
                    <input
                      type="number"
                      value={formData.cantidad_hijos}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cantidad_hijos: Number(e.target.value),
                        })
                      }
                      className="w-full pl-4 pr-3 py-2 text-md outline-none focus:ring-0 focus:outline-none rounded-full border-none bg-[#F3F3F3] dark:bg-[#1e1e23] placeholder:text-[#634AE2]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-center text-md font-semibold">
                      Cantidad de hermanos
                    </label>
                    <input
                      type="number"
                      value={formData.cantidad_hermanos}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cantidad_hermanos: Number(e.target.value),
                        })
                      }
                      className="w-full pl-4 pr-3 py-2 text-md outline-none focus:ring-0 focus:outline-none rounded-full border-none bg-[#F3F3F3] dark:bg-[#1e1e23] placeholder:text-[#634AE2]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-center text-md font-semibold">
                    Integración familiar
                  </label>
                  <div className="px-4 sm:px-8">
                    <textarea
                      value={formData.integracion_familiar}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          integracion_familiar: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full p-3 text-md font-light text-[#634AE2] bg-[#F3F3F3] dark:bg-[#1e1e23] dark:text-white rounded-2xl border-none outline-none focus:ring-0 placeholder:text-[#634AE2] resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-center text-md font-semibold">
                    Historial familiar
                  </label>
                  <div className="px-4 sm:px-8">
                    <textarea
                      value={formData.historial_familiar}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          historial_familiar: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full p-3 text-md font-light text-[#634AE2] bg-[#F3F3F3] dark:bg-[#1e1e23] dark:text-white rounded-2xl border-none outline-none focus:ring-0 placeholder:text-[#634AE2] resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`flex w-full p-4 mt-5 max-sm:flex-col max-sm:gap-2 relative ${
            hasFamily ? "justify-between" : "justify-center"
          }`}
        >
          <Link
            href="/user/pacientes"
            className={`text-[#634AE2] bg-[#fff] dark:bg-[#1e1e23] rounded-full border-2 border-[#634AE2] dark:border-white dark:text-white w-28 sm:h-8 flex items-center justify-center max-sm:w-full max-sm:py-2 ${
              !hasFamily ? "absolute left-4" : ""
            }`}
          >
            Volver
          </Link>
          <button
            onClick={handleUpdateFamilia}
            className="text-white bg-[#634AE2] dark:bg-[#1e1e23] rounded-full border-2 border-[#634AE2] dark:border-white dark:text-white w-28 sm:h-8 max-sm:w-full max-sm:py-2"
          >
            {!hasFamily ? "Registrar" : "Actualizar"}
          </button>

          {hasFamily && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="text-red-500 bg-white hover:bg-red-600 hover:text-white rounded-full border-2 border-red-500 hover:border-red-600 w-28 sm:h-8 transition-colors max-sm:w-full max-sm:py-2"
            >
              Eliminar
            </button>
          )}
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          handleDeleteFamilia().then((success) => {
            if (success) setShowDeleteModal(false);
          });
        }}
        isProcessing={isDeleting}
        message="¿Estás seguro de eliminar este registro familiar?"
      />
    </>
  );
};

export default RegistroFamiliar;
