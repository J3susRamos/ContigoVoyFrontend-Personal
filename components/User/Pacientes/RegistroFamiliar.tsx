import { FormFamilia } from "@/interface";
import { parseCookies } from "nookies";
import showToastFunction from "../../ToastStyle";
import React, { useCallback, useEffect, useState } from "react";
import HeaderUser from "../HeaderUser";
import Link from "next/link";
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

const RegistroFamiliar = ({ id }: { id: string | null }) => {
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
      <div className="p-4 dark:bg-[#2e3033] min-h-[100vh]">
        {/* Header */}
        <HeaderUser title="Registro Familiar" />
        <form onSubmit={handleSubmit(handleUpdateFamilia)}>
          {/* Main Content */}
          <div className="mt-4 sm:mt-6 text-[#634AE2] font-bold text-semibold dark:text-[#bbbafe]">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {/* Primera Columna */}
              <div className="bg-[#fff] dark:bg-[#272726] rounded-2xl p-4 sm:p-6 lg:p-8">
                {hasFamily && paciente && (
                  <div className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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
                <div className="space-y-4 sm:space-y-6">
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

              {/* Segunda Columna */}
              <div className="bg-[#fff] dark:bg-[#272726] rounded-2xl p-4 sm:p-6 lg:p-8">
                <div className="space-y-4 sm:space-y-6">
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
                  <div className="  grid grid-cols-1 sm:grid-cols-2">
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
              type="submit"
              className="text-white bg-[#634AE2] dark:bg-[#1e1f22] rounded-full border-2 border-[#634AE2] dark:border-white dark:text-white w-28 sm:h-8 max-sm:w-full max-sm:py-2"
            >
              {hasFamily ? "Actualizar" : "Registrar"}
            </button>
            {hasFamily && (
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="text-red-500 bg-[#fff] dark:bg-[#1e1e23] rounded-full border-2 border-red-500 dark:border-white dark:text-white w-28 sm:h-8 flex items-center justify-center max-sm:w-full max-sm:py-2"
              >
                Borrar
              </button>
            )}
          </div>
        </form>
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
