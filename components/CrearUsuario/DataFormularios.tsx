import { CreatePersonal } from "@/app/apiRoutes";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/icons/iconsvg";
import { FormData, SelectItemI, Roles, Personal } from "@/interface";
import { Flags } from "@/utils/flagsPsicologos";
import {
  Button,
  DatePicker,
  DateValue,
  Form,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { getLocalTimeZone, today } from "@internationalized/date";
import React, { useEffect, useState } from "react";
import showToast from "../ToastStyle";
import { parseCookies } from "nookies";
import { toast } from "react-toastify";
import { Suceesfully } from "./SuccesFull";

// Obtener estos datos de manera dinamica
const genders: SelectItemI[] = [
  {
    textValue: "femenino",
    showLabel: "Femenino",
  },
  {
    textValue: "masculino",
    showLabel: "Masculino",
  },
  {
    textValue: "otro",
    showLabel: "Otro",
  },
];

//Roles
const roles: Roles[] = [
  {
    textValue: "ADMINISTRADOR",
    showLabel: "ADMINISTRADOR",
  },
  {
    textValue: "PSICOLOGO",
    showLabel: "PSICOLOGO",
  },
  {
    textValue: "COMUNICACION",
    showLabel: "COMUNICACION",
  },
  {
    textValue: "MARKETING",
    showLabel: "MARKETING",
  },
];

// Permisos para ver secciones del sidebar
type Permission = {
  id: number;
  name: string;
};

// Obtener estos datos de manera dinamica
const titles: SelectItemI[] = [
  {
    textValue: "Pedagogo",
    showLabel: "Pedagogo",
  },
  {
    textValue: "Psicoanalista",
    showLabel: "Psicoanalista",
  },
  {
    textValue: "Terapeuta",
    showLabel: "Terapeuta",
  },
  {
    textValue: "Pediatra",
    showLabel: "Pediatra",
  },
  {
    textValue: "Conductual",
    showLabel: "Conductual",
  },
];

export const PersonalForm = ({
  onNext,
  initialFormData,
}: {
  onNext: (data: FormData) => void;
  initialFormData: FormData;
}) => {
  const [permissionsList, setPermissionsList] = useState<Permission[]>([]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const cookies = parseCookies();
        const token = cookies["session"];

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/urls/enlaces`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          console.log("Permisos obtenidos:", data.result);
          setPermissionsList(data.result);
        } else {
          console.error("Error en la solicitud:", data);
        }
      } catch (error) {
        console.error("Error al obtener permisos:", error);
      }
    };
    fetchPermissions();
  }, []);

  const [isSend, setIsSend] = useState(false);
  const [isVisible, setIsVisible] = React.useState(false);
  const [formData, setFormData] = React.useState<FormData>(initialFormData);
  const [rol, setRol] = React.useState("PSICOLOGO");
  const [permissions, setPermissions] = React.useState<number[]>([]);
  const resetForm = () => {
    setFormData(initialFormData);
    setRol("PSICOLOGO");
    setPermissions([]);
  };
  const toggleVisibility = () => setIsVisible(!isVisible);
  const handleSubmit = (e: React.FormEvent) => {
    console.log(formData);
    e.preventDefault();
    onNext(formData);
  };

  // Función de utilidad para transformar fecha
  const formatFechaNacimiento = (fecha: string | DateValue | Date): string => {
    if (!fecha) return ""; // 👈 devolvemos string vacío en lugar de null

    if (typeof fecha === "string") {
      return fecha;
    }

    if (fecha instanceof Date) {
      return fecha.toISOString().split("T")[0];
    }

    return `${fecha.year}-${String(fecha.month).padStart(2, "0")}-${String(
      fecha.day
    ).padStart(2, "0")}`;
  };

  const handleSubmitCreatePersonal = async () => {
    try {
      setIsSend(true);
      const updatedFormData = {
        ...formData,
        permissions: permissions,
        imagen: null,
      };
      const personalData: Personal = {
        apellido: updatedFormData.apellido,
        email: updatedFormData.email,
        fecha_nacimiento: formatFechaNacimiento(
          updatedFormData.fecha_nacimiento
        ),
        name: updatedFormData.name,
        password: updatedFormData.password,
        permissions: updatedFormData.permissions,
        rol: rol,
        imagen: null,
      };
      console.log(
        "📤 Datos que se envían al backend:",
        JSON.stringify(personalData, null, 2)
      );

      const response = await CreatePersonal(personalData);
      showToast("success", "Personal creado exitosamente");
      console.log("Personal creado exitosamente:", response);

      resetForm();
      setIsSend(false);
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null) {
        const err = error as {
          message?: string;
          errors?: { email?: string[] };
        };
        showToast(
          "error",
          err.errors?.email?.[0] || err.message || "Error desconocido"
        );
        console.error("Error al crear personal:", err);
      } else {
        showToast("error", "Error inesperado");
        console.error("Error desconocido:", error);
      }
      setIsSend(false);
    }
  };

  const handleChangeRol = (value: string) => {
    setRol(value);
    setFormData((prev) => ({ ...prev, rol: value }));
  };

  const especialidadesMap: Record<string, number> = {
    "cognitivo-conductual": 1,
    neuropsicologia: 2,
    psicoanalisis: 3,
    psicopedagogia: 4,
    gestalt: 5,
    "racional-emotivo": 6,
    default: 7,
  };

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmitCreatePsicologo = async () => {
    try {
      setIsSend(true);

      const cookies = parseCookies();
      const token = cookies["session"];

      // Asegurar que la fecha vaya como YYYY-MM-DD
      const fechaNacimiento = formData.fecha_nacimiento
        ? formatFechaNacimiento(formData.fecha_nacimiento)
        : null;

      // Validar especialidades
      const especialidadesFinal = especialidadesMap["default"]
        ? [especialidadesMap["default"]]
        : [];

      const payload = {
        ...formData,
        fecha_nacimiento: fechaNacimiento,
        especialidades: especialidadesFinal,
      };

      console.log(" Datos enviados al backend (Psicólogo):", payload);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/psicologos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Éxito:", data.description);
        setShowSuccessModal(true);
      } else {
        toast.warn(data.message || "Error al crear el psicólogo", {
          position: "bottom-right",
          autoClose: 2000,
        });
        console.error("Error en la solicitud:", data);
      }
    } catch (error) {
      toast.error("Error de conexión. Intenta más tarde.", {
        position: "top-center",
        autoClose: 2000,
      });
      console.error("Error al enviar al backend:", error);
    } finally {
      setIsSend(false);
    }
  };

  const [errorFecha, setErrorFecha] = useState<string | null>(null);

  const handleDateChange = (date: DateValue | null) => {
    if (!date) {
      setErrorFecha("La fecha de nacimiento es obligatoria.");
      return;
    }

    const hoy = new Date();
    const nacimiento = new Date(date.year, date.month - 1, date.day); // cuidado: month empieza en 0
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--; // aún no cumplió años este año
    }

    if (edad < 18) {
      setErrorFecha("Debe ser mayor de 18 años.");
    } else {
      setErrorFecha(null);
      setFormData((prev) => ({
        ...prev,
        fecha_nacimiento: date,
      }));
    }
  };

  return (
    <div className="w-full flex justify-center px-4">
      <div className="w-full max-w-6xl">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700 p-8 md:p-10">
          <div className="text-center mb-10 pb-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-3">
              Datos del Personal
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Complete la información del nuevo miembro del personal
            </p>
          </div>

          <div className="w-full flex justify-center">
            <div className="w-full max-w-5xl flex justify-center">
              <Form
                validationBehavior="native"
                onSubmit={handleSubmit}
                className="w-full flex flex-col items-center"
              >
                <div className="w-full max-w-4xl flex justify-center">
                  <div className="w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 place-items-center justify-items-center">
                      <div className="w-full max-w-sm flex flex-col space-y-8 mx-auto">
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 w-full">
                          <div className="text-center">
                            <label className="text-gray-800 dark:text-gray-200 font-semibold mb-2 text-base block">
                              Nombre
                            </label>
                          </div>
                          <Input
                            labelPlacement="outside"
                            radius="lg"
                            classNames={{
                              inputWrapper:
                                "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-primary focus-within:!border-primary transition-all duration-200 shadow-sm w-full",
                              input:
                                "text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 py-3 text-center w-full",
                            }}
                            placeholder="Ingrese el nombre completo"
                            type="text"
                            isRequired
                            value={formData.name}
                            variant="bordered"
                            autoComplete="username"
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                          />
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 w-full">
                          <div className="space-y-3">
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-gray-800 dark:text-gray-200 font-semibold text-base">
                                Fecha de nacimiento
                              </span>
                              <span className="text-danger">*</span>
                            </div>
                            <div className="w-full flex justify-center">
                              <div className="w-full">
                                <DatePicker
                                  labelPlacement="outside"
                                  isRequired
                                  variant="bordered"
                                  maxValue={today(getLocalTimeZone())}
                                  showMonthAndYearPickers
                                  radius="lg"
                                  classNames={{
                                    inputWrapper:
                                      "flex items-center justify-center border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-primary focus-within:!border-primary transition-all duration-200 shadow-sm w-full h-12", // <-- altura fija y centrado
                                    input:
                                      "text-gray-900 dark:text-white text-center w-full placeholder:text-center",
                                  }}
                                  onChange={handleDateChange}
                                />
                                {errorFecha && (
                                  <p className="text-red-500 text-sm mt-2">
                                    {errorFecha}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 w-full">
                          <div className="text-center">
                            <label className="text-gray-800 dark:text-gray-200 font-semibold mb-2 text-base block">
                              Género
                            </label>
                          </div>
                          <Select
                            labelPlacement="outside"
                            isRequired
                            radius="lg"
                            variant="bordered"
                            selectedKeys={[formData.genero]}
                            classNames={{
                              trigger:
                                "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-primary data-[open=true]:border-primary transition-all duration-200 shadow-sm px-4 py-3 w-full",
                              value:
                                "text-gray-900 dark:text-white text-center",
                              listboxWrapper: "dark:bg-gray-800",
                              popoverContent:
                                "dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-xl",
                            }}
                            placeholder="Seleccione el género"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                genero: e.target.value,
                              })
                            }
                          >
                            {genders.map((gender) => (
                              <SelectItem
                                className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                textValue={gender.textValue}
                                key={gender.textValue}
                              >
                                {gender.showLabel}
                              </SelectItem>
                            ))}
                          </Select>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 w-full">
                          <div className="text-center">
                            <label className="text-gray-800 dark:text-gray-200 font-semibold mb-2 text-base block">
                              E-mail
                            </label>
                          </div>
                          <Input
                            labelPlacement="outside"
                            isRequired
                            radius="lg"
                            value={formData.email}
                            classNames={{
                              inputWrapper:
                                "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-primary focus-within:!border-primary transition-all duration-200 shadow-sm w-full",
                              input:
                                "text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 py-3 text-center w-full",
                            }}
                            placeholder="ejemplo@correo.com"
                            type="email"
                            autoComplete="email"
                            variant="bordered"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 w-full">
                          <div className="text-center">
                            <label className="text-gray-800 dark:text-gray-200 font-semibold mb-2 text-base block">
                              Rol
                            </label>
                          </div>
                          <Select
                            labelPlacement="outside"
                            isRequired
                            radius="lg"
                            variant="bordered"
                            selectedKeys={[rol]}
                            aria-label="Seleccionar rol"
                            classNames={{
                              trigger:
                                "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-primary data-[open=true]:border-primary transition-all duration-200 shadow-sm px-4 py-3 w-full",
                              value:
                                "text-gray-900 dark:text-white text-center",
                              listboxWrapper: "dark:bg-gray-800",
                              popoverContent:
                                "dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-xl",
                            }}
                            placeholder="Seleccione el rol"
                            onChange={(e) => handleChangeRol(e.target.value)}
                          >
                            {roles.map((rol) => (
                              <SelectItem
                                className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                textValue={rol.textValue}
                                key={rol.textValue}
                              >
                                {rol.showLabel}
                              </SelectItem>
                            ))}
                          </Select>
                        </div>
                      </div>

                      <div className="w-full max-w-sm flex flex-col space-y-8 mx-auto">
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 w-full">
                          <div className="text-center">
                            <label className="text-gray-800 dark:text-gray-200 font-semibold mb-2 text-base block">
                              Apellido
                            </label>
                          </div>
                          <Input
                            labelPlacement="outside"
                            radius="lg"
                            variant="bordered"
                            value={formData.apellido}
                            classNames={{
                              inputWrapper:
                                "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-primary focus-within:!border-primary transition-all duration-200 shadow-sm w-full",
                              input:
                                "text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 py-3 text-center w-full",
                            }}
                            isRequired
                            placeholder="Ingrese el apellido completo"
                            type="text"
                            autoComplete="username"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                apellido: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 w-full">
                          <div className="space-y-3">
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-gray-800 dark:text-gray-200 font-semibold text-base">
                                País
                              </span>
                              <span className="text-danger">*</span>
                            </div>
                            <div className="w-full flex justify-center">
                              <div className="w-full">
                                <Select
                                  labelPlacement="outside"
                                  isRequired
                                  radius="lg"
                                  variant="bordered"
                                  selectedKeys={
                                    formData.pais ? [formData.pais] : []
                                  }
                                  classNames={{
                                    trigger:
                                      "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-primary data-[open=true]:border-primary transition-all duration-200 shadow-sm px-4 py-3 w-full",
                                    value:
                                      "text-gray-900 dark:text-white text-center",
                                    listboxWrapper: "dark:bg-gray-800",
                                    popoverContent:
                                      "dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-xl",
                                  }}
                                  placeholder="Seleccione el país de residencia"
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      pais: e.target.value,
                                    })
                                  }
                                >
                                  {Flags.map((item) => (
                                    <SelectItem
                                      className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                      textValue={item.value}
                                      key={item.value}
                                    >
                                      {item.label}
                                    </SelectItem>
                                  ))}
                                </Select>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 w-full">
                          <div className="text-center">
                            <label className="text-gray-800 dark:text-gray-200 font-semibold mb-2 text-base block">
                              Contraseña
                            </label>
                          </div>
                          <Input
                            name="password"
                            isRequired
                            radius="lg"
                            minLength={8}
                            labelPlacement="outside"
                            autoComplete="current-password"
                            value={formData.password}
                            placeholder="Mínimo 8 caracteres"
                            classNames={{
                              inputWrapper:
                                "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-primary focus-within:!border-primary transition-all duration-200 shadow-sm w-full",
                              input:
                                "text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 py-3 text-center w-full",
                            }}
                            endContent={
                              <button
                                aria-label={
                                  isVisible
                                    ? "Ocultar contraseña"
                                    : "Mostrar contraseña"
                                }
                                type="button"
                                className="focus:outline-none mr-2"
                                onClick={toggleVisibility}
                              >
                                {isVisible ? (
                                  <EyeSlashFilledIcon
                                    className="text-2xl text-gray-400 dark:text-gray-500 pointer-events-none"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <EyeFilledIcon
                                    className="text-2xl text-gray-400 dark:text-gray-500 pointer-events-none"
                                    aria-hidden="true"
                                  />
                                )}
                              </button>
                            }
                            type={isVisible ? "text" : "password"}
                            variant="bordered"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                password: e.target.value,
                              })
                            }
                          />
                        </div>
                        {rol === "PSICOLOGO" ? (
                          <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 w-full">
                            <div className="text-center">
                              <label className="text-gray-800 dark:text-gray-200 font-semibold mb-2 text-base block">
                                Título Profesional
                              </label>
                            </div>
                            <Select
                              name="titulo"
                              isRequired
                              radius="lg"
                              labelPlacement="outside"
                              value={formData.titulo}
                              aria-label="Seleccionar título profesional"
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  titulo: e.target.value,
                                })
                              }
                              placeholder="Seleccione el título profesional"
                              variant="bordered"
                              selectedKeys={[formData.titulo]}
                              classNames={{
                                trigger:
                                  "border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-primary data-[open=true]:border-primary transition-all duration-200 shadow-sm px-4 py-3 w-full",
                                value:
                                  "text-gray-900 dark:text-white text-center",
                                listboxWrapper: "dark:bg-gray-800",
                                popoverContent:
                                  "dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-xl",
                              }}
                            >
                              {titles.map((title) => (
                                <SelectItem
                                  key={title.textValue}
                                  textValue={title.textValue}
                                  className="flex items-center justify-between px-3 py-2 rounded-md cursor-pointer text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  {title.showLabel}
                                </SelectItem>
                              ))}
                            </Select>
                          </div>
                        ) : null}

                        {rol !== "PSICOLOGO" ? (
                          <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 w-full">
                            <div className="text-center">
                              <label className="text-gray-800 dark:text-gray-200 font-semibold mb-2 text-base block">
                                Asignar permiso
                              </label>
                            </div>
                            <Select
                              name="permissions"
                              isRequired
                              radius="lg"
                              labelPlacement="outside"
                              selectionMode="multiple"
                              aria-label="Seleccionar permisos"
                              placeholder="Seleccione el permiso del personal."
                              variant="bordered"
                              selectedKeys={
                                new Set(permissions.map((p) => String(p)))
                              }
                              onSelectionChange={(keys) => {
                                const selected = Array.from(keys).map((k) =>
                                  Number(k)
                                ); // convierto a number
                                setPermissions(selected);
                                setFormData((prev) => ({
                                  ...prev,
                                  permissions: selected,
                                }));
                              }}
                            >
                              {permissionsList
                                .filter(
                                  (perm) =>
                                    perm.id !== undefined && perm.id !== null
                                )
                                .map((perm) => (
                                  <SelectItem
                                    key={String(perm.id)}
                                    textValue={perm.name}
                                  >
                                    {perm.name}
                                  </SelectItem>
                                ))}
                            </Select>
                          </div>
                        ) : (
                          <div></div>
                        )}
                        {permissions.length > 0 && rol !== "PSICOLOGO" && (
                          <div className="mt-4 flex flex-wrap gap-2 justify-center">
                            {permissions.map((permId, idx) => {
                              const permName =
                                permissionsList.find((p) => p.id === permId)
                                  ?.name || permId;
                              return (
                                <span
                                  key={idx}
                                  className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary font-medium border border-primary/30"
                                >
                                  {permName}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {rol === "PSICOLOGO" ? (
                  <div className="flex justify-center mt-12 pt-8 border-t border-gray-100 dark:border-gray-700 w-full">
                    <Button
                      radius="lg"
                      type="button"
                      size="lg"
                      disabled={isSend}
                      onPress={handleSubmitCreatePsicologo}
                      className="px-12 py-4 bg-primary hover:bg-primary/90 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      {isSend ? "Creando..." : "Crear Psicólogo"}
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-center mt-12 pt-8 border-t border-gray-100 dark:border-gray-700 w-full">
                    <Button
                      radius="lg"
                      size="lg"
                      type="button"
                      disabled={isSend}
                      onPress={handleSubmitCreatePersonal}
                      className="px-12 py-4 bg-primary hover:bg-primary/90 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      {isSend ? "Creando..." : "Crear Personal"}
                    </Button>
                  </div>
                )}
              </Form>
              {showSuccessModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <Suceesfully
                    setIsSend={() => {
                      resetForm(); // limpiar el formulario
                      setShowSuccessModal(false); // cerrar modal
                      setIsSend(false);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
