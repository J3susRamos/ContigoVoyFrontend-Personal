import { FormFamilia } from "@/interface";
import { parseCookies } from "nookies";
import showToastFunction from "../../ToastStyle";
import React, { useCallback, useEffect, useState } from "react";
import HeaderUser from "../HeaderUser";
import ConfirmDeleteModal from "@/components/ui/confirm-delete-modal";
import { useForm } from "react-hook-form";
import FormFieldInput from "@/components/ui/Form/FormFieldInput";
import FormFieldTextArea from "@/components/ui/Form/FormFieldTextArea";
import FormFieldSelect from "@/components/ui/Form/FormFieldSelect";

const estadoOptions = [
  { label: "Vivo", value: "Vivo" },
  { label: "Fallecido", value: "Fallecido" },
  { label: "Desconocido", value: "Desconocido" },
  { label: "Ausente", value: "Ausente" },
];

const defaultValues = {
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
};

const RegistroFamiliar = ({ id }: { id: string | null}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasFamily, setHasFamily] = useState<boolean>(false);
  const [paciente, setPaciente] = useState<FormFamilia["paciente"] | null>(
    null
  );

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormFamilia>({
    defaultValues,
  });

  const handleGetFamilia = useCallback(async () => {
    try {
      const token = parseCookies()["session"];
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}api/registros/${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();

        if (data?.result) {
          const result = data.result;
          reset({
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
          });
          setPaciente({
            nombre: result.paciente.nombre,
            apellido: result.paciente.apellido,
            codigo: result.paciente.codigo,
            idPaciente: result.paciente.idPaciente,
          });
          setHasFamily(true);
        } else {
          setHasFamily(false);
        }
      } else {
        setHasFamily(false);
      }
    } catch (error) {
      console.error("Error al obtener a los familiares:", error);
      setHasFamily(false);
    }
  }, [id, reset]);

  const handleUpdateFamilia = async (data: FormFamilia) => {
    try {
      const token = parseCookies()["session"];
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const url = `${apiUrl}api/registros/${id}`;

      const response = await fetch(url, {
        method: hasFamily ? "PUT" : "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const resData = await response.json();

      if (response.ok) {
        console.log("Registro familiar actualizado exitosamente");
        showToastFunction(
          "success",
          "Registro familiar guardado correctamente"
        );
        if (!hasFamily) {
          setHasFamily(true);
        }
      } else if (!response.ok && resData?.errors) {
        console.error("Error al guardar:", resData);
        Object.entries(resData.errors).forEach(([field, messages]) => {
          setError(field as keyof FormFamilia, {
            type: "server",
            message: Array.isArray(messages) ? messages[0] : messages,
          });
        });
      } else {
        console.log(resData);
        showToastFunction("error", "Error al guardar registro familiar");
      }
    } catch (error) {
      console.error("Error al guardar el registro familiar:", error);
    }
  };

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
        setPaciente(null);
        reset(defaultValues);
      } else {
        console.error(await response.json());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  }, [id, reset]);

  useEffect(() => {
    if (id) {
      handleGetFamilia();
    }
  }, [id, handleGetFamilia, hasFamily]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:bg-[#020202] dark:bg-none">

        {/* Header */}
<div className="bg-white/80 dark:bg-[#020202] border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
          <HeaderUser title="Registro Familiar" />
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-700 dark:text-purple-300 text-sm font-medium mb-4">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Gestión Familiar
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Registro del Núcleo Familiar
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Complete la información familiar del paciente para un mejor seguimiento terapéutico
            </p>
          </div>

          <form onSubmit={handleSubmit(handleUpdateFamilia)} className="max-w-6xl mx-auto">
            {/* Patient Info Card */}
            {hasFamily && paciente && (
              <div className="family-card bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-slate-200 dark:border-slate-700 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {paciente.nombre.charAt(0)}{paciente.apellido.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Información del Paciente
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Datos asociados al registro familiar
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormFieldInput
                    label="Código del Paciente"
                    value={paciente.codigo}
                    readOnly
                  />
                  <FormFieldInput
                    label="Nombre del Paciente"
                    value={paciente.nombre + " " + paciente.apellido}
                    readOnly
                  />
                </div>
              </div>
            )}

            {/* Main Form Content */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Padres y Tutores */}
<div className="family-card bg-white dark:bg-[#19191a] backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white mr-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Padres y Tutores
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Información de figuras parentales
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Madre */}
                  <div className="p-4 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 rounded-xl border border-pink-200 dark:border-pink-800">
                    <h4 className="text-md font-medium text-pink-700 dark:text-pink-300 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      Información Materna
                    </h4>
                    <div className="space-y-4">
                      <FormFieldInput
                        label="Nombre de la madre"
                        name="nombre_madre"
                        register={register}
                        errors={errors}
                      />
                      <FormFieldSelect
                        label="Estado de la madre"
                        errors={errors}
                        register={register}
                        name="estado_madre"
                        placeholder="Selecciona el estado de la madre"
                        options={estadoOptions}
                      />
                    </div>
                  </div>

                  {/* Padre */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
                    <h4 className="text-md font-medium text-blue-700 dark:text-blue-300 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      Información Paterna
                    </h4>
                    <div className="space-y-4">
                      <FormFieldInput
                        label="Nombre del padre"
                        name="nombre_padre"
                        register={register}
                        errors={errors}
                      />
                      <FormFieldSelect
                        label="Estado del padre"
                        errors={errors}
                        register={register}
                        name="estado_padre"
                        placeholder="Selecciona el estado del padre"
                        options={estadoOptions}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Información Familiar Extendida */}
<div className="family-card bg-white dark:bg-[#19191a] backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white mr-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Núcleo Familiar
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Composición y dinámicas familiares
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Apoderado */}
                  <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl border border-amber-200 dark:border-amber-800">
                    <h4 className="text-md font-medium text-amber-700 dark:text-amber-300 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                      </svg>
                      Apoderado Legal
                    </h4>
                    <div className="space-y-4">
                      <FormFieldInput
                        label="Nombre del apoderado"
                        errors={errors}
                        register={register}
                        name="nombre_apoderado"
                      />
                      <FormFieldSelect
                        label="Estado del apoderado"
                        errors={errors}
                        register={register}
                        name="estado_apoderado"
                        placeholder="Selecciona el estado del apoderado"
                        options={estadoOptions}
                      />
                    </div>
                  </div>

                  {/* Composición Familiar */}
                  <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 rounded-xl border border-violet-200 dark:border-violet-800">
                    <h4 className="text-md font-medium text-violet-700 dark:text-violet-300 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                      Composición Familiar
                    </h4>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormFieldInput
                        label="Cantidad de hijos"
                        errors={errors}
                        register={register}
                        name="cantidad_hijos"
                        type="number"
                        min={0}
                      />
                      <FormFieldInput
                        label="Cantidad de hermanos"
                        errors={errors}
                        register={register}
                        name="cantidad_hermanos"
                        type="number"
                        min={0}
                      />
                    </div>
                  </div>

                  {/* Historiales */}
                  <div className="space-y-4">
                    <FormFieldTextArea
                      label="Integración familiar"
                      errors={errors}
                      register={register}
                      rows={4}
                      name="integracion_familiar"
                    />
                    <FormFieldTextArea
                      label="Historial familiar"
                      errors={errors}
                      register={register}
                      rows={4}
                      name="historial_familiar"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-8 flex-wrap">
              {hasFamily && (
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="group px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                >
                  <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 012 0v4a1 1 0 11-2 0V7zM12 7a1 1 0 012 0v4a1 1 0 11-2 0V7z" clipRule="evenodd" />
                  </svg>
                  Eliminar Registro
                </button>
              )}
              <button
                type="submit"
                className="group px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {hasFamily ? "Actualizar Registro" : "Crear Registro"}
              </button>
            </div>
          </form>
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
